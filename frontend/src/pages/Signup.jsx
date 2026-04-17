import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!name || !email || !password) {
      return alert("All fields required ❌");
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
    });

      alert("Registered Successfully ✅");
      window.location = "/";
    } catch (err) {
      console.log(err.response?.data);
      alert("Registration Failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Signup</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={register}>Register</button>

      <p onClick={() => (window.location = "/")}>
        Already have account? Login
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