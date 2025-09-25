import { ChatState, ChatMessage } from "@/types";
import { create } from "zustand";
import { connectSocket, NamedSocket } from "@/lib";

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],

  connect: () => {
    if (get().socket) return;

    const socket: NamedSocket = connectSocket({ namespace: "chat" });

    socket.on("connect", () => {
      set({ isConnected: true });
      console.log("Connected to chat socket", socket.id);
    });

    socket.on("disconnect", () => {
      set({ isConnected: false, socket: null });
      console.log("Disconnected from chat socket");
    });

    socket.on("message", (msg: ChatMessage) => {
      get().addMessage(msg);
    });

    set({ socket });
  },

  joinRoom: (roomId: string) => {
    const { socket } = get();
    if (!socket) return;
    socket.emit("joinRoom", { roomId });
  },

  leaveRoom: (roomId: string) => {
    const { socket } = get();
    if (!socket) return;
    socket.emit("leaveRoom", { roomId });
    set({ messages: [] });
  },

  sendMessage: (roomId: string, message: string) => {
    const { socket } = get();
    if (!socket) return;
    socket.emit("sendMessage", { roomId, message });
  },

  addMessage: (msg: ChatMessage) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  },
}));
