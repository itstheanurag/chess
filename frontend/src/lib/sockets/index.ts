import { getToken } from "@/utils";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

export interface NamedSocket extends Socket {
  namespace: string;
}

type Namespace = "game" | "chat";

interface ConnectSocketOptions {
  namespace: Namespace;
}

export const connectSocket = ({
  namespace,
}: ConnectSocketOptions): NamedSocket => {
  const token = getToken("accessToken") ?? undefined;

  const options = {
    path: "/socket.io/",
    transports: ["websocket"] as string[],
    auth: namespace === "chat" ? undefined : token ? { token } : undefined,
    timeout: 10000,
  };

  const socket = io(`${SOCKET_URL}/${namespace}`, options) as NamedSocket;
  socket.namespace = namespace;

  socket.on("connect", () => {
    console.log(`Connected to ${socket.namespace} as ${socket.id}`);
  });

  socket.on("disconnect", (reason) => {
    console.warn(`Disconnected from ${socket.namespace} (${reason})`);
  });

  socket.on("connect_error", (err) => {
    console.error(`Connection error to ${socket.namespace}:`, err.message);
  });

  return socket;
};
