import React from "react";
import { useAuth } from "../contexts/authContexts";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/intranet" />;
  }

  return children;
};

export default ProtectedRoute;
