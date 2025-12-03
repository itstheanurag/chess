import React, { useEffect, useState } from "react";
import {
  Clock,
  User,
  Swords,
  ChevronDown,
  Activity,
  ScrollText,
} from "lucide-react";
import { useAuthStore } from "@/stores";

interface GameInfoProps {
  game: any;
}

const GameInfo: React.FC<GameInfoProps> = ({ game }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [elapsed, setElapsed] = useState<string>("00:00");
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!game?.startedAt) return;

    const updateTimer = () => {
      const start = new Date(game.startedAt).getTime();
      const end = game.endedAt
        ? new Date(game.endedAt).getTime()
        : new Date().getTime();
      const diff = Math.max(0, Math.floor((end - start) / 1000));

      const minutes = Math.floor(diff / 60)
        .toString()
        .padStart(2, "0");
      const seconds = (diff % 60).toString().padStart(2, "0");
      setElapsed(`${minutes}:${seconds}`);
    };

    updateTimer();

    if (game.endedAt) return;

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [game?.startedAt, game?.endedAt]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const turnColor = game?.turn || "w";
  const isWhiteTurn = turnColor === "w";

  let userColor: "w" | "b" | null = null;
  if (authUser && game?.whitePlayer?.id === authUser.id) userColor = "w";
  else if (authUser && game?.blackPlayer?.id === authUser.id) userColor = "b";

  const isMyTurn = userColor === turnColor;

  const TurnIndicator = () => (
    <div
      className={`text-center py-2 px-4 rounded-xl font-bold mb-4 transition-all ${
        isMyTurn
          ? "bg-green-500/10 text-green-600 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
          : "bg-secondary/50 text-muted-foreground border border-border/50"
      }`}
    >
      {isMyTurn ? (
        <span className="flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Your Turn
        </span>
      ) : (
        <span>{isWhiteTurn ? "White's Turn" : "Black's Turn"}</span>
      )}
    </div>
  );

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
    </div>
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 bg-card/80 backdrop-blur border border-border/50 px-4 py-2 rounded-xl shadow-lg hover:bg-card transition-all hover:scale-105"
      >
        <div className="flex items-center gap-2 text-primary font-bold">
          <Activity size={18} />
          <span>Info</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock size={14} />
          <span className="font-mono">{elapsed}</span>
        </div>
      </button>
    );
  }

  return (
    <div className="w-[320px] flex flex-col bg-card/95 backdrop-blur border border-border/50 rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-100px)] animate-in slide-in-from-left-5 duration-200">
      {/* Header */}
      <div
        className="p-4 border-b border-border/50 flex items-center justify-between bg-secondary/20 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setIsOpen(false)}
      >
        <div className="flex items-center gap-2 font-bold">
          <Swords size={18} className="text-primary" />
          <span>{game?.name || "Chess Match"}</span>
        </div>
        <button className="p-1 hover:bg-background rounded-full transition-colors">
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Timer & Status */}
        <div className="flex items-center justify-between bg-secondary/10 p-3 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock size={16} />
            <span className="font-mono text-lg font-bold text-foreground">
              {elapsed}
            </span>
          </div>
          <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            {game?.status?.replace(/_/g, " ")}
          </div>
        </div>

        {/* Turn Indicator */}
        <TurnIndicator />

        {/* Players */}
        <div className="space-y-2">
          <PlayerCard player={game?.whitePlayer} color="white" />
          <PlayerCard player={game?.blackPlayer} color="black" />
        </div>

        {/* Move History Section */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-muted-foreground">
            <ScrollText size={16} />
            <span>Move History</span>
          </div>

          <div className="bg-background/50 rounded-xl border border-border/50 min-h-[150px] p-2">
            {game?.moves?.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                {game.moves.map((move: any, i: number) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-muted-foreground w-6 text-right">
                      {Math.floor(i / 2) + 1}.
                    </span>
                    <span className="font-medium">{move.san || "move"}</span>
                    {/* Note: backend might not send SAN yet, need to check types. Assuming basic display for now. */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs py-8 opacity-60">
                <Swords size={24} className="mb-2 opacity-50" />
                <p>Game hasn't started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
