export type PieceType =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king";
export type PieceColor = "white" | "black";

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
