import { GameStatsProps, Stats } from "@/types";
import { callGetAllGameStatsApi } from "@/utils";
import { useState, useEffect, JSX } from "react";
import {
  Gamepad2,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { motion } from "framer-motion";

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
    value: number,
    label: string,
    icon: JSX.Element,
    gradient: string,
    trend?: { value: string; isPositive: boolean }
  ) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden rounded-3xl p-6 border border-border/50 shadow-lg group`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
      />

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>

          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-xs font-medium ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>{trend.value}</span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>

        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="h-40 bg-card/50 rounded-3xl border border-border/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {renderCard(
        stats.total,
        "Total Games",
        <Gamepad2 className="h-6 w-6" />,
        "from-blue-500 to-cyan-500",
        { value: "+12%", isPositive: true }
      )}
      {renderCard(
        stats.wins,
        "Wins",
        <Trophy className="h-6 w-6" />,
        "from-green-500 to-emerald-500",
        { value: "+5%", isPositive: true }
      )}
      {renderCard(
        stats.losses,
        "Losses",
        <Target className="h-6 w-6" />,
        "from-red-500 to-pink-500",
        { value: "-2%", isPositive: true }
      )}
      {renderCard(
        stats.draws,
        "Draws",
        <Minus className="h-6 w-6" />,
        "from-yellow-500 to-orange-500"
      )}
    </div>
  );
}
