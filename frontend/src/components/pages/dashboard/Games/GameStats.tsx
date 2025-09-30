import { GameStatsProps, Stats } from "@/types";
import { callGetAllGameStatsApi } from "@/utils";
import { useState, useEffect, JSX } from "react";

export default function GameStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const data = await callGetAllGameStatsApi();
      if (data) {
        setStats(data.stats);
        setLoading(false);
      } else {
        
      }
    };
    fetchStats();
  }, []);

  return <CreateCards stats={stats} loading={loading} />;
}

function CreateCards({ stats, loading }: GameStatsProps) {
  const renderCard = (
    value: number | JSX.Element,
    label: string,
    color?: string
  ) => (
    <div className="rounded-lg p-4 border border-neutral-600">
      <div className={`text-2xl font-bold ${color || ""}`}>{value}</div>
      <div className="text-sm text-neutral-400">{label}</div>
    </div>
  );

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg p-4 border border-neutral-600 animate-pulse"
          >
            <div className="h-8 bg-neutral-700 rounded mb-2"></div>
            <div className="h-3 bg-neutral-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {renderCard(stats.total, "Total Games")}
      {renderCard(stats.wins, "Wins", "text-green-500")}
      {renderCard(stats.losses, "Losses", "text-red-500")}
      {renderCard(stats.draws, "Draws", "text-yellow-500")}
    </div>
  );
}
