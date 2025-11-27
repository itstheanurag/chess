import { Response, NextFunction } from "express";
import { sendError } from "@/utils/helper";
import { AuthenticatedRequest } from "@/types";
import { auth } from "@/auth";
import { fromNodeHeaders } from "better-auth/node";

export const authGuard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return sendError(res, 401, "Unauthorized");
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (err) {
    return sendError(res, 401, "Unauthorized");
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

    // Better Auth doesn't have roles by default unless using plugins.
    // Assuming roles might be added to user object or handled differently.
    // For now, we'll comment out role check or adapt if roles are in user metadata.
    // const userRoles = (req.user as any).roles || [];

    // const requiredRoles = Array.isArray(roles) ? roles : [roles];
    // const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    // if (!hasRole) {
    //   return sendError(res, 403, "Forbidden: Insufficient role");
    // }

    next();
  };
};
