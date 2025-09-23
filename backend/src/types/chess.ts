import { Move, Color, PieceSymbol, Piece } from "chess.js";

export type GameStatus =
  | "active"
  | "checkmate"
  | "draw"
  | "stalemate"
  | "threefold"
  | "insufficient"
  | "50move";

export interface GameMoveResult {
  success: boolean;
  error?: string;
  fen: string;
  pgn: string;
  status: GameStatus;
  turn: Color;
}

export interface GameState {
  fen: string;
  pgn: string;
  turn: Color;
  board: (Piece | null)[][];
  status: GameStatus;
  whitePlayer?: string;
  blackPlayer?: string;
  spectators: string[];
}
