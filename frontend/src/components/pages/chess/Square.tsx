import React from "react";
import Piece from "./Piece";
import { SquareProps } from "@/types/chess";

const Square: React.FC<SquareProps> = ({
  piece,
  isLight,
  isSelected,
  highlight,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative aspect-square w-full flex items-center justify-center cursor-pointer
    ${isLight ? "bg-amber-200" : "bg-yellow-900"}
    ${isSelected ? "ring-2 ring-yellow-400" : ""}`}
    >
      {highlight && (
        <div className="absolute w-4 h-4 rounded-full bg-green-500/70 pointer-events-none" />
      )}

      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
};

export default Square;
