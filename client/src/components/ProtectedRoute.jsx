import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // React state updates are async. After login(), setUser() may not have
  // committed yet when navigate("/dashboard") fires. Check localStorage
  // as a synchronous fallback since it's written before navigation.
  const storedUser = localStorage.getItem("userInfo");

  if (!user && !storedUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
