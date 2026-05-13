import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  
  const { user } = useContext(AuthContext);
  const stored = localStorage.getItem("userInfo");
  let parsed = null;
  try {
    parsed = stored ? JSON.parse(stored) : null;
  } catch {
    parsed = null;
  }
  const effectiveUser = user || parsed;

  if (!effectiveUser) {
    return <Navigate to="/login" replace state={{ fromAdmin: true }} />;
  }

  if (!effectiveUser.isAdmin) {
    return <Navigate to="/my-bookings" replace />;
  }

  return children;
};

export default AdminRoute;
