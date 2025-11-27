import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Loading from "../components/ui/Loading";


const Home = lazy(() => import("../components/Home/Home"));
const Login = lazy(() => import("../components/pages/auth/Login"));
const Register = lazy(() => import("../components/pages/auth/SignUp"));
const DashboardLayout = lazy(
  () => import("../components/pages/dashboard/Layout")
);
const ChessGamePage = lazy(
  () => import("../components/pages/chess/ChessGamePage")
);
const ChessDashboard = lazy(
  () => import("@/components/pages/dashboard/Dashboard")
);
const GameCreatePage = lazy(
  () => import("@/components/pages/dashboard/Games/GameCreatePage")
);

import PublicRoute from "./PublicRoutes";
import ProtectedRoute from "./ProtectedRoutes";

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
