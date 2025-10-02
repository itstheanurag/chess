import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion, easeInOut } from "framer-motion";

import Home from "../components/Home/Home";
import Login from "../components/pages/auth/Login";
import Register from "../components/pages/auth/SignUp";
import DashboardLayout from "../components/pages/dashboard/Layout";
import ChessGamePage from "../components/pages/chess/ChessGamePage";
import PublicRoute from "./PublicRoutes";
import ProtectedRoute from "./ProtectedRoutes";
import ChessDashboard from "@/components/pages/dashboard/Dashboard";
import GameCreatePage from "@/components/pages/dashboard/Games/GameCreatePage";

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ChessDashboard />} />
          <Route path="create-game" element={<GameCreatePage />} />
          <Route path="game/:gameId" element={<ChessGamePage />} />
          <Route path="activity" element={<>coming soon...</>} />
          <Route path="leaderboard" element={<>coming soon...</>} />
          <Route path="puzzles" element={<>coming soon...</>} />
          <Route path="friends" element={<>coming soon...</>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
