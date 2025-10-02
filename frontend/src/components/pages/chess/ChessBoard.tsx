import React, { useEffect, useState } from "react";
import type { Piece } from "@/types/chess";
import { convertToSquare } from "@/utils";
import Square from "./Square";
import { useGameSocketStore } from "@/stores/games/socketStore";
type ChessBoardProps = { board: (Piece | null)[][] };

const ChessBoard: React.FC<ChessBoardProps> = ({ board: initialBoard }) => {
  const {
    gameState,
    selected,
    validMoves,
    selectPiece,
    makeMove,
    clearSelection,
  } = useGameSocketStore();

  const [board, setBoard] = useState(initialBoard);

  useEffect(() => {
    if (gameState?.board) setBoard(gameState.board);
  }, [gameState]);

  const getPieceAt = (board: (Piece | null)[][], r: number, c: number) => {
    if (!board || !board[r]) return null;
    return board[r][c] ?? null;
  };

  const handleSquareClick = (r: number, c: number) => {
    if (!gameState?.board) return;
    const square = convertToSquare(r, c);
    const piece = getPieceAt(gameState.board, r, c);

    if (selected) {
      // makeMove({ from: selected, to: square });
      clearSelection();
    } else if (piece) {
      selectPiece(square);
    }
  };

  return (
    <>
      <p>You are Player: {"playerName"}</p>
      <div className="grid grid-cols-8 aspect-square w-full max-w-[500px] border-4 border-gray-800">
        {board.map((row, rIdx) =>
          row.map((piece, cIdx) => {
            const square = convertToSquare(rIdx, cIdx);
            const isSelected = selected === square;
            const highlight = validMoves?.some((m) => m.to === square) ?? false;
            const isLight = (rIdx + cIdx) % 2 === 0;

            return (
              <Square
                key={`${rIdx}-${cIdx}`}
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
    </>
  );
};

export default ChessBoard;
