import { NextFunction, Request, Response } from 'express'
import { ZodError, ZodObject, ZodRawShape } from 'zod'
import catchAsync from '../shared/catchAsync'

const validateRequest = (schema: ZodObject<ZodRawShape>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const simplifiedErrors = error.issues.map((issue) => ({
          field: issue.path.join('.') || 'field',
          message: issue.message,
        }))

        return res.status(400).json({
          status: false,
          message: 'Validation Error',
          errors: simplifiedErrors,
        })
      }

      next(error)
    }
  })
}

export default validateRequest
