import React from "react";
import {
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessBishop,
  FaChessQueen,
  FaChessKing,
} from "react-icons/fa";
import type { PieceColor, PieceProps, PieceType } from "@/types/chess";

const pieceIcons: Record<PieceType, React.ComponentType> = {
  pawn: FaChessPawn,
  rook: FaChessRook,
  knight: FaChessKnight,
  bishop: FaChessBishop,
  queen: FaChessQueen,
  king: FaChessKing,
};

const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const Icon = pieceIcons[type];
  return (
    <div
      className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${
        color === "white"
          ? "text-neutral-400 drop-shadow-lg shadow-white"
          : "text-neutral-900 drop-shadow-lg"
      }`}
    >
      <Icon />
    </div>
  );
};

export default Piece;
