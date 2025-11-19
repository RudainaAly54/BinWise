import React, { useState, useEffect } from "react";
import axios from "axios";
// ✅ Correct named import
import { AppContent } from "./AppContext";

// ✅ Create context
export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Configure Axios to always send cookies
  axios.defaults.withCredentials = true;

  // State
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // -------------------------------
  // Fetch authenticated user data
  // -------------------------------
  const getAuthState = async () => {
    setLoadingUser(true); // start loading
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        withCredentials: true,
      });

      if (data.success && data.userData) {
        setIsLoggedin(true);
        setUserData(data.userData);
        console.log("✅ User authenticated:", data.userData);
      } else {
        setIsLoggedin(false);
        setUserData(null);
        console.log("❌ No authenticated user");
      }
    } catch (error) {
      console.warn(
        "Auth check failed:",
        error.response?.data?.message || error.message
      );
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setLoadingUser(false); // finished loading
    }
  };

  // -------------------------------
  // Fetch user data (manual refresh)
  // -------------------------------
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/profile`, {
        withCredentials: true,
      });

      if (data.success && data.user) {
        setUserData(data.user);
        return data.user;
      } else {
        setUserData(null);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
      return null;
    }
  };

  // -------------------------------
  // Refresh user data (after profile updates)
  // -------------------------------
  const refreshUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/profile`, {
        withCredentials: true,
      });

      if (data.success && data.user) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  // -------------------------------
  // Run once on mount to load user state
  // -------------------------------
  useEffect(() => {
    getAuthState();
  }, []);

  // -------------------------------
  // Context value
  // -------------------------------
  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthState,
    refreshUserData,
    loadingUser,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};


// import React, { useState, useEffect } from "react";
// import { AppContent } from "./AppContext";
// import axios from "axios";

// export const AppContextProvider = ({ children }) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   // Configure axios to always send cookies
//   axios.defaults.withCredentials = true;

//   const [isLoggedin, setIsLoggedin] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [loadingUser, setLoadingUser] = useState(true); // optional: handle loading state

//   // ✅ Fetch user data from backend
//   const getUserData = async () => {
//     try {
//       // Ensure axios is configured to send cookies
//       axios.defaults.withCredentials = true;
//       //get because it will return promise which is async
//       const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
//         withCredentials: true,
//       });

//       if (data.success && data.userData) {
//         setUserData(data.userData);
//         setIsLoggedin(true);
//         return data.userData; // Return user data for redirection logic
//       } else {
//         setUserData(null);
//         setIsLoggedin(false);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setUserData(null);
//       setIsLoggedin(false);
//       return null;
//     } finally {
//       setLoadingUser(false);
//     }
//   };
//   // 🔄 Refresh user data after updates (like activities, profile update, etc.)
// const refreshUserData = async () => {
//   try {
//     const { data } = await axios.get(`${backendUrl}/api/auth/profile`, {
//       withCredentials: true,
//     });

//     if (data.success && data.user) {
//       setUserData(data.user);
//     }
//   } catch (error) {
//     console.error("Failed to refresh user data:", error);
//   }
// };


//   // ✅ Check authentication state on startup
//   const getAuthState = async () => {
//     try {
//       // Ensure axios is configured to send cookies
//       axios.defaults.withCredentials = true;
//       const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
//         withCredentials: true,
//       });

//       if (data.success && data.userData) {
//         setIsLoggedin(true);
//         setUserData(data.userData);
//         console.log("✅ User authenticated on startup:", data.userData);
//         console.log("✅ User role:", data.userData.role);
//       } else {
//         setIsLoggedin(false);
//         setUserData(null);
//         console.log("❌ No authenticated user on startup");
//       }
//     } catch (error) {
//       console.warn("Auth check failed:", error.response?.data?.message || error.message);
//       setIsLoggedin(false);
//       setUserData(null);
//     } finally {
//       setLoadingUser(false); // Always set loading to false
//     }
//   };

//   // ✅ Run once on mount to load user state
//   useEffect(() => {
//     getAuthState();
//   }, []);

//   const value = {
//     backendUrl,
//     isLoggedin,
//     setIsLoggedin,
//     userData,
//     setUserData,
//     getUserData,
//     getAuthState,
//     refreshUserData,
//     loadingUser,
//   };

//   return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
// };