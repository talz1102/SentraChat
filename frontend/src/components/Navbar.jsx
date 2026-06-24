import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LuHouse,
  LuMessageCircle,
  LuChartBar,
  LuSparkles,
  LuInfo,
  LuSettings,
  LuShieldCheck,
  LuSearch,
  LuBell,
  LuSun,
  LuMoon,
  LuChevronDown,
  LuMenu,
  LuX,
  LuLogOut,
} from "react-icons/lu";
import "./Navbar.css";

const THEME_KEY = "sentrachat_theme";

/* ── NAV ITEMS ── */
const BASE_NAV = [
  { to: "/", label: "Home", Icon: LuHouse },
  { to: "/chat", label: "Chat", Icon: LuMessageCircle },
  { to: "/analytics", label: "Analytics", Icon: LuChartBar },
  { to: "/features", label: "Features", Icon: LuSparkles },
  { to: "/about", label: "About", Icon: LuInfo },
  { to: "/settings", label: "Settings", Icon: LuSettings },
];

function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme());

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const isAdmin = localStorage.getItem("is_admin") === "true";
  const username = localStorage.getItem("username") || "User";

  const navItems = isAdmin
    ? [...BASE_NAV, { to: "/admin", label: "Admin", Icon: LuShieldCheck }]
    : BASE_NAV;

  /* ── CLOSE ON ROUTE CHANGE ── */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  /* ── OUTSIDE CLICK HANDLER (CLEAN + SAFE) ── */
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ── THEME APPLY ── */
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  /* ── BODY SCROLL LOCK ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">

          {/* ── BRAND ── */}
          <NavLink to="/" className="navbar__brand">
            <span className="navbar__brand-badge">
              <LuMessageCircle />
            </span>
            <span className="navbar__brand-name">SentraChat</span>
          </NavLink>

          {/* ── CENTER NAV ── */}
          <nav className="navbar__nav">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `navbar__link${isActive ? " navbar__link--active" : ""}`
                }
              >
                <Icon className="navbar__link-icon" />
                <span className="navbar__link-label">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* ── RIGHT SIDE ── */}
          <div className="navbar__right">

            {/* SEARCH */}
            <div className="navbar__search">
              <LuSearch className="navbar__search-icon" />
              <input placeholder="Search..." className="navbar__search-input" />
            </div>

            {/* NOTIFICATIONS */}
            <div className="navbar__notif" ref={notifRef}>
              <button
                type="button"
                className="navbar__icon-btn"
                onClick={() => setNotifOpen((v) => !v)}
              >
                <LuBell />
                <span className="navbar__notif-dot" />
              </button>

              {notifOpen && (
                <div className="navbar__notif-dropdown">
                  <div className="navbar__notif-header">
                    <h4>Notifications</h4>
                    <span>3 new</span>
                  </div>

                  <div className="navbar__notif-list">
                    <div className="navbar__notif-item unread">
                      New message received
                    </div>
                    <div className="navbar__notif-item unread">
                      AI analysis completed
                    </div>
                    <div className="navbar__notif-item">
                      System update available
                    </div>
                  </div>

                  <button className="navbar__notif-footer">
                    Mark all as read
                  </button>
                </div>
              )}
            </div>

            {/* THEME */}
            <button className="navbar__icon-btn" onClick={toggleTheme}>
              {theme === "dark" ? <LuSun /> : <LuMoon />}
            </button>

            {/* PROFILE */}
            <div className="navbar__profile" ref={profileRef}>
              <button
                className={`navbar__profile-btn${
                  profileOpen ? " navbar__profile-btn--open" : ""
                }`}
                onClick={() => setProfileOpen((v) => !v)}
              >
                <span className="navbar__avatar">
                  {username.charAt(0).toUpperCase()}
                </span>
                <span className="navbar__profile-name">{username}</span>
                <LuChevronDown />
              </button>

              {profileOpen && (
                <div className="navbar__dropdown">
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    <LuLogOut /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* MOBILE MENU */}
            <button
              className="navbar__hamburger"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <LuX /> : <LuMenu />}
            </button>

          </div>
        </div>
      </header>

      {/* OVERLAY */}
      {menuOpen && (
        <div className="navbar__overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* DRAWER */}
      <div className={`navbar__drawer ${menuOpen ? "navbar__drawer--open" : ""}`}>
        <nav className="navbar__drawer-nav">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="navbar__drawer-link"
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>

        <button className="navbar__drawer-logout" onClick={handleLogout}>
          <LuLogOut /> Logout
        </button>
      </div>
    </>
  );
}

export default Navbar;