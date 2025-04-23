import express from 'express'
import { UserController } from './user.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'

const router = express.Router()

router.get('/', auth(USER_ROLE.admin), UserController.getAllUsers)

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserController.getSingleUser,
)

router.get(
  '/email/:email',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserController.getSingleUserByEmail,
)

router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.customer),
  UserController.updateUser,
)

router.put('/role/:id', auth(USER_ROLE.admin), UserController.changeUserRole)

router.delete('/:id', auth(USER_ROLE.admin), UserController.deleteUser)

export const UserRoutes = router
