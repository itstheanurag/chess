import { Calendar, Clock, Trophy, User, Lock } from "lucide-react";
import { Game, GameType } from "@/types";
import { useAuthStore, useGameStore } from "@/stores";
import { useNavigate } from "react-router-dom";

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
  const { joinGame, listGames } = useGameStore();
  const { authUser } = useAuthStore();

  const navigate = useNavigate();
  const isUserInGame =
    game.whitePlayer?.id === authUser!.id ||
    game.blackPlayer?.id === authUser!.id;

  const handleJoinPlayer = async () => {
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

  const handleJoinSpectator = async () => {
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
    console.log("clicked on handled card click");

    console.log(game);
    if (isUserInGame && game.status == "ongoing") {
      console.log(isUserInGame && game.status == "ongoing");
      navigate(`/dashboard/game/${game.id}`);
    }

    if (game.status === "ongoing" && !isUserInGame) {
      handleJoinSpectator();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`border border-neutral-700 rounded-xl p-4 hover:border-neutral-500 transition-colors ${
        game.status === "ongoing" && !isUserInGame
          ? "cursor-pointer hover:shadow-md"
          : "cursor-default"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <User size={16} className="text-neutral-400" />
          <span className="font-semibold text-sm sm:text-base truncate">
            {game.name}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getResultBadge(
            game.result ?? game.status
          )}`}
        >
          {game.result ?? game.status}
        </span>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="text-xs text-neutral-400">White</div>
          <div className="text-sm font-medium truncate">
            {game.whitePlayer?.username ?? "TBD"}
          </div>
        </div>
        <div>
          <div className="text-xs text-neutral-400">Black</div>
          <div className="text-sm font-medium truncate">
            {game.blackPlayer?.username ?? "TBD"}
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mb-3">
        <div className="flex items-center gap-1">
          <Calendar size={14} /> {new Date(game.createdAt).toLocaleDateString()}
        </div>
        {duration && (
          <div className="flex items-center gap-1">
            <Clock size={14} /> {duration} min
          </div>
        )}
        <div className="flex items-center gap-1">
          <Trophy size={14} /> {game.moves?.length ?? 0} moves
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 bg-neutral-700 rounded-full text-xs font-medium">
          {game.type}
          {game.type === GameType.PRIVATE && <Lock size={12} />}
        </div>
      </div>

      {/* Join Buttons */}
      {game.status === "waiting" && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleJoinPlayer}
            disabled={isUserInGame}
            className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium transition ${
              isUserInGame
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            Join as Player
          </button>
          <button
            onClick={handleJoinSpectator}
            disabled={isUserInGame}
            className={`flex-1 px-3 py-2 text-sm rounded-lg font-medium transition ${
              isUserInGame
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            Join as Spectator
          </button>
        </div>
      )}
    </div>
  );
}
