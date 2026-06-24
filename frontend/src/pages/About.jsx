import {
  LuShieldCheck,
  LuBot,
  LuChartBar,
  LuLayoutDashboard,
  LuChartPie,
  LuWorkflow,
  LuMic,
  LuLanguages,
  LuImage,
  LuSmartphone,
  LuSparkles,
} from "react-icons/lu";
import "./About.css";

const CORE_MODULES = [
  { Icon: LuShieldCheck, title: "User Authentication", desc: "Secure login & registration system" },
  { Icon: LuBot, title: "AI Chat System", desc: "Smart responses using AI integration" },
  { Icon: LuChartBar, title: "Sentiment Analysis", desc: "Emotion detection from messages" },
  { Icon: LuLayoutDashboard, title: "Admin Dashboard", desc: "Manage and monitor users & activity" },
  { Icon: LuChartPie, title: "Analytics System", desc: "Visual charts using Chart.js" },
];

const TECH_STACK = ["React.js", "FastAPI", "MySQL", "JWT Auth", "Chart.js", "OpenAI API"];

const WORKFLOW_STEPS = [
  "User registers and logs in securely",
  "User sends a message in chat",
  "AI generates a response",
  "Sentiment analysis processes message emotions",
  "Data is visualized in analytics dashboard",
  "Admin monitors system activity",
];

const FUTURE_ENHANCEMENTS = [
  { Icon: LuMic, text: "Voice-based AI chat" },
  { Icon: LuLanguages, text: "Multilingual support" },
  { Icon: LuImage, text: "File & image analysis" },
  { Icon: LuSmartphone, text: "Mobile application version" },
  { Icon: LuSparkles, text: "Advanced AI model switching" },
];

function About() {
  return (
    <div className="about-page">
      <div className="about-container">

        {/* ── Title ── */}
        <div className="about-hero">
          <h1 className="about-hero__title">About SentraChat</h1>
          <p className="about-hero__desc">
            SentraChat is an AI-powered communication system designed to
            improve conversations using intelligent chat, real-time messaging,
            and sentiment analysis.
          </p>
        </div>

        {/* ── System Overview ── */}
        <section className="about-overview">
          <div className="about-overview__icon">
            <LuWorkflow />
          </div>
          <div>
            <h2 className="about-section__title">System Overview</h2>
            <p className="about-section__text">
              This project is built as a full-stack AI communication platform.
              Users can chat with an AI assistant, while the system analyzes
              emotional tone (positive, negative, neutral) using sentiment analysis.
              Admin users can monitor system activity and analytics.
            </p>
          </div>
        </section>

        {/* ── Core Modules ── */}
        <section className="about-block">
          <h2 className="about-section__title">Core Modules</h2>
          <div className="about-modules-grid">
            {CORE_MODULES.map(({ Icon, title, desc }) => (
              <div key={title} className="about-module-card">
                <div className="about-module-card__icon">
                  <Icon />
                </div>
                <h3 className="about-module-card__title">{title}</h3>
                <p className="about-module-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Technology Stack ── */}
        <section className="about-block">
          <h2 className="about-section__title">Technology Stack</h2>
          <div className="about-chips">
            {TECH_STACK.map((tech) => (
              <span key={tech} className="about-chip">{tech}</span>
            ))}
          </div>
        </section>

        {/* ── Workflow ── */}
        <section className="about-block">
          <h2 className="about-section__title">System Workflow</h2>
          <ol className="about-timeline">
            {WORKFLOW_STEPS.map((step, i) => (
              <li key={step} className="about-timeline__item">
                <span className="about-timeline__index">{i + 1}</span>
                <span className="about-timeline__text">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Future Enhancements ── */}
        <section className="about-block">
          <h2 className="about-section__title">Future Enhancements</h2>
          <div className="about-future-grid">
            {FUTURE_ENHANCEMENTS.map(({ Icon, text }) => (
              <div key={text} className="about-future-card">
                <span className="about-future-card__icon"><Icon /></span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default About;
