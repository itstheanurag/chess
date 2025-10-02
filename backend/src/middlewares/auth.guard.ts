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
    return sendError(res, 500, "Server configuration error");
  }

  const authHeader = req.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return sendError(res, 401, "Authorization token missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
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

export async function refreshTokenGuard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const secret = process.env.JWT_REFRESH_SECRET!;

  if (!secret) {
    return sendError(res, 500, "Server configuration error");
  }

  const refreshToken = req.body.token;
  if (!refreshToken) {
    return sendError(res, 401, "Refresh token missing");
  }

  try {
    const decoded = jwt.verify(refreshToken, secret);

    if (!isJwtPayloadOptions(decoded)) {
      return sendError(res, 403, "Invalid refresh token payload");
    }

    const redisKey = `${REDIS_KEYS.refreshTokenKey}:${decoded.id}`;
    const storedToken = await redisClient.get(redisKey);

    if (!storedToken || storedToken !== refreshToken) {
      return sendError(res, 403, "Refresh token expired or invalid");
    }

    req.user = decoded;
    next();
  } catch (err) {
    // console.error("Refresh token verification failed:", err);
    return sendError(res, 403, "Invalid or expired refresh token");
  }
}
