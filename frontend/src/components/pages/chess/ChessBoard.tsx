import React from "react";
import Square from "./Square";
import type { PieceType, PieceColor } from "@/types/chess";

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type ChessBoardProps = {
  board: (Piece | null)[][];
};

const ChessBoard: React.FC<ChessBoardProps> = ({ board }) => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-neutral-900">
      <div className="grid grid-cols-8 aspect-square w-full max-w-[90vmin] sm:max-w-[80vmin] md:max-w-[60vmin] lg:max-w-[500px] border-4 border-gray-800">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            return (
              <Square
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                isLight={isLight}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
