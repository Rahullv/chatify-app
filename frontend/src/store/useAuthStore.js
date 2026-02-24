import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  // 🟢 CHECK AUTH
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      // connect socket after auth
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 🟢 SIGNUP
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // 🟢 LOGIN
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully");

      // ⭐ CONNECT SOCKET AFTER LOGIN
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // 🟢 LOGOUT
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      // ⭐ IMPORTANT: disconnect socket on logout
      get().disconnectSocket();

      set({ authUser: null, onlineUsers: [] });

      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  // 🟢 UPDATE PROFILE
  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error?.response?.data?.message);
    }
  },

  // 🟢 CONNECT SOCKET (FINAL CORRECT)
  connectSocket: () => {
    const { authUser, socket } = get();

    // prevent duplicate connection
    if (!authUser?._id) return;

    // if socket already exists, disconnect first (clean reconnect)
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id, // ⭐ CRITICAL for online users
      },
      withCredentials: true,
      transports: ["websocket"],
    });

    set({ socket: newSocket });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    // ⭐ THIS DRIVES THE GREEN ONLINE DOT
    newSocket.on("getOnlineUsers", (userIds) => {
      console.log("🟢 Online users:", userIds);
      set({ onlineUsers: userIds });
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  },

  // 🟢 DISCONNECT SOCKET (MISSING IN YOUR CODE)
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  },
}));