import CreatGame from "./CreateGame";
import PaginatedGamesCards from "./PaginatedCards";

const GameCreatePage = () => {
  return (
    <div className="p-0">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
              Chess Games
            </h1>
            <p className="text-muted-foreground">
              Track and manage your chess matches
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <CreatGame />
          </div>
        </div>
        <PaginatedGamesCards />
      </div>
    </div>
  );
};
export default GameCreatePage;
