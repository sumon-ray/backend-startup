import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import { MulterError } from 'multer';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../error/appError';
import handleZodError from '../error/handleZodError';

type TErrorSource = {
  field: string;
  message: string;
};

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: TErrorSource[] | null = null;

  // ZodError api request validation)
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errors = simplifiedError.errorSources.map((e) => ({
      field: String(e.path),
      message: e.message,
    }));
  }

  // Mongoose ValidationError 
  else if (err.name === 'ValidationError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Mongoose Validation Error';
    errors = Object.values(err.errors).map(

      (val: any) => {
        return {
          field: val.path,
          message: val.message,
        };
      },
    );
  }

  // Mongoose E11000 Duplicate Key Error 
  else if (err.code === 11000) {
    statusCode = httpStatus.CONFLICT;
    message = 'Duplicate Key Error';
    try {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      errors = [
        {
          field: field,
          message: `The value "${value}" for field "${field}" is already in use.`,
        },
      ];
    } catch (e) {
      errors = [{ field: '', message: 'A duplicate key error occurred.' }];
    }
  }

  // Mongoose CastError (wrong) ObjectId format)
  else if (err.name === 'CastError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Invalid ID Format';
    errors = [
      {
        field: err.path,
        message: `The value "${err.value}" is not a valid MongoDB ObjectId.`,
      },
    ];
  }

  // JWT Error (Authentication)
  else if (err.name === 'JsonWebTokenError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Authentication Failed';
    errors = [
      {
        field: 'token',
        message: 'Invalid token. Please log in again.',
      },
    ];
  }

  // JWT Token Expired Error (Authentication)
  else if (err.name === 'TokenExpiredError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Authentication Failed';
    errors = [
      {
        field: 'token',
        message: 'Your session has expired. Please log in again.',
      },
    ];
  }

  // custom appError
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [{ field: '', message: err.message }];
  }

  // MulterError 
  else if (err instanceof MulterError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'File Upload Error';

    if (
      err.code === 'LIMIT_UNEXPECTED_FILE' ||
      err.message === 'Unexpected field'
    ) {
      message = 'File Upload Error';
      errors = [
        {
          field: err.field || 'file',
          message: `Too many files uploaded. Please upload only one file for this field.`,
        },
      ];
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'File Limit Exceeded';
      errors = [
        {
          field: err.field || 'file',
          message: `You cannot upload more than the allowed number of files.`,
        },
      ];
    } else if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File Size Limit Exceeded';
      errors = [
        {
          field: err.field || 'file',
          message: `File size exceeds the allowed limit. Please upload a smaller file.`,
        },
      ];
    } else {
      message = 'File Upload Error';
      errors = [{ field: err.field || 'file', message: err.message }];
    }
  }

  // generic error
  else if (err instanceof Error) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = err.message;
    errors = [{ field: '', message: err.message }];
  }

  else {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'An unknown error occurred';

    try {
      const errString = JSON.stringify(err);
      errors = [{ field: 'unknown', message: `Unknown error: ${errString}` }];
    } catch {
      errors = [{ field: 'unknown', message: message }];
    }
  }
  // Error Logging 
  if (config.NODE_ENV === 'production' && statusCode === 500) {
    // here should use Winston or Pino
    console.error('UNHANDLED ERROR:', {
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      message: err.message,
      stack: err.stack,
    });
  }

  // response sending
  res.status(statusCode).json({
    status: false,
    message,
    errors: errors || [{ field: '', message: message }],
    stack: config.NODE_ENV === 'development' ? err?.stack : undefined,
  });
};

export default globalErrorHandler;