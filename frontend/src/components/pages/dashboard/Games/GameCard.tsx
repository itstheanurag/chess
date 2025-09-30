import { Calendar, Clock, Trophy, User } from "lucide-react";
import { Game } from "@/types";

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

const getDuration = (start?: Date | null, end?: Date | null) => {
  if (!start || !end) return null;
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  return Math.round(diffMs / 60000);
};

export default function GameCard({ game }: { game: Game }) {
  const whiteName = game.whitePlayer?.name ?? "White";
  const blackName = game.blackPlayer?.name ?? "Black";
  const duration = getDuration(game.startedAt, game.endedAt);

  return (
    <div className="border border-neutral-600 rounded-lg p-6 hover:border-neutral-500 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-neutral-400" />
            <h3 className="text-xl font-semibold">
              {whiteName} vs {blackName}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getResultBadge(
                game.result
              )}`}
            >
              {game.result ?? game.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(game.createdAt).toLocaleDateString()}
            </div>
            {duration && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                {duration} min
              </div>
            )}
            <div className="flex items-center gap-1">
              <Trophy size={16} />
              {game.moves?.length} moves
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-neutral-400 mb-1">Game Type</div>
          <div className="font-medium capitalize">{game.type}</div>
        </div>
      </div>
    </div>
  );
}
