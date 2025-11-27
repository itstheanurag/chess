import Button from "@/components/ui/buttons/Button";
import GameStats from "./Games/GameStats";
import { Clock, Trophy, Zap, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const ChessDashboard = () => {
  const recentActivity = [
    {
      id: 1,
      type: "game_won",
      opponent: "Sarah M.",
      time: "2 hours ago",
      rating: "+12",
    },
    {
      id: 2,
      type: "game_lost",
      opponent: "Mike R.",
      time: "5 hours ago",
      rating: "-8",
    },
    { id: 3, type: "puzzle_solved", count: 15, time: "1 day ago" },
    {
      id: 4,
      type: "game_won",
      opponent: "Emma L.",
      time: "2 days ago",
      rating: "+15",
    },
  ];

  const activeGames = [
    {
      id: 1,
      opponent: "John D.",
      timeLeft: "4h 23m",
      myTurn: true,
      gameType: "Blitz",
    },
    {
      id: 2,
      opponent: "Lisa K.",
      timeLeft: "1h 45m",
      myTurn: false,
      gameType: "Rapid",
    },
    {
      id: 3,
      opponent: "David S.",
      timeLeft: "12h 30m",
      myTurn: true,
      gameType: "Classical",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Stats Overview */}
      <motion.div variants={item}>
        <GameStats />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Games Section */}
        <motion.div
          variants={item}
          className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Active Games
            </h2>
            <button className="text-sm text-primary hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {activeGames.map((game) => (
              <div
                key={game.id}
                className="group flex items-center justify-between p-4 bg-secondary/20 hover:bg-secondary/40 border border-border/50 rounded-2xl transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {game.opponent
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {game.myTurn && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{game.opponent}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-md bg-secondary/50 text-xs font-medium">
                        {game.gameType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {game.timeLeft}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {game.myTurn && (
                    <span className="hidden sm:inline-block px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider rounded-full">
                      Your Turn
                    </span>
                  )}
                  <Button className="rounded-xl px-6 group-hover:translate-x-1 transition-transform">
                    Play <Play className="w-4 h-4 ml-2 fill-current" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          variants={item}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
          </div>

          <div className="space-y-6 relative">
            {/* Timeline Line */}
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border/50" />

            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="relative flex items-start gap-4"
              >
                <div
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-background shadow-sm
                    ${
                      activity.type === "game_won"
                        ? "bg-green-500/20 text-green-500"
                        : activity.type === "game_lost"
                        ? "bg-red-500/20 text-red-500"
                        : "bg-blue-500/20 text-blue-500"
                    }
                  `}
                >
                  {activity.type === "game_won" ? (
                    <Trophy className="w-4 h-4" />
                  ) : activity.type === "game_lost" ? (
                    <Trophy className="w-4 h-4 rotate-180" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start">
                    <div>
                      {activity.type === "game_won" && (
                        <p className="font-medium">
                          Won against{" "}
                          <span className="text-foreground font-bold">
                            {activity.opponent}
                          </span>
                        </p>
                      )}
                      {activity.type === "game_lost" && (
                        <p className="font-medium">
                          Lost to{" "}
                          <span className="text-foreground font-bold">
                            {activity.opponent}
                          </span>
                        </p>
                      )}
                      {activity.type === "puzzle_solved" && (
                        <p className="font-medium">
                          Solved{" "}
                          <span className="text-foreground font-bold">
                            {activity.count} puzzles
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                    {activity.rating && (
                      <span
                        className={`text-sm font-bold ${
                          activity.rating.startsWith("+")
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {activity.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-3 rounded-xl border border-border/50 hover:bg-secondary/50 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 group">
            View Full History
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChessDashboard;
