import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameStore } from "@/stores";
import ChessBoard from "./ChessBoard";
import ChatWindow from "../chat/Chat";

const ChessGamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { findOne } = useGameStore();
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      const g = await findOne(gameId);
      setGame(g);
    };

    fetchGame();
  }, [gameId, findOne]);

  if (!game) return <div>Loading game...</div>;

  return (
    <div className="flex w-full bg-gray-50 relative">
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <div className="flex items-center gap-4 mb-4 w-full justify-between">
          <h1 className="text-xl font-semibold">Game: {game.dbGame?.name}</h1>
        </div>
        <p className="mb-4 text-gray-600">Status: {game.dbGame?.status}</p>
        <ChessBoard board={game.board} />
      </div>

      <ChatWindow />
    </div>
  );
};

export default ChessGamePage;
