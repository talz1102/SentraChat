import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

/* ── Icons ── */
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IconAnalytics = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconAdmin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const BASE_NAV = [
  { to: "/chat",      label: "Chat",      Icon: IconChat      },
  { to: "/analytics", label: "Analytics", Icon: IconAnalytics },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isAdmin  = localStorage.getItem("is_admin") === "true";
  const username = localStorage.getItem("username") || "User";

  const navItems = isAdmin
    ? [...BASE_NAV, { to: "/admin", label: "Admin", Icon: IconAdmin }]
    : BASE_NAV;

  /* close mobile menu on route change */
  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location.pathname]);

  /* close dropdown on outside click */
  useEffect(() => {
    const handle = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <>
      <header className={`navbar${menuOpen ? " navbar--menu-open" : ""}`}>
        <div className="navbar__inner">

          {/* ── Brand ── */}
          <NavLink to="/chat" className="navbar__brand" aria-label="SentraChat home">
            <span className="navbar__brand-mark">SC</span>
            <span className="navbar__brand-name">SentraChat</span>
          </NavLink>

          {/* ── Desktop nav ── */}
          <nav className="navbar__nav" aria-label="Main">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `navbar__link${isActive ? " active" : ""}`}
              >
                <span className="navbar__link-icon"><Icon /></span>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right: profile + hamburger ── */}
          <div className="navbar__right">

            {/* Profile dropdown */}
            <div className="navbar__profile" ref={profileRef}>
              <button
                className={`navbar__profile-btn${profileOpen ? " open" : ""}`}
                onClick={() => setProfileOpen((v) => !v)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <span className="navbar__avatar">
                  {username.charAt(0).toUpperCase()}
                </span>
                <span className="navbar__profile-name">{username}</span>
                <span className="navbar__profile-chevron"><IconChevron /></span>
              </button>

              {profileOpen && (
                <div className="navbar__dropdown" role="menu">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-username">{username}</p>
                    <p className="navbar__dropdown-role">
                      {isAdmin ? "Administrator" : "Member"}
                    </p>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <IconLogout /> Log out
                  </button>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="navbar__hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu (slides down inside the header) ── */}
        <div
          className={`navbar__mobile${menuOpen ? " navbar__mobile--open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <nav className="navbar__mobile-nav">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `navbar__mobile-link${isActive ? " active" : ""}`
                }
              >
                <span className="navbar__link-icon"><Icon /></span>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__mobile-footer">
            <div className="navbar__mobile-user">
              <span className="navbar__avatar">{username.charAt(0).toUpperCase()}</span>
              <div>
                <p className="navbar__dropdown-username">{username}</p>
                <p className="navbar__dropdown-role">
                  {isAdmin ? "Administrator" : "Member"}
                </p>
              </div>
            </div>
            <button className="navbar__mobile-logout" onClick={handleLogout}>
              <IconLogout /> Log out
            </button>
          </div>
        </div>
      </header>

      {/* Overlay to close mobile menu */}
      {menuOpen && (
        <div
          className="navbar__overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Navbar;
