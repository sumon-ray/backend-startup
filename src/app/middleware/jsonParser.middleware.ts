import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../error/appError';

export const parseData = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.data && typeof req.body.data === 'string') {
      try {
        const parsedData = JSON.parse(req.body.data);

        req.body = { ...req.body, ...parsedData };
        delete req.body.data;
      } catch (e) {

        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid JSON Format',
          [
            {
              field: 'data',
              message: `The 'data' field contains an invalid JSON string. Your JSON payload has a syntax error (e.g., missing comma, missing quote).`
            }
          ]
        );
      }
    }

    next();
  } catch (error: any) {
    console.error('JSON Parsing Error:', error.message);
    next(error);
  }
};
