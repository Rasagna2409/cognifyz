import dotenv from "dotenv";
dotenv.config(); // ← must be first!

import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import adminRoutes from "./routes/admin.js";
import chatRoutes from "./routes/chat.js";

const app = express(); // ← create app first!

app.use(morgan("dev"));      // ✅ logging
app.use(express.json());     // ✅ body parsing
app.use(cors({
  origin: function(origin, callback) {
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // ← add PATCH here!
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Cognifyz Backend Running Successfully");
});

app.listen(process.env.PORT || 5000, () => console.log("🚀 Server running"));