import React from "react";
import { useSockets } from "@/Contexts/SocketContext";

const GameInfo: React.FC = () => {
  const { isJoined, room, playerColor } = useSockets();

  if (!isJoined) return null;

  return (
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
  );
};

export default GameInfo;
