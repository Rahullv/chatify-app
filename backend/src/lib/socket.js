import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.Auth.Middleware.js";

const app = express();
const server = http.createServer(app);

// Replace userSocketMap with a Map
const userSocketMap = new Map();

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// JWT cookie auth
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  const userId = socket.userId?.toString();

  console.log("🟢 User connected:", socket.user?.fullName, userId);

  if (userId) {
    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);
  }

  // ALWAYS emit normalized string IDs
  const onlineUsers = Array.from(userSocketMap.keys());
  io.emit("getOnlineUsers", onlineUsers);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.user?.fullName);

    if (userId && userSocketMap.has(userId)) {
      const userSockets = userSocketMap.get(userId);
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        userSocketMap.delete(userId);
      }
    }

    const updatedOnlineUsers = Array.from(userSocketMap.keys());
    io.emit("getOnlineUsers", updatedOnlineUsers);
  });
});

// helper for real-time messages
export const getReceiverSocketId = (receiverId) => {
  const sockets = userSocketMap.get(receiverId?.toString());
  return sockets ? Array.from(sockets) : [];
};



io.on("connection", (socket) => {
  const userId = socket.userId?.toString();

  console.log("🟢 User connected:", userId);

  // 🟢 TYPING START
  socket.on("typing", ({ receiverId }) => {
    const receiverSockets = getReceiverSocketId(receiverId);

    receiverSockets.forEach((id) => {
      io.to(id).emit("typing", {
        senderId: socket.userId,
      });
    });
  });

  // 🟢 TYPING STOP
  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSockets = getReceiverSocketId(receiverId);

    receiverSockets.forEach((id) => {
      io.to(id).emit("stopTyping", {
        senderId: socket.userId,
      });
    });
  });

  // 🔴 DISCONNECT
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", userId);
  });
});

export { io, app, server };