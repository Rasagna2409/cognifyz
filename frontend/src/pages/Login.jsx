import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
></motion.div>

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email || !password) {
      return alert("Enter all fields ❌");
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
            email,
            password,
        }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login Successful ✅");
      window.location = "/dashboard";
    } catch (err) {
      console.log(err.response?.data);
      alert("Login Failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>

      <p onClick={() => (window.location = "/signup")}>
        New user? Register
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
    margin: "auto",
  },
};