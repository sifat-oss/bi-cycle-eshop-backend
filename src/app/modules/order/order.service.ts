/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from '../../errors/AppError'
import { Bicycle } from '../bicycle/bicycle.model'
import { User } from '../user/user.model'
import httpStatus from 'http-status'
import { Order } from './order.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { orderSearchTerm } from './order.constant'
import mongoose from 'mongoose'
import { TUserResponse } from '../user/user.interface'
import { orderUtils } from './order.utils'

// create new order
const createOrderIntoDB = async (
  user: TUserResponse,
  payload: { bicycles: { bicycle: string; quantity: number }[] },
  client_ip: string,
) => {
  if (!payload?.bicycles?.length)
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Order is not specified')

  const bicycles = payload.bicycles

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    let totalPrice = 0
    const bicycleDetails = await Promise.all(
      bicycles.map(async (item) => {
        const bicycle = await Bicycle.findById(item?.bicycle)
        if (bicycle) {
          if (bicycle.quantity < item.quantity) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              `Insufficient stock. Only ${bicycle.quantity} items left.`,
            )
          }
          bicycle.quantity -= item.quantity
          if (bicycle.quantity === 0) {
            bicycle.inStock = false
          }
          await bicycle.save({ session })
          const subtotal = bicycle ? (bicycle?.price || 0) * item.quantity : 0
          totalPrice += subtotal
          return item
        } else {
          throw new AppError(httpStatus.NOT_FOUND, 'bicycle not found')
        }
      }),
    )

    const order = await Order.create(
      [{ ...payload, user: user?._id, bicycles: bicycleDetails, totalPrice }],
      { session },
    )

    await User.updateOne(
      { _id: user?._id },
      { $push: { Orders: order[0]._id } },
      { session },
    )

    // payment integration
    const shurjopayPayload = {
      amount: totalPrice,
      order_id: order[0]._id,
      currency: 'BDT',
      customer_name: user.name,
      customer_address: 'nothing',
      customer_email: user.email,
      customer_phone: 'nothing',
      customer_city: 'nothing',
      client_ip,
    }

    const payment = await orderUtils.makePaymentAsync(shurjopayPayload)

    if (payment?.transactionStatus) {
      order[0] = await order[0].updateOne({
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      })
    }

    await session.commitTransaction()
    session.endSession()

    return payment.checkout_url
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, error.message)
  }
}

// verify payment
const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id)

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    )
  }

  return verifiedPayment
}

// get all orders
const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  // const orders = await OrderModel.find().populate('user').populate('bicycle')

  const orderQuery = new QueryBuilder(Order.find(), query)
    .search(orderSearchTerm)
    .filter()
    .sort()
    .pagination()
    .fields()

  const result = await orderQuery.modelQuery

  return result
}

// get single order
const getSingleOrderFromDB = async (id: string) => {
  const result = await Order.findById(id).populate('user').populate('bicycles')
  return result
}

// update order in DB
const updateOrderInDB = async (
  id: string,
  payload: Record<string, unknown>,
) => {
  const { user, bicycles } = payload
  if (user || bicycles) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'User and bicycle cannot be updated',
    )
  }
  const order = await Order.findByIdAndUpdate(id, payload, { new: true })
  return order
}

// Delete order from DB
const deleteOrderFromDB = async (id: string) => {
  const isOrderExist = await Order.findById(id)
  if (!isOrderExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const order = await Order.findByIdAndDelete(id).session(session)
    await User.updateOne(
      { _id: isOrderExist.user },
      { $pull: { Orders: id } },
      { session },
    )

    await session.commitTransaction()
    session.endSession()
    return order
  } catch (error: any) {
    await session.abortTransaction()
    session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, error.message)
  }
}

// calculate total revenue
const calculateTotalRevenueFromDB = async () => {
  const revenue = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
      },
    },
  ])
  return revenue
}

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderInDB,
  deleteOrderFromDB,
  calculateTotalRevenueFromDB,
  verifyPayment,
}
