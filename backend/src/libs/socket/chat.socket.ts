import { Namespace, Socket } from "socket.io";
import { ChatMessage } from "@/types";

interface GameMessagePayload {
  gameId: string;
  userId?: string;
  message: string;
  sentAt: Date;
  socketId: string;
}

export const initializeChatNamespace = (nsp: Namespace) => {
  console.log("Initializing chat namespace", nsp.name);

  nsp.on("connection", (socket: Socket) => {
    console.log("Chat namespace connection:", socket.id);

    // Assuming your socket has user info injected via a guard/middleware
    const userId = (socket.data.userId as string) || undefined;

    socket.on("joinChat", (gameId: string) => {
      socket.join(gameId);
      socket.emit("chatJoined", { room: gameId });
    });

    socket.on("sendMessage", (data: ChatMessage & { gameId: string }) => {
      if (!data.gameId) {
        console.warn("GameId missing in chat message");
        return;
      }

      const payload: GameMessagePayload = {
        gameId: data.gameId,
        userId,
        message: data.message,
        sentAt: new Date(),
        socketId: socket.id,
      };

      nsp.to(data.gameId).emit("newMessage", payload);

      // Queue for async persistence (Kafka, BullMQ, etc.)
      // Example: sendToQueue(payload)
      // sendToQueue(payload); // <-- implement separately
    });

    socket.on("typing", (data: { room: string; user: string }) => {
      socket
        .to(data.room)
        .emit("userTyping", { user: data.user, socketId: socket.id });
    });

    socket.on("disconnect", () =>
      console.log(`Socket ${socket.id} disconnected from chat`)
    );
  });
};
