// Piece.tsx
import React from "react";
import {
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessBishop,
  FaChessQueen,
  FaChessKing,
} from "react-icons/fa";
import type { PieceProps } from "@/types/chess";

// Map FEN-like single letters to piece type names
const typeMap: Record<
  string,
  "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
> = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king",
};

const pieceIcons = {
  pawn: FaChessPawn,
  rook: FaChessRook,
  knight: FaChessKnight,
  bishop: FaChessBishop,
  queen: FaChessQueen,
  king: FaChessKing,
};

const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const normalizedType = typeMap[type.toLowerCase()] ?? type;
  const Icon = pieceIcons[normalizedType as keyof typeof pieceIcons];

  if (!Icon) {
    return <div className="text-red-500">Invalid piece: {type}</div>;
  }

  return (
    <div
      className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${
        color == "w"
          ? "text-neutral-100 drop-shadow-lg shadow-white"
          : "text-neutral-800 drop-shadow-lg"
      }`}
    >
      <Icon />
    </div>
  );
};

export default Piece;
