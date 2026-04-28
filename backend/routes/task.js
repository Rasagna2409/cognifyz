import express from "express";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";
import { cacheMiddleware } from "../middleware/cache.js";

const router = express.Router();

// Get all tasks (with caching)
router.get("/", auth, cacheMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Create task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, category } = req.body;
    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      priority,
      status,
      dueDate,
      category,
      completed: false
    });
    res.json(task);
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(500).json({ msg: err.message });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
});

// Mark as complete
router.patch("/:id/complete", auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: true, status: "Done" },
    { new: true }
  );
  res.json(task);
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Task deleted" });
});

export default router;