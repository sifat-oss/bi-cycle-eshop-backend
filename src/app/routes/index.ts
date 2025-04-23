import { Router } from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { OrderRoutes } from '../modules/order/order.route'
import { BicycleRoutes } from '../modules/bicycle/bicycle.route'

const router = Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/bicycles',
    route: BicycleRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
]

moduleRoutes.forEach((r) => router.use(r.path, r.route))

export default router
