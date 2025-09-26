import { useState } from "react";
import { GameType, CreateGameData } from "@/types";
import { useGameStore } from "@/stores";

const CreateGame = () => {
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
      await createGame(data);
      setName("");
      setNote("");
    } catch (err) {
      console.error(err);
      setError("Failed to create game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Create New Game
      </h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Game Type */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Game Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as GameType)}
          className="w-full border rounded-lg p-2"
        >
          <option value={GameType.PUBLIC}>Play with Friend</option>
          <option value={GameType.PRIVATE}>Find Opponent</option>
        </select>
      </div>

      {/* Game Name */}
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

      {/* Note */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
          className="w-full border rounded-lg p-2"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Game"}
      </button>
    </div>
  );
};

export default CreateGame;
