import { Move, Color, PieceSymbol } from "chess.js";

export type GameStatus =
  | "active"
  | "checkmate"
  | "draw"
  | "stalemate"
  | "threefold"
  | "insufficient"
  | "50move";

export interface GameMoveResult extends Move {
  success: boolean;
  error?: string;
  fen: string;
  pgn: string;
  status: GameStatus;
  turn: Color;
  inCheck: boolean;
  inCheckmate: boolean;
  inDraw: boolean;
  inStalemate: boolean;
  insufficientMaterial: boolean;
  inThreefoldRepetition: boolean;
  // Add missing methods from Move interface
  isCapture(): boolean;
  isPromotion(): boolean;
  isEnPassant(): boolean;
  isKingsideCastle(): boolean;
  isQueensideCastle(): boolean;
  isBigPawn(): boolean;
}

export interface GameState {
  fen: string;
  pgn: string;
  turn: Color;
  gameOver: boolean;
  status: GameStatus;
  board: ({
    square: string;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  inCheck: boolean;
  inCheckmate: boolean;
  inDraw: boolean;
  inStalemate: boolean;
  insufficientMaterial: boolean;
  inThreefoldRepetition: boolean;
  moveHistory: Move[];
  whitePlayer?: string;
  blackPlayer?: string;
  spectators: string[];
}
