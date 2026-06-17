import { useEffect, useState } from "react";

function Chat() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/chat");

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      console.log("📩 Message received:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (err) => {
      console.log("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("⚠️ Disconnected");
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.send(message);
      setMessage("");
    } else {
      console.log("Socket not ready or empty message");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Real-Time Chat</h2>

      <div
        style={{
          border: "1px solid black",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;