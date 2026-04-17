import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
            headers: { Authorization: token },
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.log(err);
      alert("Access Denied or Server Error ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#60a5fa" }}>Admin Dashboard 👑</h2>

      {/* STATS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <div className="card">
          <h3>Total Users</h3>
          <h1 style={{ color: "#38bdf8" }}>{users.length}</h1>
        </div>

        <div className="card">
          <h3>Active Users</h3>
          <h1 style={{ color: "#38bdf8" }}>{users.length}</h1>
        </div>

        <div className="card">
          <h3>System Status</h3>
          <h1 style={{ color: "#22c55e" }}>Online</h1>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="card" style={{ marginTop: "20px" }}>
        <h3>Users List</h3>

        <table style={{ width: "100%", marginTop: "10px" }}>
          <thead>
            <tr style={{ color: "#93c5fd" }}>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td style={{ color: "#60a5fa" }}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}