import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AnimatePresence, motion, easeInOut } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home/Home";
import Login from "./components/pages/auth/Login";
import Register from "./components/pages/auth/SignUp";
import { useAuthStore } from "./stores";
import DashboardLayout from "./components/pages/dashboard/Layout";
import ChessGamePage from "./components/pages/chess/ChessGamePage";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authUser, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!authUser) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { authUser } = useAuthStore();
  if (authUser) return <Navigate to="/dashboard" replace />;
  return children;
};

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
        <Route
          path="/"
          element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: easeInOut }}
            >
              <Home />
            </motion.div>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: easeInOut }}
              >
                <Login />
              </motion.div>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: easeInOut }}
              >
                <Register />
              </motion.div>
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.35, ease: easeInOut }}
              >
                <DashboardLayout />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/game/:gameId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChessGamePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AnimatedRoutes />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </Router>
  );
};

export default App;
