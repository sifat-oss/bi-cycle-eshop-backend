import { Request, Response } from 'express'
import { OrderServices } from './order.service'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import HttpStatus from 'http-status'
import { User } from '../user/user.model'
import { TUserResponse } from '../user/user.interface'
import { JwtPayload } from 'jsonwebtoken'

// create order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const loginUser: JwtPayload = req.user

  const userData = (await User.findOne({
    email: loginUser.email,
  })) as TUserResponse

  const order = await OrderServices.createOrderIntoDB(
    userData,
    req.body,
    req.ip!,
  )

  sendResponse(res, {
    statusCode: HttpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: order,
  })
})

// get all orders
const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.getAllOrdersFromDB(req.query)

    res.status(200).json({
      message: 'Orders fetched successfully',
      status: true,
      data: result,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        message: error.message,
        success: false,
        error: error,
        stack: error.stack,
      })
    }
  }
}

// get single order
const getSingleOrder = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.getSingleOrderFromDB(req.params.id)

    res.status(200).json({
      message: 'Order fetched successfully',
      status: true,
      data: result,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error,
        stack: error.stack,
      })
    }
  }
}

// calculate total revenue
const calculateTotalRevenue = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.calculateTotalRevenueFromDB()

    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: result,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error,
        stack: error.stack,
      })
    }
  }
}

const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrderServices.verifyPayment(req.query.order_id as string)

  sendResponse(res, {
    statusCode: HttpStatus.CREATED,
    success: true,
    message: 'Order verified successfully',
    data: order,
  })
})

// update order status

const updateOrder = catchAsync(async (req, res) => {
  const order = await OrderServices.updateOrderInDB(req.params.id, req.body)

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Order status updated successfully',
    data: order,
  })
})

// delete order
const deleteOrder = catchAsync(async (req, res) => {
  const order = await OrderServices.deleteOrderFromDB(req.params.id)

  sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Order deleted successfully',
    data: order,
  })
})

export const OrderController = {
  createOrder,
  calculateTotalRevenue,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  verifyPayment,
}
