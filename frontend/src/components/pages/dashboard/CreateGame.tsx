import { Plus, Users } from "lucide-react";

const CreateGame = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Create New Game
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900">Play with Friend</h3>
          <p className="text-sm text-gray-500 mt-2">Invite a friend to play</p>
        </button>
        <button className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-medium text-gray-900">Find Opponent</h3>
          <p className="text-sm text-gray-500 mt-2">
            Match with a random player
          </p>
        </button>
      </div>
    </div>
  );
};

export default CreateGame;
