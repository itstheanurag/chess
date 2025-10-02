import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameStore } from "@/stores";
import ChessBoard from "./ChessBoard";

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
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl font-semibold">Game: {game.dbGame?.name}</h1>
      <p>Status: {game.dbGame?.status}</p>
      <ChessBoard board={game.board} />
    </div>
  );
};

export default ChessGamePage;
