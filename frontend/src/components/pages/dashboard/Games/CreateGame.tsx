import { useState } from "react";
import { GameType, CreateGameData } from "@/types";
import { useGameStore } from "@/stores";
import Button from "@/components/ui/buttons/Button";

const CreateGameForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const createGame = useGameStore((state) => state.createGame);

  const [type, setType] = useState<GameType>(GameType.PUBLIC);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name) return setError("Name is required");

    setLoading(true);
    setError("");

    const data: CreateGameData = { type, name, note };

    try {
      createGame(data);
      setName("");
      setNote("");
      onSuccess?.(); //
    } catch (err) {
      console.error(err);
      setError("Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Create New Game
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Game Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as GameType)}
          className="w-full border border-gray-300 rounded-lg p-2 bg-neutral-50 text-neutral-700 focus:ring-2 focus:ring-neutral-400 focus:outline-none"
        >
          <option value={GameType.PUBLIC}>Play with Friend</option>
          <option value={GameType.PRIVATE}>Find Opponent</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Game Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter game name"
          className="w-full border rounded-lg p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
          className="w-full border rounded-lg p-2"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Game"}
      </Button>
    </div>
  );
};

export default CreateGameForm;
