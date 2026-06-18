import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./AdminDashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

/* ─── Icons ──────────────────────────────────────────── */
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconMessages = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconSmile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round" />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const IconMeh = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="15" x2="16" y2="15" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round" />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const IconFrown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" strokeLinecap="round" />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
const IconTrendUp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconTrendDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

/* ─── Stat card ───────────────────────────────────────── */
function StatCard({ icon, value, label, variant, trend, trendDir }) {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__top">
        <div className="stat-card__icon-wrap">{icon}</div>
        {trend && (
          <span className={`stat-card__trend trend--${trendDir}`}>
            {trendDir === "up"   && <IconTrendUp />}
            {trendDir === "down" && <IconTrendDown />}
            {trend}
          </span>
        )}
      </div>
      <div className="stat-card__value">{typeof value === "number" ? value.toLocaleString() : value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

/* ─── Sentiment progress bar ──────────────────────────── */
function SentimentBar({ label, value, total, variant }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="sbar">
      <div className="sbar__head">
        <span className="sbar__label">{label}</span>
        <span className="sbar__stats">
          <span className="sbar__count">{value.toLocaleString()}</span>
          <span className="sbar__pct">{pct}%</span>
        </span>
      </div>
      <div className="sbar__track">
        <div className={`sbar__fill sbar__fill--${variant}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────── */
function AdminDashboard() {
  /* detect dark mode for chart colors */
  const [isDark] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  /* ── data ── */
  const totalUsers    = 25;
  const totalMessages = 180;
  const positive      = 90;
  const neutral       = 60;
  const negative      = 30;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  /* ── chart theme ── */
  const axisColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const C = {
    positive:     "rgba(34,  197, 94,  0.82)",
    positiveSolid:"rgba(34,  197, 94,  1)",
    neutral:      "rgba(148, 163, 184, 0.82)",
    neutralSolid: "rgba(148, 163, 184, 1)",
    negative:     "rgba(239, 68,  68,  0.82)",
    negativeSolid:"rgba(239, 68,  68,  1)",
  };

  const PIE_OPTIONS = {
    responsive: true,
    cutout: "58%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 10, borderRadius: 4, padding: 20, color: axisColor, font: { size: 12, weight: "500" } },
      },
      tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.parsed} messages` } },
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
        grid:  { display: false },
        border: { display: false },
        ticks: { color: axisColor, font: { size: 12 } },
      },
      y: {
        grid:  { color: gridColor, drawBorder: false },
        border: { display: false, dash: [4, 4] },
        ticks: { color: axisColor, font: { size: 12 }, stepSize: 30 },
        beginAtZero: true,
      },
    },
  };

  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [{
      data: [positive, neutral, negative],
      backgroundColor: [C.positive, C.neutral, C.negative],
      borderColor:     [C.positiveSolid, C.neutralSolid, C.negativeSolid],
      borderWidth: 1.5,
      hoverOffset: 6,
    }],
  };

  const barData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [{
      label: "Messages",
      data:  [positive, neutral, negative],
      backgroundColor: [C.positive, C.neutral, C.negative],
      borderColor:     [C.positiveSolid, C.neutralSolid, C.negativeSolid],
      borderWidth: 1.5,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  return (
    <div className="admin-page">

      {/* ── Page header ── */}
      <div className="admin-header">
        <div className="admin-header__left">
          <h1 className="admin-header__title">Admin Dashboard</h1>
          <p className="admin-header__sub">Platform activity &amp; sentiment analysis overview</p>
        </div>
        <div className="admin-header__right">
          <span className="admin-header__date">{today}</span>
          <span className="admin-header__live">
            <span className="admin-header__live-dot" />
            Live
          </span>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="admin-stats">
        <StatCard
          icon={<IconUsers />}     variant="violet"
          value={totalUsers}       label="Total Users"
          trend="+4 this week"     trendDir="up"
        />
        <StatCard
          icon={<IconMessages />}  variant="blue"
          value={totalMessages}    label="Total Messages"
          trend="+24 today"        trendDir="up"
        />
        <StatCard
          icon={<IconSmile />}     variant="green"
          value={positive}         label="Positive Messages"
          trend={`${Math.round((positive / totalMessages) * 100)}% of total`}
          trendDir="up"
        />
        <StatCard
          icon={<IconMeh />}       variant="gray"
          value={neutral}          label="Neutral Messages"
          trend={`${Math.round((neutral / totalMessages) * 100)}% of total`}
          trendDir="neutral"
        />
        <StatCard
          icon={<IconFrown />}     variant="red"
          value={negative}         label="Negative Messages"
          trend={`${Math.round((negative / totalMessages) * 100)}% of total`}
          trendDir="down"
        />
      </div>

      {/* ── Charts ── */}
      <div className="admin-charts">

        {/* Donut chart */}
        <div className="chart-card">
          <div className="chart-card__header">
            <span className="chart-card__title">Sentiment Distribution</span>
            <span className="chart-card__badge">{totalMessages} total</span>
          </div>
          <div className="chart-card__body chart-card__body--donut">
            <Pie data={pieData} options={PIE_OPTIONS} />
          </div>
        </div>

        {/* Bar chart */}
        <div className="chart-card">
          <div className="chart-card__header">
            <span className="chart-card__title">Messages by Sentiment</span>
            <span className="chart-card__badge">This period</span>
          </div>
          <div className="chart-card__body">
            <Bar data={barData} options={BAR_OPTIONS} />
          </div>
        </div>

      </div>

      {/* ── Sentiment breakdown ── */}
      <div className="breakdown-card">
        <div className="chart-card__header">
          <span className="chart-card__title">Sentiment Breakdown</span>
          <span className="chart-card__badge">{totalMessages} messages analysed</span>
        </div>
        <div className="breakdown-list">
          <SentimentBar label="Positive" value={positive} total={totalMessages} variant="green"  />
          <SentimentBar label="Neutral"  value={neutral}  total={totalMessages} variant="gray"   />
          <SentimentBar label="Negative" value={negative} total={totalMessages} variant="red"    />
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;
