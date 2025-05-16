import React from "react";

export interface PieceProps {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
  color: "white" | "black";
}

const unicodePieces: Record<
  PieceProps["color"],
  Record<PieceProps["type"], string>
> = {
  white: {
    pawn: "♙",
    rook: "♖",
    knight: "♘",
    bishop: "♗",
    queen: "♕",
    king: "♔",
  },
  black: {
    pawn: "♟︎",
    rook: "♜",
    knight: "♞",
    bishop: "♝",
    queen: "♛",
    king: "♚",
  },
};

const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const pieceUnicode = unicodePieces[color][type];
  return (
    <div
      className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl ${
        color === "white" ? "text-shadow-blue-100" : "text-black"
      } shadow-2xs`}
    >
      {pieceUnicode}
    </div>
  );
};

export default Piece;
