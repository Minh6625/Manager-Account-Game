import { Request, Response, NextFunction } from 'express'
import { AppError } from '../../shared/errors/AppError'
import { config } from '../config'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    })
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      success: false,
      message: 'Database error',
      ...(config.nodeEnv === 'development' && { details: err.message }),
    })
  }

  // Handle validation errors (Zod)
  if (err.name === 'ZodError') {
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: (err as any).errors,
    })
  }

  // Handle unknown errors
  console.error('Unhandled error:', err)
  
  return res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  })
}
