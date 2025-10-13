import { NamedSocket } from "@/lib";

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: number;
}

export interface ChatState {
  socket?: NamedSocket | null;
  isConnected: boolean;
  messages: ChatMessage[];
  connect: () => void;
  disconnect: () => void;
  joinGame: (roomId: string) => void;
  leaveGame: (roomId: string) => void;
  sendMessage: (roomId: string, message: string) => void;
  addMessage: (msg: ChatMessage) => void;
}
