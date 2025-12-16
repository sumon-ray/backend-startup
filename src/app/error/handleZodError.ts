import { ZodError } from 'zod'
import { TErrorSources, TGenericErrorResponse } from '../globalTypes/error.type'

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue) => {
    const safePath =
      issue.path && issue.path.length > 0 ? issue.path.join('.') : 'field'

    return {
      path: safePath,
      message: issue.message,
    }
  })
  
  const statusCode = 400

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  }
}

export default handleZodError
