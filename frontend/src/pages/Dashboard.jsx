import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES = ["Todo", "In Progress", "Done"];
const CATEGORIES = ["General", "Work", "Personal", "Study"];

const priorityColor = {
  Low: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#22c55e" },
  Medium: { bg: "rgba(250,204,21,0.15)", border: "rgba(250,204,21,0.4)", text: "#facc15" },
  High: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.4)", text: "#ef4444" },
};

const statusColor = {
  "Todo": { bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)", text: "#6366f1" },
  "In Progress": { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)", text: "#3b82f6" },
  "Done": { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.4)", text: "#22c55e" },
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState({
    title: "", description: "", priority: "Medium",
    status: "Todo", dueDate: "", category: "General"
  });
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTasks = async () => {
    setError("");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, { headers });
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    setAdding(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, newTask, { headers });
      setTasks(prev => [...prev, res.data]);
      setNewTask({ title: "", description: "", priority: "Medium", status: "Todo", dueDate: "", category: "General" });
      setShowForm(false);
    } catch (err) {
      setError("Failed to add task.");
    } finally {
      setAdding(false);
    }
  };

  const updateTask = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${editTask._id}`, editTask, { headers });
      await fetchTasks();
      setEditTask(null);
    } catch (err) {
      setError("Failed to update task.");
    }
  };

  const markComplete = async (task) => {
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/tasks/${task._id}/complete`, {}, { headers });
      setTasks(prev => prev.map(t => t._id === task._id ? res.data : t));
    } catch (err) {
      console.error("Mark complete error:", err);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`,
        { completed: !task.completed, status: !task.completed ? "Done" : "Todo" }, { headers });
      setTasks(prev => prev.map(t => t._id === task._id ? res.data : t));
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, { headers });
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredTasks = tasks
    .filter(t => filterPriority === "All" || t.priority === filterPriority)
    .filter(t => filterStatus === "All" || t.status === filterStatus)
    .filter(t =>
      search === "" ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase()) ||
      t.priority?.toLowerCase().includes(search.toLowerCase())
    );

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)",
    color: "white", fontSize: "14px", outline: "none", boxSizing: "border-box"
  };

  const selectStyle = { ...inputStyle };

  return (
    <div style={{ padding: "30px", maxWidth: "900px" }}>
      <motion.h2
        style={{ color: "#60a5fa", marginBottom: "24px" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Dashboard 📊
      </motion.h2>

      {/* Stats */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
        {[
          { label: "Total Tasks", value: tasks.length, color: "#38bdf8" },
          { label: "Completed", value: tasks.filter(t => t.completed).length, color: "#22c55e" },
          { label: "Pending", value: tasks.filter(t => !t.completed).length, color: "#facc15" },
          { label: "High Priority", value: tasks.filter(t => t.priority === "High").length, color: "#ef4444" },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} style={{ flex: "1", minWidth: "120px" }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{stat.label}</p>
            <h1 style={{ margin: "6px 0 0", color: stat.color, fontSize: "36px" }}>{stat.value}</h1>
          </motion.div>
        ))}
      </div>

      {/* Search + Filters + Add Button */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search tasks..." style={{ ...inputStyle, flex: 2, minWidth: "150px" }} />
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
          style={{ ...selectStyle, flex: 1, minWidth: "120px" }}>
          <option value="All">All Priority</option>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ ...selectStyle, flex: 1, minWidth: "120px" }}>
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "10px 20px", borderRadius: "8px", border: "none",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "white", fontWeight: "bold", cursor: "pointer"
        }}>
          {showForm ? "✕ Cancel" : "+ Add Task"}
        </button>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="card" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#60a5fa", marginTop: 0 }}>New Task</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input placeholder="Task title *" value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })} style={inputStyle} />
              <textarea placeholder="Description (optional)" value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                  style={{ ...selectStyle, flex: 1 }}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
                <select value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}
                  style={{ ...selectStyle, flex: 1 }}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <select value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                  style={{ ...selectStyle, flex: 1 }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <input type="date" value={newTask.dueDate}
                  onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  style={{ ...inputStyle, flex: 1 }} />
              </div>
              <button onClick={addTask} disabled={adding} style={{
                padding: "12px", borderRadius: "8px", border: "none",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white", fontWeight: "bold", cursor: "pointer", opacity: adding ? 0.7 : 1
              }}>
                {adding ? "Adding..." : "✅ Add Task"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex",
              alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <motion.div className="card" initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              style={{ width: "100%", maxWidth: "500px" }}>
              <h3 style={{ color: "#60a5fa", marginTop: 0 }}>Edit Task ✏️</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input value={editTask.title} onChange={e => setEditTask({ ...editTask, title: e.target.value })}
                  style={inputStyle} placeholder="Title" />
                <textarea value={editTask.description || ""} onChange={e => setEditTask({ ...editTask, description: e.target.value })}
                  style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} placeholder="Description" />
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <select value={editTask.priority} onChange={e => setEditTask({ ...editTask, priority: e.target.value })}
                    style={{ ...selectStyle, flex: 1 }}>
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <select value={editTask.status} onChange={e => setEditTask({ ...editTask, status: e.target.value })}
                    style={{ ...selectStyle, flex: 1 }}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <select value={editTask.category || "General"} onChange={e => setEditTask({ ...editTask, category: e.target.value })}
                    style={{ ...selectStyle, flex: 1 }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <input type="date" value={editTask.dueDate?.split("T")[0] || ""}
                  onChange={e => setEditTask({ ...editTask, dueDate: e.target.value })} style={inputStyle} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={updateTask} style={{
                    flex: 1, padding: "12px", borderRadius: "8px", border: "none",
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    color: "white", fontWeight: "bold", cursor: "pointer"
                  }}>💾 Save</button>
                  <button onClick={() => setEditTask(null)} style={{
                    flex: 1, padding: "12px", borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.2)", background: "transparent",
                    color: "white", cursor: "pointer"
                  }}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
          color: "#fca5a5", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
          {error}
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <div style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px" }}>Loading tasks...</div>
      ) : filteredTasks.length === 0 ? (
        <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "40px" }}>
          No tasks found. Add one above! 🎯
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredTasks.map((task, i) => (
            <motion.div key={task._id} className="card"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ opacity: task.completed ? 0.6 : 1 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task)}
                  style={{ width: "18px", height: "18px", cursor: "pointer", marginTop: "3px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "rgba(255,255,255,0.5)" : "white",
                      fontWeight: "600", fontSize: "15px"
                    }}>{task.title}</span>
                    {task.priority && (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                        background: priorityColor[task.priority]?.bg,
                        border: `1px solid ${priorityColor[task.priority]?.border}`,
                        color: priorityColor[task.priority]?.text }}>
                        {task.priority}
                      </span>
                    )}
                    {task.status && (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                        background: statusColor[task.status]?.bg,
                        border: `1px solid ${statusColor[task.status]?.border}`,
                        color: statusColor[task.status]?.text }}>
                        {task.status}
                      </span>
                    )}
                    {task.category && (
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                        background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                        {task.category}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                      📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  {!task.completed && (
                    <button onClick={() => markComplete(task)} style={{
                      background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.3)",
                      color: "#22c55e", borderRadius: "6px", padding: "4px 10px",
                      cursor: "pointer", fontSize: "12px"
                    }}>✅ Done</button>
                  )}
                  <button onClick={() => setEditTask(task)} style={{
                    background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)",
                    color: "#60a5fa", borderRadius: "6px", padding: "4px 10px",
                    cursor: "pointer", fontSize: "12px"
                  }}>✏️ Edit</button>
                  <button onClick={() => deleteTask(task._id)} style={{
                    background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)",
                    color: "#fca5a5", borderRadius: "6px", padding: "4px 10px",
                    cursor: "pointer", fontSize: "12px"
                  }}>🗑️</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}