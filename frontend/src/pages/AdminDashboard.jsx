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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function AdminDashboard() {
  const totalUsers = 25;
  const totalMessages = 180;

  const positive = 90;
  const neutral = 60;
  const negative = 30;

  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [positive, neutral, negative],
      },
    ],
  };

  const barData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        label: "Messages",
        data: [positive, neutral, negative],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <h3>Total Users: {totalUsers}</h3>
      <h3>Total Messages: {totalMessages}</h3>

      <div style={{ width: "400px", marginBottom: "40px" }}>
        <Pie data={pieData} />
      </div>

      <div style={{ width: "600px" }}>
        <Bar data={barData} />
      </div>
    </div>
  );
}

export default AdminDashboard;