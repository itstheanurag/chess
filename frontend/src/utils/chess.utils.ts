// chessUtils.ts
import { Chess } from "chess.js";
import type { PieceSymbol } from "chess.js";

type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type PieceColor = "white" | "black";

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export const getInitialBoard = (): (Piece | null)[][] => {
  const chess = new Chess();
  const rawBoard = chess.board(); // 8x8 array from chess.js

  return rawBoard.map((row) =>
    row.map((piece) =>
      piece
        ? {
            type: convertPieceType(piece.type),
            color: piece.color === "w" ? "white" : "black",
          }
        : null
    )
  );
};

const convertPieceType = (symbol: PieceSymbol): PieceType => {
  switch (symbol) {
    case "p":
      return "pawn";
    case "r":
      return "rook";
    case "n":
      return "knight";
    case "b":
      return "bishop";
    case "q":
      return "queen";
    case "k":
      return "king";
  }
};
