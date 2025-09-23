// chessUtils.ts
import { PieceType, Piece } from "@/types/chess";
import { Chess, PieceSymbol } from "chess.js";

export const getInitialBoard = (): (Piece | null)[][] => {
  const chess = new Chess();
  const rawBoard = chess.board();

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
