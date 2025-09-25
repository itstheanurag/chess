import { Request, Response, NextFunction, RequestHandler } from "express";
import z, { ZodError } from "zod";

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
  statusCode: number = 200,
  data: any,
  message?: string
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
export function sendError(
  res: Response,
  statusCode: number,
  error: unknown,
  details?: unknown
): Response<ErrorResponse> {

  if (error instanceof ZodError) {
    const fieldErrors = z.flattenError(error).fieldErrors;

    return res.status(statusCode).json({
      success: false,
      error: fieldErrors,
      details,
    });
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Unknown error occurred";

  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    details,
  });
}
