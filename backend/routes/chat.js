import express from "express";
import { auth } from "../middleware/auth.js";
import { getAIResponse } from "../utils/ai.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const reply = await getAIResponse(req.body.message);
  res.json({ reply });
});

export default router;