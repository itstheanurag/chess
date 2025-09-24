import React, { useEffect, useState } from "react";
import type { Piece } from "@/types/chess";
import { useSockets } from "@/Contexts/SocketContext";
import { convertToSquare } from "@/utils";
import Square from "./Square";
import api from "@/lib/axios";

type ChessBoardProps = { board: (Piece | null)[][] };

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
    playerColor,
    room,
  } = useSockets();

  const [board, setBoard] = useState(initialBoard);
  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [playerName] = useState(
    () => `Player-${Math.floor(Math.random() * 9000 + 1000)}`
  );

  console.log(playerColor, playerColor);

  useEffect(() => {
    if (gameState?.board) setBoard(gameState.board);
  }, [gameState]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get("/games/list");
        setRooms(data.data.rooms || []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  const handleSquareClick = (r: number, c: number) => {
    const square = convertToSquare(r, c);
    const piece = board[r][c];

    if (selected) {
      makeMove(playerName, { from: selected, to: square });
      clearSelection?.();
    } else if (piece) {
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
              <>
                <option value="">Create a new room</option>
                {rooms.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </>
            ) : (
              <option value="">No rooms available (new will be created)</option>
            )}
          </select>

          {/* ✅ Join button */}
          <button
            onClick={() => {
              const roomToJoin = selectedRoom || `room-${Date.now()}`;
              joinGame(roomToJoin, playerName);
            }}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Join Game
          </button>
        </div>
      )}

      {isJoined && (
        <div className="mb-4 p-2 bg-gray-100 rounded shadow">
          <p className="font-semibold">
            You are in: <span className="text-blue-600">{room}</span>
          </p>
          <p>
            Your color:{" "}
            <span
              className={
                playerColor === "w"
                  ? "text-neutral-400 font-bold"
                  : "text-black font-bold"
              }
            >
              {playerColor}
            </span>
          </p>
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
