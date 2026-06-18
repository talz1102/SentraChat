import { useEffect, useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./SentimentChart.css";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Tooltip, Legend
);

/* ─── Colour palette — unchanged ───────────────────── */
const COLORS = {
  positive: "rgba(34,  197, 94,  0.82)",
  neutral:  "rgba(148, 163, 184, 0.82)",
  negative: "rgba(239, 68,  68,  0.82)",
  line:     "rgba(124, 58,  237, 1)",
  lineFill: "rgba(124, 58,  237, 0.10)",
  bar:      "rgba(124, 58,  237, 0.78)",
};

/* ─── Icons ─────────────────────────────────────────── */
const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconMessages = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconSmile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round"/>
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);
const IconMeh = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="8" y1="15" x2="16" y2="15"/>
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round"/>
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);
const IconFrown = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round"/>
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);
const IconScore = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconAlertCircle = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5"/>
  </svg>
);

/* ─── KPI card ──────────────────────────────────────── */
function KpiCard({ icon, value, label, variant, sub }) {
  return (
    <div className={`kpi-card kpi-card--${variant}`}>
      <div className="kpi-card__icon">{icon}</div>
      <div className="kpi-card__value">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="kpi-card__label">{label}</div>
      {sub && <div className="kpi-card__sub">{sub}</div>}
    </div>
  );
}

/* ─── Chart card wrapper ────────────────────────────── */
function ChartCard({ title, description, badge, wide, children }) {
  return (
    <div className={`ac-card${wide ? " ac-card--wide" : ""}`}>
      <div className="ac-card__header">
        <div className="ac-card__header-left">
          <span className="ac-card__title">{title}</span>
          {description && <p className="ac-card__desc">{description}</p>}
        </div>
        {badge && <span className="ac-card__badge">{badge}</span>}
      </div>
      <div className="ac-card__body">{children}</div>
    </div>
  );
}

