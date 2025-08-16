import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();

  // Redirect to role-specific dashboards
  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Fallback for unknown roles
  return <Navigate to="/student/dashboard" replace />;
};

export default DashboardPage;
