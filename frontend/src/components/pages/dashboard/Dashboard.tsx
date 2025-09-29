import StatsCards from "./StatsCards";

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

  const stats = {
    gamesPlayed: 234,
    winRate: 68,
    currentStreak: 5,
    puzzlesSolved: 1420,
  };

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

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} />

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Active Games</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activeGames.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {game.opponent
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{game.opponent}</p>
                    <p className="text-sm text-gray-500">
                      {game.gameType} • {game.timeLeft}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {game.myTurn && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Your Turn
                    </span>
                  )}
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Play
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "game_won"
                      ? "bg-green-500"
                      : activity.type === "game_lost"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1">
                  {activity.type === "game_won" && (
                    <p className="text-gray-900">
                      Won against{" "}
                      <span className="font-medium">{activity.opponent}</span>
                      {activity.rating && (
                        <span className="text-green-600 ml-2">
                          {activity.rating}
                        </span>
                      )}
                    </p>
                  )}
                  {activity.type === "game_lost" && (
                    <p className="text-gray-900">
                      Lost to{" "}
                      <span className="font-medium">{activity.opponent}</span>
                      {activity.rating && (
                        <span className="text-red-600 ml-2">
                          {activity.rating}
                        </span>
                      )}
                    </p>
                  )}
                  {activity.type === "puzzle_solved" && (
                    <p className="text-gray-900">
                      Solved{" "}
                      <span className="font-medium">
                        {activity.count} puzzles
                      </span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessDashboard;
