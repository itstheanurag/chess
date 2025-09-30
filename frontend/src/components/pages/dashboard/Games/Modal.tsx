import { X } from "lucide-react";
import { useGameStore } from "@/stores";
import { useAuthStore } from "@/stores";
import { GameType, SearchUserResponse, SearchData } from "@/types";
import { useState, useEffect } from "react";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGame();
    listGames();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 text-neutral-50">
      <div className="bg-neutral-800 rounded-lg max-w-md w-full p-6 border border-neutral-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Game</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Game Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Game Type</label>
            <select
              value={gameType}
              onChange={(e) => {
                setGameType(e.target.value as any);
                setSelectedUser(null); // reset selection when type changes
                setPasscode("");
              }}
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-neutral-400"
              required
            >
              <option value={GameType.PUBLIC}>Public</option>
              <option value={GameType.PRIVATE}>Private</option>
            </select>
          </div>

          {/* Private game options */}
          {gameType === GameType.PRIVATE && (
            <div className="space-y-4">
              {/* Invite a User */}
              <div>
                <label className="block text-sm font-medium mb-2">
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
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-neutral-400"
                />

                {!selectedUser && !isSearching && searchResults.length > 0 && (
                  <ul className="bg-neutral-700 mt-1 rounded-lg max-h-40 overflow-y-auto">
                    {searchResults.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => {
                          setSelectedUser({ id: user.id, name: user.name });
                          setSearchQuery(user.name);
                          setSearchResults([]);
                        }}
                        className="px-4 py-2 hover:bg-neutral-600 cursor-pointer"
                      >
                        {user.name} ({user.email})
                      </li>
                    ))}
                  </ul>
                )}
                {isSearching && (
                  <p className="text-sm text-gray-400 mt-1">Searching...</p>
                )}
              </div>

              {/* Passcode field - always visible for private games */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Passcode (optional)
                </label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter a passcode for others to join"
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>
          )}

          {/* Game Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Game Name</label>
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-neutral-400"
              placeholder="Optional"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-neutral-400 resize-none"
              placeholder="Optional"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-600 text-neutral-50 px-4 py-2 rounded-lg font-semibold hover:bg-neutral-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-neutral-50 text-neutral-800 px-4 py-2 rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
            >
              Create Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
