import mongoose from 'mongoose'
import { TErrorSource, TGenericErrorResponse } from '../interface/errors'

const handleDuplicateError = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 400

  // Regular expression to match the value inside double quotes
  const match = err.message.match(/"([^"]*)"/)

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1]

  const error: TErrorSource = [
    {
      path: '',
      details: `${extractedMessage} already exists`,
    },
  ]

  return {
    statusCode,
    message: 'Duplicate error',
    error,
  }
}

export default handleDuplicateError
