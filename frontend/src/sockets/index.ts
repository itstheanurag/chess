import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export interface NamedSocket extends Socket {
  namespace: string;
}

export const connectSockets = (token?: string) => {
  const commonOptions = {
    path: "/socket.io/",
    transports: ["websocket"],
    auth: token ? { token } : undefined,
    timeout: 10000,
  };

  const game = io(`${SOCKET_URL}/game`, commonOptions) as NamedSocket;
  const chat = io(`${SOCKET_URL}/chat`, {
    ...commonOptions,
    auth: undefined,
  }) as NamedSocket;

  game.namespace = "game";
  chat.namespace = "chat";

  [game, chat].forEach((socket) => {
    socket.on("connect", () => {
      console.log(`Connected to ${socket.namespace} as ${socket.id}`);
    });

    socket.on("disconnect", (reason) => {
      console.warn(`Disconnected from ${socket.namespace} (${reason})`);
    });

    socket.on("connect_error", (err) => {
      console.error(`Connection error to ${socket.namespace}:`, err.message);
    });
  });

  return { game, chat };
};
