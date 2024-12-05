import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </>
  );
};

export default App;
