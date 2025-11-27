import { Socket } from "socket.io";
import { auth } from "@/auth";
import { User } from "@/types";

// Extend the Socket interface to include the user property
declare module "socket.io" {
  interface Socket {
    user?: User;
  }
}

/**
 * Socket.IO authentication middleware
 * @param isAuthRequired - Whether authentication is required (default: true)
 * @returns Middleware function for Socket.IO authentication
 */

export const socketAuthGuard = (isAuthRequired: boolean = true) => {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      // Better Auth usually uses cookies, which are passed in the handshake headers
      const headers = new Headers();
      if (socket.handshake.headers.cookie) {
        headers.append("cookie", socket.handshake.headers.cookie);
      }

      // If using bearer token for mobile/other clients, handle that too
      const authHeader = socket.handshake.headers?.authorization;
      if (authHeader) {
        headers.append("authorization", authHeader);
      }

      const session = await auth.api.getSession({
        headers: headers,
      });

      if (!session && isAuthRequired) {
        console.warn("Socket connection rejected: No valid session found");
        return next(new Error("Authentication error: Unauthorized"));
      }

      if (session) {
        socket.user = session.user as User;
      }

      next();
    } catch (error) {
      console.error("Error in socket authentication middleware:", error);
      return next(new Error("Internal server error during authentication"));
    }
  };
};
