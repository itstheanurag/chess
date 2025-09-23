import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import ChessBoard from "./components/pages/chess/ChessBoard";
import { getInitialBoard } from "./utils/chess.utils";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/chess"
          element={<ChessBoard board={getInitialBoard()} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
