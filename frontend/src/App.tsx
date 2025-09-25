import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Game from "./components/pages/chess/Game";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chess" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App;
