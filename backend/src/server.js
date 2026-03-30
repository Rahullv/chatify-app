// import express from "express";
// import path from "path";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routes/auth-routes.js";
// import messageRoutes from "./routes/message-routes.js";
// import { connectDB } from "./lib/db.js";
// import { ENV } from "./lib/env.js";
// import { app, server } from "./lib/socket.js";
// import dns from "dns";

// dns.setServers(["1.1.1.1", "8.8.8.8"]);


// const __dirname = path.resolve();
// const PORT = ENV.PORT || 5000;

// // ⭐ CORS (ONLY ONCE + BEFORE ROUTES)
// const allowedOrigins = (ENV.CORS_ORIGINS || "http://localhost:5173")
//   .split(",")
//   .map(origin => origin.trim())
//   .filter(origin => origin !== "");
// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));

// // Middlewares
// app.use(express.json()); // req.body parser
// app.use(cookieParser()); // ⭐ REQUIRED for JWT cookies (fixes 401)

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// // Production (deployment ready)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   // ✅ FIXED fallback route (handles /call/:id, /login, etc.)
//   app.use((req, res) => {
//     if (req.originalUrl.startsWith("/api")) {
//       return res.status(404).json({ message: "API route not found" });
//     }

//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   });
// }

// // Start server
// (async () => {
//   try {
//     await connectDB();
//     server.listen(PORT, () => {
//       console.log("Server is running on port: " + PORT);
//     });
//   } catch (error) {
//     console.error("Failed to connect to the database:", error);
//     process.exit(1);
//   }
// })();

import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const __dirname = path.resolve();
const PORT = ENV.PORT || 5000;

// =======================
// ✅ CORS FIX (FINAL)
// =======================
app.use(
  cors({
    origin: true, // ✅ allow all origins (dev safe)
    credentials: true,
  })
);

// =======================
// ✅ MIDDLEWARES
// =======================
app.use(express.json());
app.use(cookieParser());

// =======================
// ✅ API ROUTES
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// =======================
// ✅ SERVE FRONTEND (IMPORTANT)
// =======================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // ✅ serve static files (JS, CSS)
  app.use(express.static(frontendPath));

  // ✅ React fallback (MUST BE LAST)
  app.get("*", (req, res) => {
    if (req.originalUrl.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }

    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// =======================
// ✅ START SERVER
// =======================
(async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log("🚀 Server is running on port:", PORT);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB:", error);
    process.exit(1);
  }
})();