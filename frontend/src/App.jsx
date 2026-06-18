import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import SentimentChart from "./pages/SentimentChart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/analytics" element={<SentimentChart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;