import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="sidebar"
    >
      <h2 className="logo">SaaS App</h2>

      <Link to="/dashboard">📊 Dashboard</Link>
      <Link to="/chat">💬 AI Chat</Link>
      <Link to="/admin">👑 Admin</Link>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location = "/";
        }}
      >
        🚪 Logout
      </button>
    </motion.div>
  );
}