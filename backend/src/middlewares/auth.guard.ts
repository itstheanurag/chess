import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "@/config";
import { sendError } from "@/utils/helper";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return sendError(res, "No Authorization Set, authorization denied", 401);
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return sendError(res, "No token, authorization denied", 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.accessTokenSecret);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return sendError(res, "Token is not valid", 401);
  }
};

/**
 * Middleware to check if user has specific role(s)
 */
export const roleGuard = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Not authorized", 401);
    }

    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [req.user.roles];

    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return sendError(res, "Forbidden: Insufficient role", 403);
    }

    next();
  };
};

export const ownerGuard = (options: {
  paramField?: string;
  userField?: string;
  model: any;
  errorMessage?: string;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        paramField = "id",
        userField = "id",
        model,
        errorMessage = "Not authorized to access this resource",
      } = options;

      const resource = await model.findById(req.params[paramField]);

      if (!resource) {
        return sendError(res, "Resource not found", 404);
      }

      // Check if user is the owner
      if (resource[userField].toString() !== req.user.id) {
        return sendError(res, errorMessage, 403);
      }

      (req as any).resource = resource;

      next();
    } catch (err) {
      console.error("Owner guard error:", err);
      return sendError(res, "Server error", 500);
    }
  };
};
