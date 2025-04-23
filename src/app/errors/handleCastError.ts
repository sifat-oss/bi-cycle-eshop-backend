import mongoose from 'mongoose'
import { TErrorSource, TGenericErrorResponse } from '../interface/errors'

const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 400
  const error: TErrorSource = [
    {
      path: err?.path,
      details: err?.message,
    },
  ]

  return {
    statusCode,
    message: 'Invalid id',
    error,
  }
}

export default handleCastError
