import { Game, GameType } from "@/types";
import {  useEffect } from "react";
import GameCard from "./GameCard";
import GameStats from "./GameStats";
import CreatGame from "./CreateGame";
import { useGameStore } from "@/stores";

const ChessGamesPage = () => {
  const { listGames, userGames } = useGameStore();
  
  useEffect(() => {
    const fetchGames = async () => {
      listGames();
    };

    fetchGames();
  }, [listGames]);

  const stats = {
    total: userGames.length,
    wins: userGames.filter((g) => g.result === "win").length,
    losses: userGames.filter((g) => g.result === "loss").length,
    draws: userGames.filter((g) => g.result === "draw").length,
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
              Chess Games
            </h1>
            <p className="text-sm sm:text-base text-neutral-400">
              Track and manage your chess matches
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <CreatGame />
          </div>
        </div>

        <GameStats stats={stats} />

        <div className="space-y-4">
          {userGames.map((game: Game) => (
            <GameCard key={game.id.toString()} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessGamesPage;
