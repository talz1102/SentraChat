import "./Features.css";

const FEATURES = [
  {
    icon: "🤖",
    title: "AI Chat Assistant",
    desc: "Interact with an intelligent AI that responds in real-time with context-aware answers."
  },
  {
    icon: "💬",
    title: "Real-Time Messaging",
    desc: "Instant communication system with fast and smooth chat experience."
  },
  {
    icon: "📊",
    title: "Sentiment Analysis",
    desc: "Automatically detects emotions in messages: Positive, Neutral, or Negative."
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    desc: "User login and registration secured using JWT authentication."
  },
  {
    icon: "📈",
    title: "Analytics Dashboard",
    desc: "Visual charts showing sentiment trends and user interaction data."
  },
  {
    icon: "⚙️",
    title: "Admin Control Panel",
    desc: "Admin can monitor users, system activity, and manage platform data."
  }
];

function Features() {
  return (
    <div className="features-page">
      <div className="features-container">

        {/* Header */}
        <div className="features-header">
          <h1 className="features-header__title">Features</h1>
          <p className="features-header__sub">
            Explore the core capabilities of SentraChat AI platform
          </p>
        </div>

        {/* Feature Grid */}
        <div className="features-grid">
          {FEATURES.map((item, index) => (
            <div key={index} className="feature-card">
              <div className="feature-card__inner">
                <div className="feature-card__icon">{item.icon}</div>
                <h3 className="feature-card__title">{item.title}</h3>
                <p className="feature-card__desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="features-footer">
          <h2 className="features-footer__title">
            Built with React + FastAPI + AI
          </h2>
          <p className="features-footer__sub">
            A full-stack intelligent communication system
          </p>
        </div>

      </div>
    </div>
  );
}

export default Features;
