import React from "react";
import { useSockets } from "@/Contexts/SocketContext";
import RoomSelector from "./RoomSelector";
import GameInfo from "./GameInfo";
import ChessBoard from "./ChessBoard";

const Game: React.FC = () => {
  const { isJoined, gameState } = useSockets();

  return (
    <div>
      <RoomSelector />
      <GameInfo />
      {isJoined && gameState?.board && <ChessBoard board={gameState.board} />}
    </div>
  );
};

export default Game;
