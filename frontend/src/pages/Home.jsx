import { Link } from "react-router-dom";
import "./Home.css";

const FEATURES = [
  { icon: "🤖", title: "AI Chat", desc: "Generate intelligent responses instantly." },
  { icon: "📊", title: "Sentiment Analysis", desc: "Analyze emotions and conversation patterns." },
  { icon: "💬", title: "Real-Time Messaging", desc: "Fast and seamless communication experience." },
  { icon: "🔒", title: "Secure Access", desc: "Protected authentication and user management." },
];

function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__blob home-hero__blob--1" aria-hidden="true" />
        <div className="home-hero__blob home-hero__blob--2" aria-hidden="true" />

        <span className="home-hero__eyebrow">AI-Powered Communication Platform</span>

        <h1 className="home-hero__title">SentraChat</h1>

        <p className="home-hero__desc">
          SentraChat combines intelligent AI conversations, sentiment analysis,
          and real-time communication to provide meaningful insights from user
          interactions.
        </p>

        <div className="home-hero__cta">
          <Link to="/register" className="btn btn--primary btn--xl">
            Get Started
          </Link>
          <Link to="/login" className="btn btn--secondary btn--xl">
            Login
          </Link>
        </div>
      </section>

      <section className="home-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="home-feature-card">
            <div className="home-feature-card__icon">{f.icon}</div>
            <h3 className="home-feature-card__title">{f.title}</h3>
            <p className="home-feature-card__desc">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
