import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.Auth.Middleware.js";

const app = express();
const server = http.createServer(app);

// ⭐ Online users map
const userSocketMap = {}; // { userId: socketId }

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Auth middleware (JWT cookies)
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  const userId = socket.userId;

  console.log("🟢 User connected:", socket.user?.fullName, userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.user?.fullName);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ⭐ Export helper (VERY IMPORTANT)
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

export { io, app, server };