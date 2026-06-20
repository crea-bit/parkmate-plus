import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Notifications = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    try {
      const response = await api.get(`/notifications/user/${user.id}`);
      setNotifications(response.data);
    } catch (error) {
      alert("Failed to load notifications");
      console.log(error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <h1 style={styles.title}>Notifications</h1>
        <p style={styles.subtitle}>
          View updates about your parking requests.
        </p>

        <div style={styles.grid}>
          {notifications.length === 0 && (
            <div style={styles.empty}>No notifications found.</div>
          )}

          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                ...styles.card,
                border: notification.readStatus
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,194,255,0.45)",
              }}
            >
              <h3>{notification.readStatus ? "📩" : "🔔"} Notification</h3>

              <p>{notification.message}</p>

              <small style={styles.time}>
                {notification.createdAt}
              </small>

              {!notification.readStatus && (
                <button
                  style={styles.button}
                  onClick={() => markAsRead(notification.id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f1720",
    color: "white",
    padding: "40px",
  },
  title: {
    fontSize: "40px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#9db4cc",
    marginBottom: "25px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#1f2937",
    padding: "22px",
    borderRadius: "16px",
  },
  time: {
    color: "#9db4cc",
    display: "block",
    marginBottom: "15px",
  },
  button: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#00c2ff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  empty: {
    background: "#1f2937",
    padding: "30px",
    borderRadius: "16px",
    color: "#9db4cc",
  },
};

export default Notifications;