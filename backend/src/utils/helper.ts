import { Request, Response, NextFunction, RequestHandler } from "express";

export interface ErrorResponse {
  message: string;
  details?: any;
}

/**
 * Wraps an async route handler to properly catch and forward errors to Express's error handler
 * @param fn - Async route handler function
 * @returns A wrapped route handler that catches async errors
 */
export const asyncHandler = <
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => Promise<any>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Send a standardized success response
 * @param res - Express Response object
 * @param data - Response data
 * @param message - Optional message
 * @param statusCode - Optional HTTP status code (default 200)
 */
export const sendResponse = (
  res: Response,
  data: any,
  message?: string,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message: message || "Success",
    data,
  });
};

/**
 * Send a standardized error response
 * @param res - Express Response object
 * @param error - Error message or object
 * @param statusCode - Optional HTTP status code (default 500)
 * @param details - Optional error details
 */
export const sendError = (
  res: Response,
  error: string | Error,
  statusCode: number = 500,
  details?: any
) => {
  const message = error instanceof Error ? error.message : error;
  return res.status(statusCode).json({
    success: false,
    message,
    details,
  });
};
