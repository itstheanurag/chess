import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useSockets } from "@/Contexts/SocketContext";

const RoomSelector: React.FC = () => {
  const { isJoined, joinGame } = useSockets();

  const [rooms, setRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [playerName] = useState(
    () => `Player-${Math.floor(Math.random() * 9000 + 1000)}`
  );

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

  if (isJoined) return null;

  return (
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
  );
};

export default RoomSelector;
