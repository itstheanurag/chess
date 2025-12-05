import { InferSelectModel } from "drizzle-orm";
import { gameMove, gameSpectator, user } from "@/db/schema";
import { Color, Piece } from "chess.js";

export type ChessUser = InferSelectModel<typeof user>;
export type GameMove = InferSelectModel<typeof gameMove>;
export type GameSpectator = InferSelectModel<typeof gameSpectator>;

export enum GameType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

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
  san?: string;
  from?: string;
  to?: string;
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

export interface Game {
  id: string;
  whitePlayerId?: string | null;
  blackPlayerId?: string | null;
  status: string;
  result?: string | null;
  type: GameType;
  passcode?: string | null;
  isVisible: boolean;
  fen: string;
  startedAt?: Date | null;
  endedAt?: Date | null;
  createdAt: Date;
  whitePlayer?: ChessUser | null;
  blackPlayer?: ChessUser | null;
  moves: GameMove[];
  spectators: GameSpectator[];
}
