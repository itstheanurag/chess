import { Server as HttpServer } from "http";
import { Server as IOServer, Namespace } from "socket.io";
import { initializeGameNamespace } from "./game.socket";
import { initializeChatNamespace } from "./chat.socket";
import { socketAuthGuard } from "@/middlewares";
import { config } from "@/config";

export const startSocketServer = (server: HttpServer) => {
  const io = new IOServer(server, {
    cors: config.cors,
    path: "/socket.io/",
    serveClient: false,
    connectTimeout: 10000,
  });

  const namespaces: Record<string, Namespace> = {
    game: io.of("/game"),
    chat: io.of("/chat"),
  };

  Object.entries(namespaces).forEach(([name, nsp]) => {
    // const requiresAuth = name === "game";
    // nsp.use(socketAuthGuard(requiresAuth));

    if (name === "game") initializeGameNamespace(nsp);
    if (name === "chat") initializeChatNamespace(nsp);

    nsp.on("connection", (socket) => {
      console.log(`Client connected to ${name} namespace:`, socket.id);

      socket.on("disconnect", (reason) => {
        console.log(`Client disconnected from ${name} (${reason}):`, socket.id);
      });

      socket.on("error", (err) => {
        console.error(`Socket error in ${name}:`, err);
      });
    });
  });

  return io;
};
