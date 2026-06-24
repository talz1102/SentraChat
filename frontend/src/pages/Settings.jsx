import { useState } from "react";

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  const username = localStorage.getItem("username") || "User";
  const email = "user@example.com"; // static (no DB)

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode ? "#0f172a" : "#f8fafc",
        color: darkMode ? "white" : "#0f172a",
        padding: "60px 20px",
        transition: "0.3s",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "3rem" }}>Settings ⚙️</h1>
          <p style={{ color: darkMode ? "#cbd5e1" : "#64748b" }}>
            Manage your account and preferences
          </p>
        </div>

        {/* PROFILE CARD */}
        <div style={card(darkMode)}>
          <h2>👤 Profile</h2>
          <p><b>Username:</b> {username}</p>
          <p><b>Email:</b> {email}</p>
        </div>

        {/* APPEARANCE */}
        <div style={card(darkMode)}>
          <h2>🎨 Appearance</h2>

          <label style={row}>
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </label>
        </div>

        {/* NOTIFICATIONS */}
        <div style={card(darkMode)}>
          <h2>🔔 Notifications</h2>

          <label style={row}>
            <span>Push Notifications</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          </label>

          <label style={row}>
            <span>Email Updates</span>
            <input
              type="checkbox"
              checked={emailUpdates}
              onChange={() => setEmailUpdates(!emailUpdates)}
            />
          </label>
        </div>

        {/* SECURITY */}
        <div style={card(darkMode)}>
          <h2>🔐 Security</h2>
          <button style={btn}>
            Change Password (UI Only)
          </button>
        </div>

        {/* FOOTER */}
        <p style={{ textAlign: "center", marginTop: "40px", opacity: 0.6 }}>
          SentraChat Settings Panel
        </p>
      </div>
    </div>
  );
}

/* ── Styles ── */
const card = (dark) => ({
  background: dark ? "#1e293b" : "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
});

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "15px",
  alignItems: "center",
};

const btn = {
  marginTop: "10px",
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};

export default Settings;