import { z } from 'zod'

const createOrderValidationSchema = z.object({
  body: z.object({
    user: z.string().min(1, 'User ID is required.'),
    name: z.string().min(1, 'Name is required.'),
    email: z.string().min(1, 'Email is required.'),
    shippingAddress: z.string().min(1, 'Shipping address is required.'),
    paymentMethod: z.enum(['SurjoPay', 'PayPal', 'Stripe']),
    bicycles: z.array(
      z.object({
        bicycle: z.string().min(1, 'Bicycle ID is required.'),
        quantity: z.number().min(1, 'Quantity must be at least 1.'),
      }),
    ),
    totalPrice: z.number().min(0, 'Total price cannot be negative.'),
    status: z.enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled']),
    transaction: z
      .object({
        id: z.string().optional(),
        transactionStatus: z.string().optional(),
        bank_status: z.string().optional(),
        sp_code: z.string().optional(),
        sp_message: z.string().optional(),
        method: z.string().optional(),
        date_time: z.string().optional(),
      })
      .optional(),
    discount: z.number().min(0, 'Discount cannot be negative.').optional(),
  }),
})
const updateOrderValidationSchema = z.object({
  body: z.object({
    bicycles: z
      .array(
        z.object({
          bicycle: z.string().min(1, 'Bicycle ID is required.'),
          quantity: z.number().min(1, 'Quantity must be at least 1.'),
        }),
      )
      .optional(),
    totalPrice: z.number().min(0, 'Total price cannot be negative.').optional(),
    status: z
      .enum(['Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'])
      .optional(),
    transaction: z
      .object({
        id: z.string().optional(),
        transactionStatus: z.string().optional(),
        bank_status: z.string().optional(),
        sp_code: z.string().optional(),
        sp_message: z.string().optional(),
        method: z.string().optional(),
        date_time: z.string().optional(),
      })
      .optional(),
    discount: z.number().min(0, 'Discount cannot be negative.').optional(),
  }),
})

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
}
