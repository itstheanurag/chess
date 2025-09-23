import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { config } from "@/config/config";

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
      // Get token from handshake auth or headers
      const authHeader = socket.handshake.headers?.authorization;
      const token = authHeader?.split(" ")[1] || socket.handshake?.auth?.token;

      // If no token and auth is required, return error
      if (!token && isAuthRequired) {
        console.warn(
          "Socket connection rejected: No authentication token provided"
        );
        return next(new Error("Authentication error: No token provided"));
      }

      // If no token but auth is not required, continue
      if (!token) {
        return next();
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
        socket.user = decoded;

        // Continue to the next middleware
        next();
      } catch (error) {
        console.error("Socket authentication error:", error);

        if (isAuthRequired) {
          return next(new Error("Authentication error: Invalid token"));
        }

        // If auth is not required, continue
        next();
      }
    } catch (error) {
      console.error("Error in socket authentication middleware:", error);
      return next(new Error("Internal server error during authentication"));
    }
  };
};
