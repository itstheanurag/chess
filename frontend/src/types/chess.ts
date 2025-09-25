import { Move, Square } from "chess.js";

export type PieceType =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king";

export type PieceColor = "w" | "b" | null;

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type ChessBoardProps = {
  board: (Piece | null)[][];
};

export interface PieceProps {
  type: PieceType;
  color: PieceColor;
}

export interface SquareProps {
  piece: PieceProps | null;
  isLight: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  highlight?: boolean;
}

export interface GameStateData {
  fen: string;
  board: (Piece | null)[][];
  turn?: PieceColor;
  [key: string]: unknown;
}

export interface GameState {
  gameState: GameStateData | null;
  selected: Square | null;
  validMoves: Move[];
  isJoined: boolean;
  room: string | null;
  playerColor: PieceColor;
  playerName: string;
  joinGame: (room: string, playerName?: string, isSpectator?: boolean) => void;
  makeMove: (move: { from: Square; to: Square; promotion?: string }) => void;
  selectPiece: (square: Square) => void;
  clearSelection: () => void;
  resetGame: () => void;
}
