import { useState, useEffect } from "react";
import GameCard from "./GameCard";
import { useGameStore } from "@/stores";
import { GameStatusEnum, GameType, SearchGame } from "@/types";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaginatedGamesCards() {
  const { userGames, listGames, currentPage, pages, total } = useGameStore();
  const navigate = useNavigate();

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
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full pl-7 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

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

      <div className="space-y-4">
        {userGames.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/game/${game.id}`)}
            className="cursor-pointer"
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => p - 1)}
          className="flex items-center px-4 py-2 rounded-lg bg-neutral-800 text-neutral-50 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} />
          <span className="ml-1">Prev</span>
        </button>

        <span className="px-3 py-2 text-sm text-gray-300">
          Page {currentPage} of {pages} ({total} games)
        </span>

        <button
          disabled={page === pages || loading}
          onClick={() => setPage((p) => p + 1)}
          className="flex items-center px-4 py-2 rounded-lg bg-neutral-800 text-neutral-50 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span className="mr-1">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
