import { ChatState, ChatMessage } from "@/types";
import { create } from "zustand";

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  isConnected: false,
  messages: [],

  setSocket: (socket: WebSocket) => {
    set({ socket, isConnected: true });
  },

  joinRoom: (roomId: string) => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "join", roomId }));
    }
  },

  leaveRoom: () => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "leave" }));
    }
    set({ messages: [] });
  },

  sendMessage: (message: string) => {
    const { socket } = get();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "message", message }));
    }
  },

  addMessage: (msg: ChatMessage) => {
    set((state) => ({ messages: [...state.messages, msg] }));
  },
}));
