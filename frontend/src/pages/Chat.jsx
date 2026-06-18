import { useEffect, useRef, useState, useCallback } from "react";
import "./Chat.css";

/* ─── WebSocket URL — untouched ─────────────────────────── */
const WS_URL = "ws://127.0.0.1:8000/ws/chat";

/* ─── Helpers ───────────────────────────────────────────── */
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getSentiment(text) {
  const t = text.toLowerCase();
  const pos = /\b(good|great|thanks|thank you|love|awesome|excellent|happy|nice|wonderful|amazing|perfect|yes|sure|cool|fantastic|helpful|glad|enjoy|best|better|correct|success|appreciate|right|pleased|welcome|brilliant)\b/.test(t);
  const neg = /\b(bad|error|fail|failed|wrong|issue|problem|hate|broken|awful|terrible|horrible|annoying|worst|difficult|impossible|sorry|unfortunately|concern|bug|crash|slow|stuck|frustrated|confused|upset|angry|sad)\b/.test(t);
  if (pos && !neg) return "positive";
  if (neg)         return "negative";
  return "neutral";
}

const SENTIMENT = {
  positive: { label: "Positive", icon: "✦", cls: "badge--positive" },
  neutral:  { label: "Neutral",  icon: "◆", cls: "badge--neutral"  },
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

/* ─── Chat component ─────────────────────────────────────── */
function Chat() {
  const [socket,   setSocket]   = useState(null);
  const [status,   setStatus]   = useState("connecting");
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);

  const username = localStorage.getItem("username") || "You";

  /* WebSocket — logic untouched */
  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen    = ()  => setStatus("online");
    ws.onmessage = (e) => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: e.data, self: false, time: new Date(), sentiment: getSentiment(e.data) },
      ]);
    };
    ws.onerror = () => setStatus("error");
    ws.onclose = () => setStatus("error");

    setSocket(ws);
    return () => ws.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback((text = input) => {
    const trimmed = text.trim();
    if (!trimmed || !socket || socket.readyState !== WebSocket.OPEN) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, self: true, time: new Date(), sentiment: getSentiment(trimmed) },
    ]);
    setIsTyping(true);
    socket.send(trimmed);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    textareaRef.current?.focus();
  }, [input, socket]);

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
    <div className="chat-page">

      {/* ── Status banners ── */}
      {status === "connecting" && (
        <div className="chat-banner chat-banner--warning">
          <span className="chat-banner__pulse" />
          Connecting to server…
        </div>
      )}
      {status === "error" && (
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
  );
}

export default Chat;
