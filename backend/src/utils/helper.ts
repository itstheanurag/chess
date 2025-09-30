import { Request, Response, NextFunction, RequestHandler } from "express";
import z, { ZodError } from "zod";

export interface ErrorResponse {
  message: string;
  details?: any;
}

type ErrorDetails = ZodError | unknown;

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
  message: string | Error,
  details?: ErrorDetails
): Response {
  if (details instanceof ZodError) {
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of details.issues) {
      const field = issue.path.join(".") || "global";
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    }

    return res.status(statusCode).json({
      success: false,
      error: message,
      details: fieldErrors,
    });
  }

  const errorMessage =
    message instanceof Error ? message.message : String(message);

  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    details,
  });
}
