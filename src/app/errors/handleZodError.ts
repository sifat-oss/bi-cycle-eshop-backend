import { ZodError, ZodIssue } from 'zod'
import { TErrorSource, TGenericErrorResponse } from '../interface/errors'

// zod errorHandler
const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400
  const error: TErrorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      details: issue?.message,
    }
  })

  return {
    statusCode,
    message: 'Validation Error',
    error,
  }
}

export default handleZodError
