import { X } from "lucide-react";
import { useGameStore } from "@/stores";
import { GameType } from "@/types";

type Props = {
  onClose: () => void;
};

export default function CreateGameModal({ onClose }: Props) {
  const { gameName, gameType, notes, setGameName, setGameType, setNotes } =
    useGameStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Game created with:", { gameName, gameType, notes });
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
          <div>
            <label className="block text-sm font-medium mb-2">Game Type</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value as any)}
              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:outline-none focus:border-neutral-400"
              required
            >
              <option value={GameType.PUBLIC}>Public</option>
              <option value={GameType.PRIVATE}>Private</option>
            </select>
          </div>

          {/* Game Name (optional) */}
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

          {/* Notes (optional) */}
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
