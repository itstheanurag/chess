import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authUser, isLoading } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;
  if (!authUser) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
