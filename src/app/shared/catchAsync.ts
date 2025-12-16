import { Request, Response, NextFunction, RequestHandler } from 'express';

const catchAsync = <
  Req extends Request = Request, 
  Res extends Response = Response
>(
  fn: (req: Req, res: Res, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req as Req, res as Res, next)).catch(next);
  };
};

export default catchAsync;
