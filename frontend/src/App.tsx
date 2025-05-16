import React from "react";
import ChessBoard from "./components/pages/chess/ChessBoard";
import { getInitialBoard } from "./utils/chess.utils";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 p-4">
      <ChessBoard board={getInitialBoard()} />
    </div>
  );
}

export default App;
