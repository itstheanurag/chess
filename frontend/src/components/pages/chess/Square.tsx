import React from "react";
import Piece from "./Piece";
import type { PieceProps } from "./Piece";

interface SquareProps {
  piece: PieceProps | null;
  isLight: boolean;
}

const Square: React.FC<SquareProps> = ({ piece, isLight }) => {
  return (
    <div
      className={`aspect-square w-full flex items-center justify-center ${
        isLight ? "bg-neutral-50" : "bg-gray-700"
      }`}
    >
      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
};

export default Square;
