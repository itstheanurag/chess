import { useState, useEffect } from "react";
import GameCard from "./GameCard";
import { useGameStore } from "@/stores";
import { GameStatusEnum, GameType, SearchGame } from "@/types";

export default function PaginatedGamesCards() {
  const { userGames, listGames, currentPage, pages, total } = useGameStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<GameStatusEnum | null>(null);
  const [gameTypeFilter, setGameTypeFilter] = useState<GameType | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); 
    }, 500); 

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadGames = async () => {
    setLoading(true);
    try {
      const filters: SearchGame = {
        page,
        size: pageSize,
        q: debouncedSearch || undefined,
        type: gameTypeFilter || undefined,
        status: statusFilter || undefined,
      };

      await listGames(filters);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, [page, debouncedSearch, statusFilter, gameTypeFilter]);

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search games..."
          className="border rounded px-2 py-1 text-sm flex-1 min-w-[150px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={statusFilter || ""}
          onChange={(e) =>
            setStatusFilter(
              e.target.value ? (e.target.value as GameStatusEnum) : null
            )
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Status</option>
          {Object.values(GameStatusEnum).map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <select
          value={gameTypeFilter || ""}
          onChange={(e) =>
            setGameTypeFilter(
              e.target.value ? (e.target.value as GameType) : null
            )
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All Types</option>
          {Object.values(GameType).map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Game Cards */}
      <div className="space-y-4">
        {loading
          ? [...Array(pageSize)].map((_, idx) => (
              <div
                key={idx}
                className="rounded-lg p-4 border border-neutral-600 animate-pulse h-20"
              />
            ))
          : userGames.map((game) => <GameCard key={game.id} game={game} />)}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {pages} ({total} entries)
        </span>
        <button
          disabled={page === pages || loading}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
