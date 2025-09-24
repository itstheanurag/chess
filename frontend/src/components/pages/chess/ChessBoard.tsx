import React, { useEffect, useState } from "react";
import type { Piece } from "@/types/chess";
import { useSockets } from "@/Contexts/SocketContext";
import { convertToSquare } from "@/utils";
import Square from "./Square";
import api from "@/lib/axios";

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
    joinGame,
  } = useSockets();

  const [board, setBoard] = useState(initialBoard);
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const [playerName] = useState(() => {
    const randomId = Math.floor(Math.random() * 9000 + 1000);
    return `Player-${randomId}`;
  });

  useEffect(() => {
    if (gameState?.board) setBoard(gameState.board);
  }, [gameState]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get("/games/list");
        console.log(data, "rooms data");
        setRooms(data.data.rooms);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleSquareClick = (row: number, col: number) => {
    if (!isJoined) {
      const roomToJoin = selectedRoom || `room-${Date.now()}`;
      joinGame(roomToJoin, playerName);
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
    <>
      {!isJoined && (
        <div className="mb-4">
          <p className="mb-2 font-semibold">Your Name: {playerName}</p>
          <label className="mr-2">Select Room:</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            {rooms.length ? (
              rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))
            ) : (
              <option value="">No rooms available (new will be created)</option>
            )}
          </select>
        </div>
      )}
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
