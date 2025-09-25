export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: number;
}

export interface ChatState {
  socket: WebSocket | null;
  isConnected: boolean;
  messages: ChatMessage[];
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (message: string) => void;
  setSocket: (socket: WebSocket) => void;
  addMessage: (msg: ChatMessage) => void;
}
