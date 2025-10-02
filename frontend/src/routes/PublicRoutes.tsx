import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores";

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { authUser } = useAuthStore();
  if (authUser) return <Navigate to="/dashboard" replace />;

  return children;
};

export default PublicRoute;
