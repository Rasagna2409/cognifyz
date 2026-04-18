import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import adminRoutes from "./routes/admin.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Cognifyz Backend Running Successfully");
});

app.listen(5000, () => console.log("Server running"));