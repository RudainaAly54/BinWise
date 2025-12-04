import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

console.log("🔌 Initializing socket connection to:", BACKEND_URL);

// Initialize socket connection
const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  autoConnect: false, // Don't connect automatically - let AppContext handle it
});

// Connection event listeners
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    // Server disconnected, try to reconnect manually
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log(`🔄 Attempting to reconnect... (${attemptNumber})`);
});

socket.on("reconnect_failed", () => {
  console.error("❌ Socket reconnection failed after all attempts");
});

// Helper functions for managing socket connection
export const initSocket = (userId) => {
  console.log("🚀 Initializing socket for user:", userId);
  
  if (!socket.connected) {
    socket.connect();
  }
  
  if (userId) {
    // Wait for connection before authenticating
    if (socket.connected) {
      socket.emit("authenticate", userId);
      socket.emit("join-user-room", userId);
    } else {
      socket.once("connect", () => {
        socket.emit("authenticate", userId);
        socket.emit("join-user-room", userId);
      });
    }
  }
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("🔌 Socket manually disconnected");
  }
};

export const getSocket = () => socket;

export default socket;