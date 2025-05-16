import React from "react";
import Square from "./Square";

type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
type PieceColor = "white" | "black";

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type ChessBoardProps = {
  board: (Piece | null)[][];
};

const ChessBoard: React.FC<ChessBoardProps> = ({ board }) => {
  return (
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
  );
};

export default ChessBoard;
