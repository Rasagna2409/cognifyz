import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    setError("");
    if (!name || !email || !password) return setError("All fields are required ❌");

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") register();
  };

  return (
    <motion.div
      style={styles.wrapper}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account 🚀</h2>
        <p style={styles.subtitle}>Join SaaS App today</p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          onClick={register}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={styles.link} onClick={() => navigate("/")}>
          Already have account? <span style={styles.linkSpan}>Login here</span>
        </p>
      </div>
    </motion.div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "40px",
    width: "340px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    color: "#60a5fa",
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "rgba(255,255,255,0.5)",
  },
  error: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.4)",
    color: "#fca5a5",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "white",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  link: {
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: "13px",
    cursor: "pointer",
    margin: 0,
  },
  linkSpan: {
    color: "#60a5fa",
    textDecoration: "underline",
  },
};
