import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { config, JWT_CONFIG } from "@/config";

// Extend the Socket interface to include the user property
declare module "socket.io" {
  interface Socket {
    user?: JwtPayload | string;
  }
}

/**
 * Socket.IO authentication middleware
 * @param isAuthRequired - Whether authentication is required (default: true)
 * @returns Middleware function for Socket.IO authentication
 */

export const socketAuthGuard = (isAuthRequired: boolean = true) => {
  return (socket: Socket, next: (err?: Error) => void) => {
    try {
      const authHeader = socket.handshake.headers?.authorization;
      const token = authHeader?.split(" ")[1] || socket.handshake?.auth?.token;

      if (!token && isAuthRequired) {
        console.warn(
          "Socket connection rejected: No authentication token provided"
        );
        return next(new Error("Authentication error: No token provided"));
      }

      if (!token) {
        return next();
      }

      try {
        // Verify token
        const decoded = jwt.verify(
          token,
          JWT_CONFIG.accessTokenSecret
        ) as JwtPayload;
        socket.user = decoded;
        next();
      } catch (error) {
        console.error("Socket authentication error:", error);

        if (isAuthRequired) {
          return next(new Error("Authentication error: Invalid token"));
        }
        next();
      }
    } catch (error) {
      console.error("Error in socket authentication middleware:", error);
      return next(new Error("Internal server error during authentication"));
    }
  };
};
