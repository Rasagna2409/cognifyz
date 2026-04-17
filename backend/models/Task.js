import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  userId:String,
  title:String,
  completed:Boolean
});
export default mongoose.model("Task",taskSchema);