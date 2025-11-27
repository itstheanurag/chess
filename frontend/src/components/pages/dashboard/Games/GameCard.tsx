import { Calendar, Clock, Trophy, User, Lock, Eye, Play } from "lucide-react";
import { Game, GameType } from "@/types";
import { useAuthStore, useGameStore } from "@/stores";
import { useNavigate } from "react-router-dom";

const getResultBadge = (result?: string | null) => {
  switch (result) {
    case "win":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "loss":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "draw":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
};

const getDuration = (start?: Date | null, end?: Date | null) => {
  if (!start || !end) return null;
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return Math.round(diffMs / 60000);
};

export default function GameCard({ game }: { game: Game }) {
  const duration = getDuration(game.startedAt, game.endedAt);
  const { joinGame, listGames } = useGameStore();
  const { authUser } = useAuthStore();

  const navigate = useNavigate();
  const isUserInGame =
    game.whitePlayer?.id === authUser!.id ||
    game.blackPlayer?.id === authUser!.id;

  const handleJoinPlayer = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUserInGame) return;
    const success = await joinGame({
      gameId: game.id,
      isSpectator: false,
    });

    if (success) {
      await listGames();
      navigate(`/dashboard/game/${game.id}`);
    }
  };

  const handleJoinSpectator = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUserInGame) return;
    const success = await joinGame({
      gameId: game.id,
      isSpectator: true,
    });

    if (success) {
      navigate(`/dashboard/game/${game.id}`);
    }
  };

  const handleCardClick = () => {
    if (isUserInGame && game.status == "ongoing") {
      navigate(`/dashboard/game/${game.id}`);
    }

    if (game.status === "ongoing" && !isUserInGame) {
      handleJoinSpectator({ stopPropagation: () => {} } as React.MouseEvent);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300
        ${
          game.status === "ongoing" && !isUserInGame
            ? "cursor-pointer hover:shadow-lg hover:border-primary/30"
            : "cursor-default"
        }
      `}
    >
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/50 text-primary">
              <User size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base truncate max-w-[150px] sm:max-w-[200px]">
                {game.name || "Untitled Game"}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />{" "}
                  {new Date(game.createdAt).toLocaleDateString()}
                </span>
                {game.type === GameType.PRIVATE && (
                  <span className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">
                    <Lock size={10} /> Private
                  </span>
                )}
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getResultBadge(
              game.result ?? game.status
            )}`}
          >
            {game.result ?? game.status.replace(/_/g, " ")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 p-3 rounded-xl bg-secondary/20 border border-border/50">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">White</span>
            <span className="font-semibold truncate">
              {game.whitePlayer?.username ?? "Waiting..."}
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs text-muted-foreground mb-1">Black</span>
            <span className="font-semibold truncate">
              {game.blackPlayer?.username ?? "Waiting..."}
            </span>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {duration && (
              <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-md">
                <Clock size={14} /> {duration} min
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-secondary/30 px-2 py-1 rounded-md">
              <Trophy size={14} /> {game.moves?.length ?? 0} moves
            </div>
          </div>

          {/* Join Buttons */}
          {game.status === "waiting" && (
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <button
                onClick={handleJoinPlayer}
                disabled={isUserInGame}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl font-bold transition-all shadow-lg ${
                  isUserInGame
                    ? "bg-secondary text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25"
                }`}
              >
                <Play size={14} fill="currentColor" />
                Join
              </button>
              <button
                onClick={handleJoinSpectator}
                disabled={isUserInGame}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-xl font-bold transition-all border border-border bg-card hover:bg-secondary ${
                  isUserInGame
                    ? "opacity-50 cursor-not-allowed"
                    : "text-foreground"
                }`}
              >
                <Eye size={14} />
                Watch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
