import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const send = async () => {
    if (!message.trim()) return;
    setError("");
    const userMsg = message;
    setMessage("");
    setChat((prev) => [...prev, { u: userMsg, a: null }]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat`,
        { message: userMsg },
        { headers: { Authorization: token } }
      );
      setChat((prev) =>
        prev.map((c, i) =>
          i === prev.length - 1 ? { ...c, a: res.data.reply } : c
        )
      );
    } catch (err) {
      setError("Failed to get a reply ❌");
      console.error("Chat error:", err);
      setChat((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "700px", display: "flex", flexDirection: "column", height: "calc(100vh - 60px)" }}>
      <motion.h2
        style={{ color: "#60a5fa", marginBottom: "20px" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        AI Chat 💬
      </motion.h2>

      {/* Chat Messages */}
      <div
        className="card"
        style={{ flex: 1, overflowY: "auto", padding: "20px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {chat.length === 0 && (
          <div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", margin: "auto" }}>
            Start a conversation! 👋
          </div>
        )}
        {chat.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            {/* User message */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                padding: "10px 14px",
                borderRadius: "14px 14px 4px 14px",
                maxWidth: "75%",
                fontSize: "14px",
              }}>
                {c.u}
              </div>
            </div>
            {/* AI reply */}
            {c.a !== null ? (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "10px 14px",
                  borderRadius: "14px 14px 14px 4px",
                  maxWidth: "75%",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.85)",
                }}>
                  {c.a}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  background: "rgba(255,255,255,0.08)",
                  padding: "10px 14px",
                  borderRadius: "14px 14px 14px 4px",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.4)",
                }}>
                  Thinking...
                </div>
              </div>
            )}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div style={{
          color: "#fca5a5",
          fontSize: "13px",
          marginBottom: "8px",
          padding: "8px 12px",
          background: "rgba(239,68,68,0.1)",
          borderRadius: "8px",
        }}>
          {error}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && send()}
          placeholder="Type a message..."
          disabled={loading}
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
          onClick={send}
          disabled={loading || !message.trim()}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            opacity: loading || !message.trim() ? 0.6 : 1,
          }}
        >
          Send →
        </button>
      </div>
    </div>
  );
}
