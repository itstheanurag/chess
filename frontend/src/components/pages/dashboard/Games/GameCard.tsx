import { Calendar, Clock, Trophy, User, Lock } from "lucide-react";
import { Game, GameType } from "@/types";

const getResultBadge = (result?: string | null) => {
  switch (result) {
    case "win":
      return "bg-green-500/20 text-green-400";
    case "loss":
      return "bg-red-500/20 text-red-400";
    case "draw":
      return "bg-yellow-500/20 text-yellow-400";
    default:
      return "bg-neutral-500/20 text-neutral-400";
  }
};

const getGameTypeBadge = (type: GameType) => {
  switch (type) {
    case GameType.PUBLIC:
      return "bg-blue-800 text-neutral-50";
    case GameType.PRIVATE:
      return "bg-purple-800 text-neutral-50";
    default:
      return "bg-neutral-800 text-neutral-50";
  }
};

const getDuration = (start?: Date | null, end?: Date | null) => {
  if (!start || !end) return null;
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return Math.round(diffMs / 60000);
};

export default function GameCard({ game }: { game: Game }) {
  const duration = getDuration(game.startedAt, game.endedAt);

  return (
    <div className="border border-neutral-600 rounded-lg p-4 hover:border-neutral-500 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Players & Result */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-neutral-400" />
            <span className="truncate font-medium">{game.name}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${getResultBadge(
                game.result ?? game.status
              )}`}
            >
              {game.result ?? game.status}
            </span>
          </div>

          {/* Game meta */}
          <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(game.createdAt).toLocaleDateString()}
            </div>
            {duration && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {duration} min
              </div>
            )}
            <div className="flex items-center gap-1">
              <Trophy size={14} />
              {game.moves?.length ?? 0} moves
            </div>
          </div>
        </div>

        {/* Game type */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-xs text-neutral-400">Type</div>
          <div
            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getGameTypeBadge(
              game.type
            )}`}
          >
            {game.type}
            {game.type === GameType.PRIVATE && <Lock size={12} />}
          </div>
        </div>
      </div>
    </div>
  );
}
