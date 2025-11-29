import React, { useEffect, useState } from "react";
import { Clock, User, Trophy, Swords } from "lucide-react";
import { Game } from "@/types";

interface GameInfoProps {
  game: any; // Using any for now as the Game type might need updates
}

const GameInfo: React.FC<GameInfoProps> = ({ game }) => {
  const [elapsed, setElapsed] = useState<string>("00:00");

  useEffect(() => {
    if (!game?.startedAt) return;

    const interval = setInterval(() => {
      const start = new Date(game.startedAt).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((now - start) / 1000);

      const minutes = Math.floor(diff / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (diff % 60).toString().padStart(2, "0");
      setElapsed(`${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [game?.startedAt]);

  const PlayerCard = ({
    player,
    color,
  }: {
    player: any;
    color: "white" | "black";
  }) => (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border ${
        color === "white"
          ? "bg-white text-gray-900 border-gray-200"
          : "bg-gray-900 text-white border-gray-800"
      }`}
    >
      <div
        className={`p-2 rounded-lg ${
          color === "white" ? "bg-gray-100" : "bg-gray-800"
        }`}
      >
        <User size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate">{player?.username || "Waiting..."}</p>
        <p
          className={`text-xs ${
            color === "white" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {color === "white" ? "White" : "Black"}
        </p>
      </div>
      {/* Turn Indicator */}
      {/* This logic needs to be connected to actual game state */}
      {/* <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" /> */}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Game Status Card */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Swords size={20} />
            <span>{game?.name || "Chess Match"}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md text-sm">
            <Clock size={14} />
            <span className="font-mono">{elapsed}</span>
          </div>
        </div>

        <div className="space-y-2">
          <PlayerCard player={game?.whitePlayer} color="white" />
          <PlayerCard player={game?.blackPlayer} color="black" />
        </div>
      </div>

      {/* Game Stats/Info */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-card border border-border/50 p-3 rounded-xl text-center">
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <p className="font-bold capitalize">
            {game?.status?.replace(/_/g, " ")}
          </p>
        </div>
        <div className="bg-card border border-border/50 p-3 rounded-xl text-center">
          <p className="text-xs text-muted-foreground mb-1">Moves</p>
          <p className="font-bold">{game?.moves?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
