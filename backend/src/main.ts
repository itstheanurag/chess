import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/socket";
import { socketAuthGuard } from "./middlewares";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import routes from "./routes/index";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(
    `${Date.now()} - ${req.method} ${req.path} ${req.ip} ${
      req.headers["user-agent"]
    }`
  );
  next();
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "chess-api",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use(routes);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: corsOptions,
  path: "/socket.io/",
  serveClient: false,
  connectTimeout: 10000,
});

// Initialize namespaces
const namespaces = {
  game: io.of("/game"),
  chat: io.of("/chat"),
};

// Apply authentication to namespaces
Object.entries(namespaces).forEach(([namespace, nsp]) => {
  // Game namespace requires auth, chat is optional
  const requiresAuth = namespace === "game";
  nsp.use(socketAuthGuard(requiresAuth));

  // Initialize socket for this namespace
  initializeSocket(nsp, namespace as "game" | "chat");

  nsp.on("connection", (socket) => {
    console.log(`Client connected to ${namespace} namespace:`, socket.id);

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(
        `Client disconnected from ${namespace} (${reason}):`,
        socket.id
      );
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error in ${namespace}:`, error);
    });
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    path: _req.path,
    method: _req.method,
  });
});

// Start the server
const startServer = async () => {
  try {
    // Ensure we're not already listening
    if (server.listening) {
      console.log("Server is already running");
      return;
    }

    const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
    server.listen(PORT, () => {
      const address = server.address();
      const actualPort =
        typeof address === "string" ? PORT : address?.port || PORT;

      console.log("\n🚀 Server started successfully!");
      console.log("=".repeat(50));
      console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔌 API URL: http://localhost:${actualPort}/api`);
      console.log(`🩺 Health check: http://localhost:${actualPort}/health`);
      console.log(`🔌 WebSocket URL: ws://localhost:${actualPort}`);
      console.log("=".repeat(50) + "\n");
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Failed to start server:", errorMessage);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "\nReason:", reason);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

// Handle process termination signals
const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  // Close the HTTP server
  server.close(() => {
    console.log("HTTP server closed");
    console.log("Process terminated");
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

// Handle different termination signals
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
