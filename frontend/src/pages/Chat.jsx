import { useEffect, useRef, useState } from "react";
import { LuMessageCircle } from "react-icons/lu";
import "./Chat.css";

const WS_BASE = "ws://127.0.0.1:8000/ws/chat";

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SENTIMENT = {
  positive: { label: "Positive", icon: "✦", cls: "badge--positive" },
  neutral: { label: "Neutral", icon: "◆", cls: "badge--neutral" },
  negative: { label: "Negative", icon: "▼", cls: "badge--negative" },
};

const SUGGESTIONS = [
  "Hello! How are you?",
  "What can you help me with?",
  "Tell me something interesting",
  "How does sentiment analysis work?",
];

/* ─── Icons ─────────────────────────────────────────────── */
const BotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <line x1="12" y1="7" x2="12" y2="11" />
    <circle cx="8.5"  cy="15.5" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none" />
  </svg>
);

function Chat() {
  const wsRef = useRef(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("connecting");
  const [isTyping, setIsTyping] = useState(false);

  const username = localStorage.getItem("username") || "You";
  const token = localStorage.getItem("token");

  // WebSocket — connection/auth/message-protocol logic untouched
  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`${WS_BASE}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setStatus("online");

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: data.message,
          user: data.user,
          self: data.user === username,
          time: new Date(),
          sentiment: data.sentiment?.toLowerCase() || "neutral",
        },
      ]);
    };

    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("error");

    return () => ws.close();
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || wsRef.current?.readyState !== 1) return;

    wsRef.current.send(trimmed);
    setIsTyping(true);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="chat-shell">

      {/* ── Discord-style sidebar ── */}
      <aside className="chat-sidebar">
        <div className="chat-sidebar__brand">
          <span className="chat-sidebar__brand-mark"><LuMessageCircle /></span>
          <span className="chat-sidebar__brand-name">SentraChat</span>
        </div>

        <div className="chat-sidebar__section-label">Direct Messages</div>

        <button type="button" className="chat-sidebar__conversation chat-sidebar__conversation--active">
          <span className="chat-sidebar__convo-avatar">
            <BotIcon />
            {status === "online" && <span className="chat-sidebar__convo-dot" />}
          </span>
          <span className="chat-sidebar__convo-meta">
            <span className="chat-sidebar__convo-name">SentraChat AI</span>
            <span className="chat-sidebar__convo-sub">
              {status === "online" ? "Online" : status === "connecting" ? "Connecting…" : "Offline"}
            </span>
          </span>
        </button>

        <div className="chat-sidebar__spacer" />

        <div className="chat-sidebar__user">
          <span className="chat-sidebar__user-avatar">{username.charAt(0).toUpperCase()}</span>
          <span className="chat-sidebar__user-name">{username}</span>
        </div>
      </aside>

      <div className="chat-page">

      {/* ── Status banners ── */}
      {status === "connecting" && (
        <div className="chat-banner chat-banner--warning">
          <span className="chat-banner__pulse" />
          Connecting to server…
        </div>
      )}
      {(status === "error" || status === "disconnected") && (
        <div className="chat-banner chat-banner--error">
          <span className="chat-banner__dot" />
          Connection lost — make sure the backend is running.
        </div>
      )}

      {/* ── Header ── */}
      <header className="chat-header">
        <div className="chat-header__avatar">
          <BotIcon />
        </div>
        <div className="chat-header__info">
          <span className="chat-header__name">SentraChat AI</span>
          <span className={`chat-header__status${status === "online" ? " chat-header__status--online" : ""}`}>
            {status === "online"
              ? "Online · Sentiment-aware"
              : status === "connecting"
              ? "Connecting…"
              : "Offline"}
          </span>
        </div>
        <span className="chat-header__pill">AI</span>
      </header>

      {/* ── Messages ── */}
      <div className="chat-messages">

        {messages.length === 0 ? (
          <div className="chat-empty">
            <div className="chat-empty__blob" />
            <div className="chat-empty__icon"><BotIcon /></div>
            <h3 className="chat-empty__title">How can I help you today?</h3>
            <p className="chat-empty__sub">
              Send a message — sentiment is analysed in real time.
            </p>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chat-suggestion" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const badge = SENTIMENT[msg.sentiment] ?? SENTIMENT.neutral;
            return (
              <div key={msg.id} className={`msg-row${msg.self ? " msg-row--self" : ""}`}>

                <div className={`msg-avatar${msg.self ? " msg-avatar--self" : ""}`}>
                  {msg.self ? username.charAt(0).toUpperCase() : <BotIcon />}
                </div>

                <div className="msg-body">
                  {!msg.self && <span className="msg-sender">SentraChat AI</span>}

                  <div className={`msg-bubble${msg.self ? " msg-bubble--self" : " msg-bubble--bot"}`}>
                    {msg.text}
                  </div>

                  <div className={`msg-meta${msg.self ? " msg-meta--self" : ""}`}>
                    <span className="msg-time">{formatTime(msg.time)}</span>
                    <span className={`msg-badge ${badge.cls}`}>
                      {badge.icon}&nbsp;{badge.label}
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        )}

        {/* ── Typing indicator ── */}
        {isTyping && (
          <div className="msg-row">
            <div className="msg-avatar"><BotIcon /></div>
            <div className="msg-body">
              <span className="msg-sender">SentraChat AI</span>
              <div className="msg-bubble msg-bubble--bot msg-bubble--typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="chat-inputbar">
        <div className="chat-inputbar__card">
          <textarea
            ref={textareaRef}
            className="chat-inputbar__textarea"
            rows={1}
            placeholder="Message SentraChat AI…"
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            className="chat-inputbar__send"
            onClick={() => sendMessage()}
            disabled={!input.trim() || status !== "online"}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
        <p className="chat-inputbar__hint">
          Enter to send &middot; Shift + Enter for new line
        </p>
      </div>

      </div>
    </div>
  );
}

export default Chat;
