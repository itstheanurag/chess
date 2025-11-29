import { X } from "lucide-react";
import { useGameStore } from "@/stores";
import { useAuthStore } from "@/stores";
import { GameType, SearchUserResponse, SearchData } from "@/types";
import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
};

export default function CreateGameModal({ onClose }: Props) {
  const {
    gameType,
    gameName,
    notes,
    setGameName,
    setGameType,
    setNotes,
    createGame,
    listGames,
  } = useGameStore();
  const { searchUser } = useAuthStore();

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [passcode, setPasscode] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<
    SearchUserResponse["users"]
  >([]);

  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim() || selectedUser) {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setIsSearching(true);
      const result = await searchUser({
        q: searchQuery,
        page: 1,
        size: 10,
      } as SearchData);

      console.log("CreateGameModal", "handler", result);
      setSearchResults(result?.data?.users || []);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, searchUser, selectedUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createGame();
    listGames();
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-card text-card-foreground rounded-2xl max-w-md w-full p-6 border border-border shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Create New Game</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Game Type */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Game Type
            </label>
            <Select
              value={gameType}
              onChange={(value) => {
                setGameType(value as any);
                setSelectedUser(null);
                setPasscode("");
              }}
              options={[
                { value: GameType.PUBLIC, label: "Public" },
                { value: GameType.PRIVATE, label: "Private" },
              ]}
            />
          </div>

          {/* Private game options */}
          {gameType === GameType.PRIVATE && (
            <div className="space-y-4">
              {/* Invite a User */}
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Invite a User (optional)
                </label>
                <input
                  type="text"
                  value={selectedUser ? selectedUser.name : searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedUser(null);
                  }}
                  placeholder="Search user..."
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />

                {!selectedUser && !isSearching && searchResults.length > 0 && (
                  <ul className="bg-popover border border-border mt-1 rounded-xl max-h-40 overflow-y-auto shadow-lg">
                    {searchResults.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => {
                          setSelectedUser({ id: user.id, name: user.name });
                          setSearchQuery(user.name);
                          setSearchResults([]);
                        }}
                        className="px-4 py-2 hover:bg-secondary cursor-pointer transition-colors"
                      >
                        {user.name} ({user.email})
                      </li>
                    ))}
                  </ul>
                )}
                {isSearching && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Searching...
                  </p>
                )}
              </div>

              {/* Passcode field - always visible for private games */}
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Passcode (optional)
                </label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter a passcode for others to join"
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Game Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Game Name
            </label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Optional"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              placeholder="Optional"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl font-semibold hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Create Game
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
