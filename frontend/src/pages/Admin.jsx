import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        { headers: { Authorization: token } }
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("Access Denied ❌ You don't have admin privileges.");
      } else {
        setError("Failed to load users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const activeUsers = users.filter((u) => u.isActive !== false);

  return (
    <div style={{ padding: "30px", maxWidth: "900px" }}>
      <motion.h2
        style={{ color: "#60a5fa", marginBottom: "24px" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard 👑
      </motion.h2>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.4)",
          color: "#fca5a5",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
        }}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px",
        marginBottom: "24px",
      }}>
        {[
          { label: "Total Users", value: loading ? "..." : users.length, color: "#38bdf8" },
          { label: "Active Users", value: loading ? "..." : activeUsers.length, color: "#22c55e" },
          { label: "System Status", value: "Online", color: "#22c55e" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <p style={{ margin: 0, color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
              {stat.label}
            </p>
            <h1 style={{ margin: "6px 0 0", color: stat.color, fontSize: "36px" }}>
              {stat.value}
            </h1>
          </motion.div>
        ))}
      </div>

      {/* Users Table */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 style={{ margin: "0 0 16px", color: "white" }}>Users List</h3>

        {loading ? (
          <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "30px" }}>
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "30px" }}>
            No users found.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                color: "#93c5fd",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr
                  key={u._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <td style={tdStyle}>{u.name || "—"}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>
                    <span style={{
                      background: u.role === "admin"
                        ? "rgba(96,165,250,0.15)"
                        : "rgba(255,255,255,0.08)",
                      color: u.role === "admin" ? "#60a5fa" : "rgba(255,255,255,0.7)",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}>
                      {u.role || "user"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      background: u.isActive !== false
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(239,68,68,0.15)",
                      color: u.isActive !== false ? "#22c55e" : "#fca5a5",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}>
                      {u.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
}

const thStyle = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: "600",
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
  color: "rgba(255,255,255,0.85)",
};