/* ─── Section heading ───────────────────────────────── */
function SectionHeading({ title, description }) {
  return (
    <div className="analytics-section-heading">
      <h2 className="analytics-section-heading__title">{title}</h2>
      {description && (
        <p className="analytics-section-heading__desc">{description}</p>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */
function SentimentChart() {
  const [data,  setData]  = useState(null);
  const [error, setError] = useState(false);

  /* detect dark mode for chart axis/grid colours */
  const isDark = typeof window !== "undefined"
    && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const textColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  /* ── fetch — logic unchanged ── */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics/")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  /* ── states ── */
  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-state">
          <div className="analytics-state__error-icon">
            <IconAlertCircle />
          </div>
          <p className="analytics-state__error-title">Failed to load analytics</p>
          <p className="analytics-state__error-sub">
            Could not reach the backend. Make sure the server is running on{" "}
            <code>127.0.0.1:8000</code> and try refreshing.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="analytics-page">
        <div className="analytics-state">
          <div className="analytics-state__spinner" />
          <p className="analytics-state__loading-title">Loading analytics…</p>
          <p className="analytics-state__loading-sub">
            Fetching sentiment data from the server
          </p>
        </div>
      </div>
    );
  }

  /* ── destructure — unchanged ── */
  const { sentiment, daily_messages, user_activity, total_users, total_messages } = data;

  const positiveRate = total_messages > 0
    ? Math.round((sentiment.positive / total_messages) * 100)
    : 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  /* ── chart options (dark-mode aware) ── */
  const PIE_OPTIONS = {
    responsive: true,
    cutout: "56%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          borderRadius: 4,
          padding: 20,
          color: textColor,
          font: { size: 12, weight: "500" },
        },
      },
      tooltip: {
        callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} messages` },
      },
    },
  };

  const BAR_OPTIONS = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} messages` } },
    },
    scales: {
      x: {
        grid:   { display: false },
        border: { display: false },
        ticks:  { color: textColor, font: { size: 12 } },
      },
      y: {
        grid:   { color: gridColor },
        border: { display: false, dash: [4, 4] },
        ticks:  { color: textColor, font: { size: 12 }, stepSize: 20 },
        beginAtZero: true,
      },
    },
  };

  const LINE_OPTIONS = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.parsed.y} active users` } },
    },
    scales: {
      x: {
        grid:   { display: false },
        border: { display: false },
        ticks:  { color: textColor, font: { size: 12 } },
      },
      y: {
        grid:   { color: gridColor },
        border: { display: false, dash: [4, 4] },
        ticks:  { color: textColor, font: { size: 12 } },
        beginAtZero: true,
      },
    },
  };

  /* ── chart datasets — logic unchanged, visuals refined ── */
  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [{
      data: [sentiment.positive, sentiment.neutral, sentiment.negative],
      backgroundColor: [COLORS.positive, COLORS.neutral, COLORS.negative],
      borderColor:     ["rgba(34,197,94,1)", "rgba(148,163,184,1)", "rgba(239,68,68,1)"],
      borderWidth: 1.5,
      hoverOffset: 8,
    }],
  };

  const barData = {
    labels: daily_messages.map((d) => d.date),
    datasets: [{
      label: "Daily Messages",
      data:  daily_messages.map((d) => d.count),
      backgroundColor: COLORS.bar,
      borderColor:     COLORS.line,
      borderWidth: 1.5,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const lineData = {
    labels: user_activity.map((d) => d.hour),
    datasets: [{
      label: "Active Users",
      data:  user_activity.map((d) => d.active),
      borderColor:          COLORS.line,
      backgroundColor:      COLORS.lineFill,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBackgroundColor: COLORS.line,
      pointBorderColor:     isDark ? "#18181b" : "#ffffff",
      pointBorderWidth: 2,
      borderWidth: 2.5,
    }],
  };

  /* ── render ── */
  return (
    <div className="analytics-page">

      {/* ── Page header ── */}
      <div className="analytics-header">
        <div className="analytics-header__left">
          <h1 className="analytics-header__title">Analytics</h1>
          <p className="analytics-header__sub">
            Real-time sentiment trends and platform activity
          </p>
        </div>
        <div className="analytics-header__right">
          <span className="analytics-header__date">{today}</span>
          <span className="analytics-header__live">
            <span className="analytics-header__live-dot" />
            Live
          </span>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="analytics-kpis">
        <KpiCard
          icon={<IconUsers />}    variant="violet"
          value={total_users}     label="Total Users"
          sub="Platform members"
        />
        <KpiCard
          icon={<IconMessages />} variant="blue"
          value={total_messages}  label="Total Messages"
          sub="All time"
        />
        <KpiCard
          icon={<IconSmile />}    variant="green"
          value={sentiment.positive} label="Positive"
          sub={`${Math.round((sentiment.positive / total_messages) * 100)}% of messages`}
        />
        <KpiCard
          icon={<IconMeh />}      variant="gray"
          value={sentiment.neutral}  label="Neutral"
          sub={`${Math.round((sentiment.neutral / total_messages) * 100)}% of messages`}
        />
        <KpiCard
          icon={<IconFrown />}    variant="red"
          value={sentiment.negative} label="Negative"
          sub={`${Math.round((sentiment.negative / total_messages) * 100)}% of messages`}
        />
        <KpiCard
          icon={<IconScore />}    variant="teal"
          value={`${positiveRate}%`} label="Positive Rate"
          sub="Sentiment health score"
        />
      </div>

      {/* ── Section: Sentiment Analysis ── */}
      <SectionHeading
        title="Sentiment Analysis"
        description="Breakdown of message sentiment and daily message volume over the current period"
      />

      <div className="analytics-charts-row">
        <ChartCard
          title="Sentiment Distribution"
          description="Share of positive, neutral and negative messages"
          badge="Donut"
        >
          <div className="ac-chart-wrap ac-chart-wrap--donut">
            <Pie data={pieData} options={PIE_OPTIONS} />
          </div>
        </ChartCard>

        <ChartCard
          title="Daily Message Volume"
          description="Number of messages sent per day"
          badge="Bar"
        >
          <div className="ac-chart-wrap">
            <Bar data={barData} options={BAR_OPTIONS} />
          </div>
        </ChartCard>
      </div>

      {/* ── Section: User Activity ── */}
      <SectionHeading
        title="User Activity"
        description="Active users across each hour of the day — identify peak engagement windows"
      />

      <ChartCard
        title="Hourly Activity"
        description="Number of active users per hour"
        badge="Line"
        wide
      >
        <div className="ac-chart-wrap">
          <Line data={lineData} options={LINE_OPTIONS} />
        </div>
      </ChartCard>

    </div>
  );
}

export default SentimentChart;
