import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks", {
        headers: { Authorization: token },
      })
      .then((res) => setTasks(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#60a5fa" }}>Dashboard 📊</h2>

      <div style={{ display: "flex", gap: "15px" }}>
        <div className="card">
          <h3>Total Tasks</h3>
          <h1 style={{ color: "#38bdf8" }}>{tasks.length}</h1>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h1 style={{ color: "#22c55e" }}>
            {tasks.filter((t) => t.completed).length}
          </h1>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <h1 style={{ color: "#facc15" }}>
            {tasks.filter((t) => !t.completed).length}
          </h1>
        </div>
      </div>
    </div>
  );
}