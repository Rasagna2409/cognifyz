import { useState } from "react";
import axios from "axios";

export default function Chat() 
{
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const token = localStorage.getItem("token");

  const send = async () => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/chat`,
    { message },
    {
      headers: { Authorization: token },
    }
  );
  };

    setChat([...chat, { u: message, a: res.data.reply }]);
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#60a5fa" }}>AI Chat 💬</h2>

      <div className="card" style={{ height: "300px", overflowY: "auto" }}>
        {chat.map((c, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <p><b style={{ color: "#93c5fd" }}>You:</b> {c.u}</p>
            <p><b style={{ color: "#60a5fa" }}>AI:</b> {c.a}</p>
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        style={{ width: "100%", marginTop: "10px" }}
      />

      <button onClick={send} style={{ marginTop: "10px" }}>
        Send
      </button>
    </div>
  );
