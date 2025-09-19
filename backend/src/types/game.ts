export interface JoinGameData {
  room: string;
  playerName: string;
  isSpectator?: boolean;
}

export interface MoveData {
  room: string;
  move: string | { from: string; to: string; promotion?: string };
}

export interface ChatMessage {
  room: string;
  sender: string;
  message: string;
  timestamp: Date;
}
