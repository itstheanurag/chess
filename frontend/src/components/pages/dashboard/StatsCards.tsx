import React from "react";
import { Gamepad2, Trophy, Target } from "lucide-react";

interface Stats {
  gamesPlayed: number;
  winRate: number;
  currentStreak: number;
  puzzlesSolved: number;
}

const StatsCards: React.FC<{ stats: Stats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600">Games Played</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.gamesPlayed}
          </p>
        </div>
        <Gamepad2 className="h-8 w-8 text-blue-600" />
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600">Win Rate</p>
          <p className="text-2xl font-bold text-green-600">{stats.winRate}%</p>
        </div>
        <Trophy className="h-8 w-8 text-green-600" />
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600">Current Streak</p>
          <p className="text-2xl font-bold text-orange-600">
            {stats.currentStreak}
          </p>
        </div>
        <Target className="h-8 w-8 text-orange-600" />
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600">Puzzles Solved</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.puzzlesSolved}
          </p>
        </div>
        <Target className="h-8 w-8 text-purple-600" />
      </div>
    </div>
  );
};

export default StatsCards;
