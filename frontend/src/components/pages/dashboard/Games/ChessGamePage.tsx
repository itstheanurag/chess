import CreatGame from "./CreateGame";
import GameStats from "./GameStats";
import PaginatedGamesCards from "./PaginatedCards";

const ChessGamesPage = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
              Chess Games
            </h1>
            <p className="text-sm sm:text-base text-neutral-400">
              Track and manage your chess matches
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <CreatGame />
          </div>
        </div>

        <GameStats />

        <PaginatedGamesCards />
      </div>
    </div>
  );
};
export default ChessGamesPage;
