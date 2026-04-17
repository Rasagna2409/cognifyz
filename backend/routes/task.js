// routes/task.js
import express from "express";
import Task from "../models/Task.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async(req,res)=>{
  res.json(await Task.find({userId:req.user.id}));
});

router.post("/", auth, async(req,res)=>{
  res.json(await Task.create({userId:req.user.id,title:req.body.title,completed:false}));
});

export default router;