// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // ✅ Dynamically pick backend based on environment
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("https://relayy-backend-9war.onrender.com/api/v1/users/verify", {
          withCredentials: true, // ✅ sends cookies for auth
        });

        if (res.status === 200 && res.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        console.error(
          "Verification failed:",
          err.response?.data?.message || err.message
        );
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  });

  // ✅ Show loader during verification
  if (loading) {
    return (
       <div className="fixed inset-0 bg-white flex justify-center items-center z-50 min-h-screen">
          <div className="loader"></div>
        </div>
    );
  }

  // ✅ Redirect unauthenticated users to login
  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
