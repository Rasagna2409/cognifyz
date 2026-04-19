import express from "express";
import User from "../models/User.js";

// DEACTIVATE / ACTIVATE user
router.patch("/user/:id/toggle", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

const router = express.Router();

// GET all users
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// DELETE user
router.delete("/user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
});

// UPDATE role
router.put("/user/:id", async (req, res) => {
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );

  res.json(user);
});

export default router;