import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler to properly catch and forward errors to Express's error handler
 * @param fn - Async route handler function
 * @returns A wrapped route handler that catches async errors
 */
export const asyncHandler = <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
  fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => Promise<any>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
