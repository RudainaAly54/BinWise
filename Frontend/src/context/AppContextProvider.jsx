import React, { useState, useEffect, useRef } from "react";
import { AppContent } from "./AppContext";
import api from "../api/axios";
import { initSocket, disconnectSocket } from "../utils/socket";

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [socket, setSocket] = useState(null);
  
  // ✅ Use ref to track if socket is already initialized
  const socketInitialized = useRef(false);

  // Helper to initialize socket (only once)
  const initializeSocket = (userId) => {
    if (!userId || socketInitialized.current) {
      return;
    }

    console.log("📡 Initializing socket for user:", userId);
    const socketInstance = initSocket(userId);
    setSocket(socketInstance);
    socketInitialized.current = true;
  };

  // Fetch current user data
  const getUserData = async () => {
    try {
      console.log("🔍 Fetching user data...");
      const { data } = await api.get("/api/auth/is-auth");
      
      console.log("📦 User data response:", data);
      
      if (data.success && data.userData) {
        setUserData(data.userData);
        setIsLoggedin(true);
        console.log("✅ User authenticated:", data.userData.email);
        
        // Initialize socket
        const userId = data.userData._id || data.userData.id;
        initializeSocket(userId);
        
        return data.userData;
      } else {
        setUserData(null);
        setIsLoggedin(false);
        console.log("❌ User not authenticated");
        return null;
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error.response?.data || error.message);
      setUserData(null);
      setIsLoggedin(false);
      return null;
    } finally {
      setLoadingUser(false);
    }
  };

  // Refresh user profile
  const refreshUserData = async () => {
    try {
      console.log("🔄 Refreshing user profile...");
      const { data } = await api.get("/api/auth/profile");
      
      if (data.success && (data.userData || data.user)) {
        const user = data.userData || data.user;
        setUserData(user);
        console.log("✅ Profile refreshed:", user.email);
        console.log("📊 Activities count:", user.activity?.length || 0);
      }
    } catch (error) {
      console.error("❌ Failed to refresh user data:", error.response?.data || error.message);
    }
  };

  // Get auth state on mount
  const getAuthState = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.log("⚠️ No token found in localStorage");
        throw new Error("No token in storage");
      }

      console.log("🔍 Checking auth state...");

      const { data } = await api.get("/api/auth/is-auth");

      if (data.success && data.userData) {
        setIsLoggedin(true);
        setUserData(data.userData);
        console.log("✅ Auth state verified:", data.userData.email);
        
        // Initialize socket
        const userId = data.userData._id || data.userData.id;
        initializeSocket(userId);
      } else {
        setIsLoggedin(false);
        setUserData(null);
        console.log("❌ Auth verification failed");
      }
    } catch (error) {
      console.warn("❌ Auth check failed:", error.response?.data?.message || error.message);
      setIsLoggedin(false);
      setUserData(null);
      
      // Clear invalid token
      if (error.response?.status === 401) {
        console.log("🗑️ Clearing invalid token");
        localStorage.removeItem("token");
      }
    } finally {
      setLoadingUser(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    console.log("🚀 AppContextProvider mounted");
    console.log("🌐 Backend URL:", backendUrl);
    getAuthState();

    // Cleanup socket on unmount
    return () => {
      console.log("🧹 Cleaning up socket connection");
      disconnectSocket();
      socketInitialized.current = false;
    };
  }, []);

  // Logout helper
  const logout = async () => {
    try {
      console.log("🚪 Logging out...");
      
      // Call logout endpoint to clear server-side cookies
      await api.post("/api/auth/logout");
      
      // Disconnect socket
      disconnectSocket();
      setSocket(null);
      socketInitialized.current = false;
      
      // Clear client-side storage
      localStorage.removeItem("token");
      setIsLoggedin(false);
      setUserData(null);
      
      console.log("✅ Logged out successfully");
    } catch (error) {
      console.error("❌ Logout error:", error);
      
      // Still clear local data even if API call fails
      disconnectSocket();
      setSocket(null);
      socketInitialized.current = false;
      localStorage.removeItem("token");
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthState,
    refreshUserData,
    logout,
    loadingUser,
    socket,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};