import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuMessageCircle } from "react-icons/lu";
import { loginUser } from "../api/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);

      console.log("Login success:", res.data);

      // store user data (IMPORTANT for websocket identity)
      localStorage.setItem("token", res.data.token || "demo-token");
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("email", res.data.user.email);

      navigate("/chat");

    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.detail ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">

        <aside className="auth-brand-panel">
          <div className="auth-brand-panel__blob auth-brand-panel__blob--1" aria-hidden="true" />
          <div className="auth-brand-panel__blob auth-brand-panel__blob--2" aria-hidden="true" />

          <div className="auth-brand-panel__content">
            <div className="auth-brand-panel__logo">
              <span className="auth-brand-panel__logo-mark">
                <LuMessageCircle />
              </span>
              <span className="auth-brand-panel__logo-text">SentraChat</span>
            </div>

            <h2 className="auth-brand-panel__title">
              AI-powered conversations, reimagined
            </h2>

            <p className="auth-brand-panel__desc">
              Real-time, sentiment-aware chat with secure and seamless communication.
            </p>
          </div>
        </aside>

        <div className="auth-form-panel">
          <div className="auth-card">

            <div className="auth-card__logo">
              <span className="auth-card__logo-mark">SC</span>
              <span className="auth-card__logo-text">SentraChat</span>
            </div>

            <h2 className="auth-card__title">Welcome back</h2>
            <p className="auth-card__subtitle">
              Sign in to your account to continue
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>

              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Sign in"}
              </button>

            </form>

            <p className="auth-card__footer">
              Don't have an account?{" "}
              <Link to="/register">Create one</Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;