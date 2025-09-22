import http from "http";
import expess from "express";
import { startSocketServer } from "@/libs/socket";
import { config } from "@/config/config";
import { corsMiddleware } from "../cors";
import router from "@/routes";
import { requestLogger } from "@/middlewares/app/logger";
import { notFoundHandler } from "@/middlewares/app/not.found.middleware";
import { errorHandler } from "@/middlewares/app/error.middleware";
import { logRoutes } from "@/middlewares/app";
const app = expess();
const server = http.createServer(app);

app.use(expess.json());
app.use(expess.urlencoded({ extended: true }));
app.use(corsMiddleware);

app.use(requestLogger);
app.use(notFoundHandler);
app.use(errorHandler);

app.use(router);

logRoutes(app);

export const startServer = () => {
  if (server.listening) {
    console.log("Server already running");
    return;
  }

  server.listen(config.server.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.server.port}`);
    console.log(
      `🩺 Health check: http://localhost:${config.server.port}/health`
    );
  });

  startSocketServer(server);
};

export const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};
