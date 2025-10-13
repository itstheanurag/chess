import { ChatState, ChatMessage } from "@/types";
import { create } from "zustand";
import { connectSocket, NamedSocket } from "@/lib";

export const useChatStore = create<ChatState>((set, get) => {
  let chatSocket: NamedSocket | null = null;

  const initializeSocket = () => {
    if (chatSocket) return;

    chatSocket = connectSocket({ namespace: "chat" });

    chatSocket.on("connect", () => {
      set({ isConnected: true });
      console.log("Connected to chat socket", chatSocket?.id);
    });

    chatSocket.on("disconnect", () => {
      set({ isConnected: false, socket: null });
      console.log("Disconnected from chat socket");
      chatSocket = null;
    });

    chatSocket.on("message", (msg: ChatMessage) => {
      get().addMessage(msg);
    });

    set({ socket: chatSocket });
  };

  return {
    socket: null,
    isConnected: false,
    messages: [],

    connect: () => initializeSocket(),

    disconnect: () => {
      if (chatSocket) {
        chatSocket.disconnect();
        chatSocket = null;
      }
      set({ socket: null, isConnected: false, messages: [] });
      console.log("Chat socket disconnected manually");
    },

    joinGame: (roomId: string) => {
      get().connect();
      if (!chatSocket) return;

      chatSocket.emit("joinChat", { roomId });
    },

    leaveGame: (roomId: string) => {
      if (!chatSocket) return;

      chatSocket.emit("leaveGame", { roomId });
      set({ messages: [] });
    },

    sendMessage: (roomId: string, message: string) => {
      get().connect();
      if (!chatSocket) return;

      chatSocket.emit("sendMessage", { roomId, message });
    },

    addMessage: (msg: ChatMessage) => {
      set((state) => ({ messages: [...state.messages, msg] }));
    },
  };
});
