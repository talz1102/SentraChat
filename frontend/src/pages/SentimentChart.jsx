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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

function SentimentChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/analytics/")
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.log("API error:", err));
  }, []);

  if (!data) {
    return <h2 style={{ padding: "20px" }}>Loading analytics...</h2>;
  }

  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          data.sentiment.positive,
          data.sentiment.neutral,
          data.sentiment.negative,
        ],
      },
    ],
  };

  const barData = {
    labels: data.daily_messages.map((d) => d.date),
    datasets: [
      {
        label: "Daily Messages",
        data: data.daily_messages.map((d) => d.count),
      },
    ],
  };

  const lineData = {
    labels: data.user_activity.map((d) => d.hour),
    datasets: [
      {
        label: "User Activity",
        data: data.user_activity.map((d) => d.active),
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>SentraChat Analytics</h1>

      <h3>Total Users: {data.total_users}</h3>
      <h3>Total Messages: {data.total_messages}</h3>

      <div style={{ width: "400px" }}>
        <Pie data={pieData} />
      </div>

      <div style={{ width: "600px", marginTop: "20px" }}>
        <Bar data={barData} />
      </div>

      <div style={{ width: "600px", marginTop: "20px" }}>
        <Line data={lineData} />
      </div>
    </div>
  );
}

export default SentimentChart;