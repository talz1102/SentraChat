import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import SentimentChart from "./pages/SentimentChart";

const AUTH_ROUTES = ["/login", "/register"];

function AppLayout() {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);

  if (isAuth) {
    return (
      <div className="app-auth">
        <div className="app-auth__main">
          <Routes>
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-shell__main">
        <Routes>
          <Route path="/chat"      element={<Chat />}           />
          <Route path="/admin"     element={<AdminDashboard />} />
          <Route path="/analytics" element={<SentimentChart />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
