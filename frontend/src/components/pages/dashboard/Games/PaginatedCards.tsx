import { useState, useEffect } from "react";
import GameCard from "./GameCard";
import { useGameStore } from "@/stores";
import { GameStatusEnum, GameType, SearchGame } from "@/types";
import { ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
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
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full pl-10 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <select
              value={statusFilter || ""}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value ? (e.target.value as GameStatusEnum) : null
                )
              }
              className="pl-10 pr-8 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer hover:bg-secondary/50 transition-colors"
            >
              <option value="">All Status</option>
              {Object.values(GameStatusEnum).map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <select
              value={gameTypeFilter || ""}
              onChange={(e) =>
                setGameTypeFilter(
                  e.target.value ? (e.target.value as GameType) : null
                )
              }
              className="pl-10 pr-8 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer hover:bg-secondary/50 transition-colors"
            >
              <option value="">All Types</option>
              {Object.values(GameType).map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          // Loading Skeletons
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-card/50 rounded-2xl border border-border/50 animate-pulse"
            />
          ))
        ) : userGames.length > 0 ? (
          userGames.map((game) => (
            <div key={game.id}>
              <GameCard key={game.id} game={game} />
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-secondary/10 rounded-2xl border border-border/50 border-dashed">
            No games found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          disabled={loading || page === 1 || total === 0}
          onClick={() => setPage((p) => p - 1)}
          className="flex items-center px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="ml-1">Prev</span>
        </button>

        <span className="text-sm text-muted-foreground font-medium">
          Page {currentPage} of {pages || 1}
        </span>

        <button
          disabled={loading || page >= pages || total === 0}
          onClick={() => setPage((p) => p + 1)}
          className="flex items-center px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="mr-1">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
