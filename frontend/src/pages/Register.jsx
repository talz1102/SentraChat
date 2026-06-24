import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuMessageCircle } from "react-icons/lu";
import "./Login.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Register data:", formData);
      // TODO: replace with real API call
      // await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed. Please try again.");
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
              <span className="auth-brand-panel__logo-mark"><LuMessageCircle /></span>
              <span className="auth-brand-panel__logo-text">SentraChat</span>
            </div>
            <h2 className="auth-brand-panel__title">Join the next generation of AI chat</h2>
            <p className="auth-brand-panel__desc">
              Create your account and start chatting with sentiment-aware AI in seconds.
            </p>
          </div>
        </aside>

        <div className="auth-form-panel">
          <div className="auth-card">
            <div className="auth-card__logo">
              <span className="auth-card__logo-mark">SC</span>
              <span className="auth-card__logo-text">SentraChat</span>
            </div>
            <h2 className="auth-card__title">Create an account</h2>
            <p className="auth-card__subtitle">Join SentraChat and start chatting</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

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
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>

            <p className="auth-card__footer">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
