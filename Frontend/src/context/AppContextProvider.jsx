import React, { useState, useEffect } from "react";
import { AppContent } from "./AppContext";
import axios from "axios";
import api from "../api/axios";

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Configure axios globally
  axios.defaults.withCredentials = true;

  // Interceptor to automatically add token from localStorage
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch current user data
  const getUserData = async () => {
    try {
      const { data } = await api.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success && data.userData) {
        setUserData(data.userData);
        setIsLoggedin(true);
        return data.userData;
      } else {
        setUserData(null);
        setIsLoggedin(false);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      const { data } = await api.get(`${backendUrl}/api/auth/profile`);
      if (data.success && data.user) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  // Get auth state on mount
  const getAuthState = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token in storage");
      }

      const { data } = await api.get(`${backendUrl}/api/auth/is-auth`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && data.userData) {
        setIsLoggedin(true);
        setUserData(data.userData);
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      console.warn("Auth check failed:", error.response?.data?.message || error.message);
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    getAuthState();
  }, []);

  // Logout helper
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedin(false);
    setUserData(null);
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
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};