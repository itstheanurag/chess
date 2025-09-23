import React, { useEffect, useState } from "react";
import type { PieceType, PieceColor } from "@/types/chess";
import { useSockets } from "@/Contexts/SocketContext";
import { convertToSquare } from "@/utils";
import Square from "./Square";

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

type ChessBoardProps = {
  board: (Piece | null)[][];
};

const ChessBoard: React.FC<ChessBoardProps> = ({ board: initialBoard }) => {
  const { gameState, selected, validMoves, selectPiece, makeMove } =
    useSockets();
  const [board, setBoard] = useState(initialBoard);

  useEffect(() => {
    if (gameState?.board) setBoard(gameState.board);
  }, [gameState]);

  const handleSquareClick = (row: number, col: number) => {
    const square = convertToSquare(row, col);
    const clickedPiece = board[row][col];

    if (selected) {
      makeMove({ from: selected, to: square });
    } else if (clickedPiece) {
      selectPiece(square);
    }
  };

  return (
    <div className="grid grid-cols-8 aspect-square w-full max-w-[500px] border-4 border-gray-800">
      {board.map((row, rIdx) =>
        row.map((piece, cIdx) => {
          const isSelected = selected === convertToSquare(rIdx, cIdx);
          const highlight = validMoves.some(
            (m) => m.to === convertToSquare(rIdx, cIdx)
          );
          const isLight = (rIdx + cIdx) % 2 === 0;
          return (
            <Square
              key={`${rIdx}-${cIdx}`}
              piece={piece}
              isSelected={isSelected}
              highlight={highlight}
              onClick={() => handleSquareClick(rIdx, cIdx)}
              isLight={isLight}
            />
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
