import React, { useEffect, useState } from "react";
import type { Piece } from "@/types/chess";
import { useSockets } from "@/Contexts/SocketContext";
import { convertToSquare } from "@/utils";
import Square from "./Square";

type ChessBoardProps = {
  board: (Piece | null)[][];
};

const ChessBoard: React.FC<ChessBoardProps> = ({ board: initialBoard }) => {
  const {
    gameState,
    selected,
    validMoves,
    selectPiece,
    makeMove,
    clearSelection,
    isJoined,
    joinGame, // <- add this in your socket context
  } = useSockets();

  const [board, setBoard] = useState(initialBoard);

  useEffect(() => {
    if (gameState?.board) setBoard(gameState.board);
  }, [gameState]);

  const handleSquareClick = (row: number, col: number) => {
    if (!isJoined) {
      joinGame("default", "Guest");
      return;
    }

    const square = convertToSquare(row, col);
    const clickedPiece = board[row][col];

    if (selected) {
      makeMove({ from: selected, to: square });
      clearSelection?.();
    } else if (clickedPiece) {
      selectPiece(square);
    }
  };

  return (
    <div className="grid grid-cols-8 aspect-square w-full max-w-[500px] border-4 border-gray-800">
      {board.map((row, rIdx) =>
        row.map((piece, cIdx) => {
          const square = convertToSquare(rIdx, cIdx);
          const isSelected = selected === square;
          const highlight = validMoves.some((m) => m.to === square);
          const isLight = (rIdx + cIdx) % 2 === 0;

          return (
            <Square
              key={square}
              piece={piece}
              isSelected={isSelected}
              highlight={highlight}
              isLight={isLight}
              onClick={() => handleSquareClick(rIdx, cIdx)}
            />
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;
