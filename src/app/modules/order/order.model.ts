import { Schema, model } from 'mongoose'
import { TOrder } from './order.interface'

const orderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['SurjoPay', 'PayPal', 'Stripe'],
    },
    bicycles: [
      {
        bicycle: {
          type: Schema.Types.ObjectId,
          ref: 'Bicycle',
          required: true,
        },
        quantity: {
          type: Number,
          required: [true, '{ru}'],
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required.'],
      min: [0, 'Total price cannot be negative.'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    transaction: {
      id: String,
      transactionStatus: String,
      bank_status: String,
      sp_code: String,
      sp_message: String,
      method: String,
      date_time: String,
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative.'],
    },
  },
  {
    timestamps: true,
  },
)

// Create the Order model
export const Order = model<TOrder>('Order', orderSchema)
