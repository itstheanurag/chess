import React from "react";
import {
  FaChessPawn,
  FaChessRook,
  FaChessKnight,
  FaChessBishop,
  FaChessQueen,
  FaChessKing,
} from "react-icons/fa";
import type { PieceColor, PieceType } from "@/types/chess";

export interface PieceProps {
  type: PieceType;
  color: PieceColor;
}

// Map piece types to React Icon components
const pieceIcons: Record<PieceProps["type"], React.ReactNode> = {
  pawn: <FaChessPawn />,
  rook: <FaChessRook />,
  knight: <FaChessKnight />,
  bishop: <FaChessBishop />,
  queen: <FaChessQueen />,
  king: <FaChessKing />,
};

const Piece: React.FC<PieceProps> = ({ type, color }) => {
  const Icon = pieceIcons[type] as React.ReactElement;
  return (
    <div
      className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${
        color === "white"
          ? "text-neutral-400  drop-shadow-lg"
          : "text-black drop-shadow-lg"
      }`}
    >
      {Icon}
    </div>
  );
};

export default Piece;
