import mongoose from 'mongoose'
import { TErrorSource, TGenericErrorResponse } from '../interface/errors'

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = 400
  const error: TErrorSource = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        details: val?.message,
      }
    },
  )

  return {
    statusCode,
    message: 'Validation Error',
    error,
  }
}

export default handleValidationError
