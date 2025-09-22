import { Namespace, Socket } from "socket.io";
import { ChatMessage } from "@/types";

export const initializeChatNamespace = (nsp: Namespace) => {
  console.log("Initializing chat namespace", nsp.name);
  nsp.on("connection", (socket: Socket) => {
    console.log("Chat namespace connection:", socket.id);

    socket.on("joinChat", (room: string) => {
      socket.join(room);
      socket.emit("chatJoined", { room });
    });

    socket.on("sendMessage", (data: ChatMessage) => {
      const messageData = {
        ...data,
        timestamp: new Date(),
        socketId: socket.id,
      };
      nsp.to(data.room).emit("newMessage", messageData);
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
