import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "@/utils/helper";
import { AuthenticatedRequest, JwtPayloadOptions } from "@/types";
import { REDIS_KEYS, redisClient } from "@/libs";

function isJwtPayloadOptions(obj: unknown): obj is JwtPayloadOptions {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.email === "string" &&
    typeof o.name === "string"
  );
}

export const authGuard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const secret = process.env.JWT_ACCESS_SECRET!;
  if (!secret) {
    // console.error("JWT_SECRET is not configured");
    return sendError(res, 500, "Server configuration error");
  }

  const authHeader = req.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    // console.log("token doesn't start with Authorization");
    return sendError(res, 401, "Authorization token missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    // console.log("token is missing", token);
    return sendError(res, 401, "Authorization token missing or invalid");
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!isJwtPayloadOptions(decoded)) {
      return sendError(res, 403, "Invalid token payload");
    }

    const userId = decoded.id;
    const redisKey = `${REDIS_KEYS.accessTokenKey}:${userId}`;

    const storedToken = await redisClient.get(redisKey);
    if (!storedToken || storedToken !== token) {
      return sendError(res, 403, "Token expired or invalid (logged out)");
    }

    req.user = decoded;
    next();
  } catch (err) {
    // console.error("JWT verification failed:", err);
    return sendError(res, 403, "Invalid or expired token");
  }
};

/**
 * Middleware to check if user has specific role(s)
 */
export const roleGuard = (roles: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, "Not authorized");
    }

    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [req.user.roles];

    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return sendError(res, 403, "Forbidden: Insufficient role");
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
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        paramField = "id",
        userField = "id",
        model,
        errorMessage = "Not authorized to access this resource",
      } = options;

      const resource = await model.findById(req.params[paramField]);

      if (!resource) {
        return sendError(res, 404, "Resource not found");
      }

      // Check if user is the owner
      if (resource[userField].toString() !== req.user?.id) {
        return sendError(res, 403, errorMessage);
      }

      (req as any).resource = resource;

      next();
    } catch (err) {
      console.error("Owner guard error:", err);
      return sendError(res, 500, "Server error", err);
    }
  };
};
