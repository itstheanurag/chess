import { Game, GameType } from "@/types";
import { useState } from "react";
import GameCard from "./GameCard";
import GameStats from "./GameStats";
import CreatGame from "./CreateGame";

const ChessGamesPage = () => {
  const [games, setGames] = useState<Game[]>([
    {
      id: 1n,
      whitePlayerId: 101n,
      blackPlayerId: 102n,
      status: "finished",
      result: "win",
      type: GameType.PRIVATE,
      passcode: null,
      isVisible: true,
      fen: "rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      startedAt: new Date("2025-09-28T15:00:00Z"),
      endedAt: new Date("2025-09-28T15:45:00Z"),
      createdAt: new Date("2025-09-28T14:59:00Z"),
      whitePlayer: { id: "107n", name: "Bobby Fischer", email: "" },
      blackPlayer: { id: "108n", name: "Judith Polgar", email: "" },
      moves: Array(42).fill({}), // mock moves
      spectators: [],
    },
    {
      id: 2n,
      whitePlayerId: 103n,
      blackPlayerId: 104n,
      status: "finished",
      result: "loss",
      type: GameType.PRIVATE,
      passcode: "1234",
      isVisible: false,
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      startedAt: new Date("2025-09-27T18:10:00Z"),
      endedAt: new Date("2025-09-27T18:48:00Z"),
      createdAt: new Date("2025-09-27T18:00:00Z"),
      whitePlayer: { id: "107n", name: "Bobby Fischer", email: "" },
      blackPlayer: { id: "108n", name: "Judith Polgar", email: "" },
      moves: Array(38).fill({}),
      spectators: [],
    },
    {
      id: 3n,
      whitePlayerId: 105n,
      blackPlayerId: 106n,
      status: "finished",
      result: "draw",
      type: GameType.PRIVATE,
      passcode: null,
      isVisible: true,
      fen: "r1bqkb1r/pppppppp/2n2n2/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      startedAt: new Date("2025-09-26T13:30:00Z"),
      endedAt: new Date("2025-09-26T14:32:00Z"),
      createdAt: new Date("2025-09-26T13:25:00Z"),
      whitePlayer: { id: "107n", name: "Bobby Fischer", email: "" },
      blackPlayer: { id: "108n", name: "Judith Polgar", email: "" },
      moves: Array(56).fill({}),
      spectators: [],
    },
    {
      id: 4n,
      whitePlayerId: 107n,
      blackPlayerId: 108n,
      status: "finished",
      result: "win",
      type: GameType.PRIVATE,
      passcode: null,
      isVisible: true,
      fen: "rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      startedAt: new Date("2025-09-25T19:00:00Z"),
      endedAt: new Date("2025-09-25T19:41:00Z"),
      createdAt: new Date("2025-09-25T18:59:00Z"),
      whitePlayer: { id: "107n", name: "Bobby Fischer", email: "" },
      blackPlayer: { id: "108n", name: "Judith Polgar", email: "" },
      moves: Array(34).fill({}),
      spectators: [],
    },
  ]);

  const stats = {
    total: games.length,
    wins: games.filter((g) => g.result === "win").length,
    losses: games.filter((g) => g.result === "loss").length,
    draws: games.filter((g) => g.result === "draw").length,
  };

  return (
    <>
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
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

          {/* Stats */}
          <GameStats stats={stats} />

          {/* Games list */}
          <div className="space-y-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChessGamesPage;
