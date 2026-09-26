import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/parkmate-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const user = JSON.parse(localStorage.getItem("user"));
  const assistant = JSON.parse(localStorage.getItem("assistant"));

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadUnreadCount = async () => {
    try {
      if (user?.role === "USER") {
        const response = await api.get(
          `/notifications/user/${user.id}`
        );

        const unread = response.data.filter(
          (notification) => !notification.readStatus
        ).length;

        setUnreadCount(unread);
      }
    } catch (error) {
      console.log("Notification count error:", error);
    }
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (user?.role === "USER") {
      return "/dashboard/user";
    }

    if (assistant) {
      return "/dashboard/assistant";
    }

    if (user?.role === "ADMIN") {
      return "/dashboard/admin";
    }

    return "/login";
  };

  return (
    <>
      <nav className="navbar">

        {/* =========================
            BRAND / LOGO
        ========================= */}

        <div className="navbar-left">

          <Link
            to={getDashboardPath()}
            className="navbar-logo"
            onClick={closeMenu}
          >

            <div className="navbar-logo-image-wrapper">
              <img
                src={logo}
                alt="ParkMate Plus"
                className="navbar-logo-image"
              />
            </div>

            <div className="navbar-logo-text">
              Park<span>Mate</span> Plus
            </div>

          </Link>


          {/* =========================
              THEME TOGGLE
          ========================= */}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
          >

            <span className="theme-icon">
              {theme === "dark" ? "☀️" : "🌙"}
            </span>

            <span className="theme-text">
              {theme === "dark" ? "Light" : "Dark"}
            </span>

          </button>

        </div>


        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          aria-label="Toggle navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>


        {/* =========================
            NAVIGATION LINKS
        ========================= */}

        <div
          className={`navbar-links ${
            menuOpen ? "open" : ""
          }`}
        >

          {/* =========================
              USER LINKS
          ========================= */}

          {user?.role === "USER" && (
            <>
              <Link
                className="navbar-link"
                to="/dashboard/user"
                onClick={closeMenu}
              >
                Dashboard
              </Link>

              <Link
                className="navbar-link"
                to="/vehicles/add"
                onClick={closeMenu}
              >
                Add Vehicle
              </Link>

              <Link
                className="navbar-link"
                to="/bookings/create"
                onClick={closeMenu}
              >
                Create Booking
              </Link>

              <Link
                className="navbar-link"
                to="/bookings/track"
                onClick={closeMenu}
              >
                Track Booking
              </Link>

              <Link
                className="navbar-link"
                to="/parking/history"
                onClick={closeMenu}
              >
                History
              </Link>

              <Link
                className="navbar-link"
                to="/ratings/add"
                onClick={closeMenu}
              >
                Rating
              </Link>

              <Link
                className="navbar-link notification-link"
                to="/notifications"
                onClick={closeMenu}
              >
                🔔 Notifications

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}


          {/* =========================
              ASSISTANT LINKS
          ========================= */}

          {assistant && (
            <Link
              className="navbar-link"
              to="/dashboard/assistant"
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          )}


          {/* =========================
              ADMIN LINKS
          ========================= */}

          {user?.role === "ADMIN" && (
            <Link
              className="navbar-link"
              to="/dashboard/admin"
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          )}


          {/* =========================
              LOGOUT
          ========================= */}

          <button
            className="logout-button"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>

        </div>
      </nav>


      {/* =========================
          NAVBAR STYLES
      ========================= */}

      <style>{`

        .navbar {
          width: 100%;
          min-height: 70px;

          padding: 10px 28px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          background: var(--navbar-bg);

          border-bottom: 1px solid var(--border);

          position: sticky;
          top: 0;
          z-index: 1000;

          box-shadow: var(--shadow);

          box-sizing: border-box;
        }


        /* =========================
           LEFT SIDE
        ========================= */

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 14px;

          min-width: 0;
        }


        /* =========================
           BRAND
        ========================= */

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 9px;

          text-decoration: none;

          color: var(--text-primary);

          min-width: 0;
        }


        /* REAL LOGO */

        .navbar-logo-image-wrapper {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          border-radius: 10px;

          overflow: hidden;

          background: rgba(0, 194, 255, 0.10);

          border: 1px solid var(--border-strong);
        }


        .navbar-logo-image {
          width: 100%;
          height: 100%;

          object-fit: contain;

          display: block;
        }


        /* BRAND TEXT */

        .navbar-logo-text {
          font-size: 20px;
          font-weight: 800;

          letter-spacing: -0.4px;

          white-space: nowrap;
        }


        .navbar-logo-text span {
          color: var(--primary);
        }


        /* =========================
           THEME BUTTON
        ========================= */

        .theme-toggle {
          border: 1px solid var(--border-strong);

          background: var(--card-secondary);

          color: var(--text-primary);

          border-radius: 10px;

          padding: 8px 12px;

          display: flex;
          align-items: center;

          gap: 6px;

          font-weight: 700;

          cursor: pointer;

          transition: all 0.2s ease;
        }


        .theme-toggle:hover {
          transform: translateY(-1px);

          border-color: var(--primary);
        }


        .theme-icon {
          font-size: 14px;
        }


        .theme-text {
          line-height: 1;
        }


        /* =========================
           NAVIGATION
        ========================= */

        .navbar-links {
          display: flex;
          align-items: center;

          gap: 18px;
        }


        .navbar-link {
          color: var(--text-secondary);

          text-decoration: none;

          font-size: 14px;

          font-weight: 700;

          white-space: nowrap;

          transition: color 0.2s ease;
        }


        .navbar-link:hover {
          color: var(--primary);
        }


        /* =========================
           NOTIFICATIONS
        ========================= */

        .notification-link {
          position: relative;

          display: inline-flex;
          align-items: center;
        }


        .notification-badge {
          display: inline-flex;

          min-width: 20px;
          height: 20px;

          align-items: center;
          justify-content: center;

          margin-left: 5px;

          padding: 0 5px;

          border-radius: 999px;

          background: #ef4444;

          color: white;

          font-size: 11px;

          font-weight: 800;
        }


        /* =========================
           LOGOUT
        ========================= */

        .logout-button {
          border: 1px solid rgba(239, 68, 68, 0.35);

          background: rgba(239, 68, 68, 0.08);

          color: #ef4444;

          padding: 9px 15px;

          border-radius: 9px;

          font-weight: 800;

          cursor: pointer;

          transition: all 0.2s ease;
        }


        .logout-button:hover {
          background: rgba(239, 68, 68, 0.15);

          transform: translateY(-1px);
        }


        /* =========================
           MOBILE MENU
        ========================= */

        .mobile-menu-button {
          display: none;

          border: 1px solid var(--border);

          background: var(--card-secondary);

          color: var(--text-primary);

          width: 42px;
          height: 42px;

          border-radius: 10px;

          font-size: 20px;

          cursor: pointer;
        }


        /* =========================
           TABLET
        ========================= */

        @media (max-width: 1100px) {

          .navbar {
            padding: 10px 18px;
          }

          .navbar-links {
            gap: 12px;
          }

          .navbar-link {
            font-size: 13px;
          }

        }


        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 850px) {

          .navbar {
            min-height: 64px;

            padding: 9px 14px;

            flex-wrap: wrap;
          }


          .navbar-left {
            flex: 1;

            min-width: 0;
          }


          .navbar-logo-image-wrapper {
            width: 36px;
            height: 36px;
          }


          .navbar-logo-text {
            font-size: 18px;
          }


          .mobile-menu-button {
            display: flex;

            align-items: center;
            justify-content: center;

            flex-shrink: 0;
          }


          .navbar-links {
            position: absolute;

            top: 64px;

            left: 0;
            right: 0;

            display: none;

            flex-direction: column;

            align-items: stretch;

            gap: 5px;

            padding: 14px;

            background: var(--navbar-bg);

            border-bottom: 1px solid var(--border);

            box-shadow: var(--shadow);

            box-sizing: border-box;
          }


          .navbar-links.open {
            display: flex;
          }


          .navbar-link {
            padding: 12px 14px;

            border-radius: 9px;

            background: var(--card-secondary);

            width: 100%;

            box-sizing: border-box;
          }


          .notification-link {
            justify-content: flex-start;
          }


          .notification-badge {
            margin-left: auto;
          }


          .logout-button {
            width: 100%;

            margin-top: 4px;

            text-align: left;

            padding: 12px 14px;
          }

        }


        /* =========================
           SMALL MOBILE
        ========================= */

        @media (max-width: 500px) {

          .navbar {
            padding: 8px 12px;
          }


          .navbar-logo-image-wrapper {
            width: 34px;
            height: 34px;
          }


          .navbar-logo-text {
            font-size: 17px;
          }


          .theme-toggle {
            padding: 7px 9px;
          }


          .theme-text {
            display: none;
          }

        }

      `}</style>
    </>
  );
};

export default Navbar;