import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 5000;

// ⭐ CORS (ONLY ONCE + BEFORE ROUTES)
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true,
}));

// Middlewares
app.use(express.json()); // req.body parser
app.use(cookieParser()); // ⭐ REQUIRED for JWT cookies (fixes 401)

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Production (deployment ready)
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start server
server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});