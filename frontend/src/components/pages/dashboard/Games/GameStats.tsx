import { GameStatsProps, Stats } from "@/types";
import { callGetAllGameStatsApi } from "@/types/utils";
import { useState, useEffect, JSX } from "react";
import { Gamepad2, Trophy, Target, Clock } from "lucide-react";

export default function GameStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const data = await callGetAllGameStatsApi();
      if (data) {
        setStats(data.stats);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return <CreateCards stats={stats} loading={loading} />;
}

function CreateCards({ stats, loading }: GameStatsProps) {
  const renderCard = (
    value: number | JSX.Element,
    label: string,
    color?: string,
    Icon?: JSX.Element
  ) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border flex justify-between items-center">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`text-2xl font-bold ${color || "text-gray-900"}`}>
          {value}
        </p>
      </div>
      {Icon}
    </div>
  );

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-sm border animate-pulse"
          >
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {renderCard(
        stats.total,
        "Total Games",
        "text-blue-500",
        <Gamepad2 className="h-8 w-8 text-blue-500" />
      )}
      {renderCard(
        stats.wins,
        "Wins",
        "text-green-500",
        <Trophy className="h-8 w-8 text-green-500" />
      )}
      {renderCard(
        stats.losses,
        "Losses",
        "text-red-500",
        <Target className="h-8 w-8 text-red-500" />
      )}
      {renderCard(
        stats.draws,
        "Draws",
        "text-yellow-500",
        <Clock className="h-8 w-8 text-yellow-500" />
      )}
    </div>
  );
}
