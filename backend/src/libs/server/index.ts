import http from "http";
import express from "express";
import { startSocketServer } from "@/libs/socket";
import { config } from "@/config";
import { corsMiddleware } from "../cors";
import router from "@/routes";
import { requestLogger, notFoundHandler, errorHandler } from "@/middlewares";
import { logRoutes } from "@/middlewares/app";
import { redisClient } from "../redis";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/auth";

const app = express();
const server = http.createServer(app);

const sockets = new Set<import("net").Socket>();
server.on("connection", (socket) => {
  sockets.add(socket);
  socket.on("close", () => sockets.delete(socket));
});

let socketServer: any = null;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

app.use(requestLogger);

// Mount Better Auth routes
app.all("/api/auth/*", toNodeHandler(auth));

app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

logRoutes(app);

export const startServer = async () => {
  if (server.listening) {
    console.log("Server already running");
    return;
  }

  try {
    // Drizzle connects via pool automatically
    console.log("Database initialized");

    await redisClient.connect();

    server.listen(config.server.port, () => {
      console.log(
        `🚀 Server running on http://localhost:${config.server.port}`
      );
      console.log(
        `🩺 Health check: http://localhost:${config.server.port}/health`
      );
    });

    socketServer = startSocketServer(server);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

export const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  try {
    if (redisClient.isOpen) await redisClient.disconnect();
    console.log("Redis disconnected");
  } catch (err) {
    console.error("Error during shutdown:", err);
  }

  server.close(() => {
    console.log("HTTP server closed");
    if (socketServer && typeof socketServer.close === "function") {
      socketServer.close();
      console.log("Socket server closed");
    }
    process.exit(0);
  });

  // Force shutdown after 10s
  setTimeout(() => {
    console.warn(
      `Grace period expired. Forcing close of ${sockets.size} remaining connection(s).`
    );
    sockets.forEach((socket) => socket.destroy());
    process.exit(1);
  }, 10000).unref();
};
