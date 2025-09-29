type Stats = {
  total: number;
  wins: number;
  losses: number;
  draws: number;
};

export default function GameStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className=" rounded-lg p-4 border border-neutral-600">
        <div className="text-2xl font-bold">{stats.total}</div>
        <div className="text-sm text-neutral-400">Total Games</div>
      </div>
      <div className=" rounded-lg p-4 border border-neutral-600">
        <div className="text-2xl font-bold text-green-500">{stats.wins}</div>
        <div className="text-sm text-neutral-400">Wins</div>
      </div>
      <div className=" rounded-lg p-4 border border-neutral-600">
        <div className="text-2xl font-bold text-red-500">{stats.losses}</div>
        <div className="text-sm text-neutral-400">Losses</div>
      </div>
      <div className="rounded-lg p-4 border border-neutral-600">
        <div className="text-2xl font-bold text-yellow-500">{stats.draws}</div>
        <div className="text-sm text-neutral-400">Draws</div>
      </div>
    </div>
  );
}
