import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [adding, setAdding] = useState(false);
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        { headers: { Authorization: token } }
      );
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Task fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    setAdding(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tasks`,
        { title: newTask },
        { headers: { Authorization: token } }
      );
      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
    } catch (err) {
      setError("Failed to add task ❌");
      console.error("Add task error:", err);
    } finally {
      setAdding(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: token } }
      );
      setTasks((prev) => prev.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error("Toggle task error:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/tasks/${id}`,
        { headers: { Authorization: token } }
      );
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px" }}>
      <motion.h2
        style={{ color: "#60a5fa", marginBottom: "24px" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Dashboard 📊
      </motion.h2>

      {/* Stats Cards */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
        {[
          { label: "Total Tasks", value: tasks.length, color: "#38bdf8" },
          { label: "Completed", value: tasks.filter((t) => t.completed).length, color: "#22c55e" },
          { label: "Pending", value: tasks.filter((t) => !t.completed).length, color: "#facc15" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ flex: "1", minWidth: "120px" }}
          >
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{stat.label}</p>
            <h1 style={{ margin: "6px 0 0", color: stat.color, fontSize: "36px" }}>{stat.value}</h1>
          </motion.div>
        ))}
      </div>

      {/* Add Task */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
            fontSize: "14px",
            outline: "none",
          }}
        />
        <button
          onClick={addTask}
          disabled={adding}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            opacity: adding ? 0.7 : 1,
          }}
        >
          {adding ? "Adding..." : "+ Add"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.4)",
          color: "#fca5a5",
          padding: "10px 14px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "13px",
        }}>
          {error}
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px" }}>
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "40px" }}>
          No tasks yet. Add one above! 👆
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {tasks.map((task, i) => (
            <motion.div
              key={task._id}
              className="card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                opacity: task.completed ? 0.6 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span style={{
                flex: 1,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "rgba(255,255,255,0.5)" : "white",
              }}>
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task._id)}
                style={{
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#fca5a5",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Delete
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
