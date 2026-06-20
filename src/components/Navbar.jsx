import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const assistant = JSON.parse(localStorage.getItem("assistant"));

  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = async () => {
    try {
      if (user?.role === "USER") {
        const response = await api.get(`/notifications/user/${user.id}`);
        const unread = response.data.filter((n) => !n.readStatus).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoBox}>
        <div style={styles.logoIcon}>P</div>
        <h2 style={styles.logo}>
          Park <span style={styles.blue}>Mate</span> Plus
        </h2>
      </div>

      <div style={styles.links}>
        {user?.role === "USER" && (
          <>
            <Link style={styles.link} to="/dashboard/user">Dashboard</Link>
            <Link style={styles.link} to="/vehicles/add">Add Vehicle</Link>
            <Link style={styles.link} to="/bookings/create">Create Booking</Link>
            <Link style={styles.link} to="/bookings/track">Track Booking</Link>
            <Link style={styles.link} to="/parking/history">History</Link>
            <Link style={styles.link} to="/ratings/add">Rating</Link>

            <Link style={styles.notificationLink} to="/notifications">
              🔔 Notifications
              {unreadCount > 0 && (
                <span style={styles.badge}>{unreadCount}</span>
              )}
            </Link>
          </>
        )}

        {assistant && (
          <Link style={styles.link} to="/dashboard/assistant">Dashboard</Link>
        )}

        {user?.role === "ADMIN" && (
          <Link style={styles.link} to="/dashboard/admin">Dashboard</Link>
        )}

        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: "#111827",
    color: "white",
    padding: "14px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "rgba(0,194,255,0.18)",
    color: "#00c2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    border: "1px solid rgba(0,194,255,0.45)",
  },
  logo: {
    margin: 0,
    fontSize: "24px",
  },
  blue: {
    color: "#00c2ff",
  },
  links: {
    display: "flex",
    gap: "22px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  link: {
    color: "#9db4cc",
    textDecoration: "none",
    fontWeight: "bold",
  },
  notificationLink: {
    color: "#9db4cc",
    textDecoration: "none",
    fontWeight: "bold",
    position: "relative",
  },
  badge: {
    background: "#ef4444",
    color: "white",
    borderRadius: "50%",
    padding: "3px 7px",
    fontSize: "12px",
    marginLeft: "6px",
  },
  logout: {
    background: "rgba(239,68,68,0.18)",
    color: "#fca5a5",
    border: "1px solid rgba(239,68,68,0.45)",
    padding: "10px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Navbar;