import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
    return;
  }

  // Check if token is in the correct format
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

/**
 * Middleware to check if user has specific role(s)
 */
export const roleGuard = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [req.user.roles];

    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is the owner of a resource
 */
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
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // Check if user is the owner
      if (resource[userField].toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: errorMessage,
        });
      }

      // Attach resource to request for use in the route handler
      (req as any).resource = resource;

      next();
    } catch (err) {
      console.error("Owner guard error:", err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
};
