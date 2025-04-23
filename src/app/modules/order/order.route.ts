import express from 'express'
import { OrderController } from './order.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/create-order',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  OrderController.createOrder,
)
router.get(
  '/verification',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  OrderController.verifyPayment,
)
router.get('/revenue', OrderController.calculateTotalRevenue)
router.get(
  '/',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  OrderController.getAllOrders,
)
router.get('/:id', OrderController.getSingleOrder)

router.put('/:id', auth(USER_ROLE.admin), OrderController.updateOrder)

router.delete('/:id', auth(USER_ROLE.admin), OrderController.deleteOrder)

export const OrderRoutes = router
