import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  console.log("AdminRoute check - user:", user);
  console.log(
    "AdminRoute check - user token:",
    localStorage.getItem("userInfo"),
  );

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    console.log("User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("User is admin, allowing access");
  return children;
};

export default AdminRoute;
