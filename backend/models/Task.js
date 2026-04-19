import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Todo", "In Progress", "Done"], default: "Todo" },
  dueDate: { type: Date },
  category: { type: String, default: "General" },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);