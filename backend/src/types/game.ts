export interface JoinGameData {
  room: string;
  playerName: string;
  isSpectator?: boolean;
}

export interface MoveData {
  room: string;
  move: {
    from: string;
    to: string;
    promotion?: "q" | "r" | "b" | "n";
  };
}

export interface ChatMessage {
  room: string;
  sender: string;
  message: string;
  timestamp: Date;
}

export interface Stats {
  total: number;
  wins: number;
  losses: number;
  draws: number;
}
