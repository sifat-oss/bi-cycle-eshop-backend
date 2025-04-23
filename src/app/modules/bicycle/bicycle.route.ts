import express from 'express'
import { BicycleController } from './bicycle.controller'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'
import validateRequest from '../../middlewares/validateRequest'
import { BicycleValidation } from './bicycle.validation'

const router = express.Router()

router.post(
  '/create-bicycle',
  auth(USER_ROLE.admin),
  validateRequest(BicycleValidation.createBicycleValidationSchema),
  BicycleController.createBicycle,
)
router.get('/:bicycleId', BicycleController.getSpecificBicycle)
router.get('/', BicycleController.getAllBicycles)
router.put(
  '/:bicycleId',
  auth(USER_ROLE.admin),
  validateRequest(BicycleValidation.updateBicycleValidationSchema),
  BicycleController.updateBicycle,
)
router.delete(
  '/:bicycleId',
  auth(USER_ROLE.admin),
  BicycleController.deleteBicycle,
)

export const BicycleRoutes = router
