import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Loader2 } from "lucide-react";

// --- FIX: Use VITE_BACKEND_URL as the primary source for both ---
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://relayy-backend-9war.onrender.com";
// --- END OF FIX ---

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Set default axios settings globally for all requests
  axios.defaults.baseURL = BASE_URL; // Uses the base URL for the root
  axios.defaults.withCredentials = true;

  // Effect to verify user on load
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsAuthLoading(false);
        setAuthUser(null);
        setToken(null);
        return;
      }

      try {
        // The request is correctly formed here: BASE_URL + /api/v1/users/verify
        const res = await axios.get("/api/v1/users/verify", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (res.status === 200) {
          setAuthUser(res.data.user);
          setToken(storedToken);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("token");
        setAuthUser(null);
        setToken(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    verifyUser();
  }, []);

  // Effect to manage Socket.IO connection
  useEffect(() => {
    if (token && authUser) {
      console.log("🔄 Attempting to connect socket...");
      // Connect to socket server with credentials
      const newSocket = io(BASE_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      newSocket.on("connect", () => {
        console.log("✅ Socket connected:", newSocket.id);
        setSocket(newSocket);
      });

      newSocket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
        console.error("❌ Full error:", err);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
        setSocket(null);
      });

      // Listen for global notifications
      newSocket.on("new-message-notification", (message) => {
        setNotifications((prev) => [
          ...prev,
          { id: message._id, from: message.sender },
        ]);
      });

      // Clean up on token/user change or unmount
      return () => {
        newSocket.disconnect();
      };
    } else {
      // If no token, disconnect any existing socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [token, authUser]); // Re-run when auth state changes

  // Function to handle login
  const login = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    setAuthUser(userData);
    setToken(userToken);
    setIsAuthLoading(false);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setToken(null);
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
  };

  // Value to be passed to consumers
  const value = {
    authUser,
    setAuthUser,
    token,
    isAuthLoading,
    login,
    logout,
    socket,
    notifications,
    setNotifications,
  };

  // Show loading spinner while verifying auth
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-emerald-100">
        <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  // Render children once auth is settled
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create the Consumer Hook
export const useAuth = () => {
  return useContext(AuthContext);
};