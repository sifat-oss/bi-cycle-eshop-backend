import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validation'
import { AuthController } from './auth.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/register',
  validateRequest(AuthValidation.registrationValidationSchema),
  AuthController.registrationUser,
)

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
)

router.post(
  '/change-password',
  auth(USER_ROLE.customer, USER_ROLE.admin),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword,
)

router.post('/refresh-token', AuthController.refreshToken)

// TODO: Change password route

export const AuthRoutes = router
