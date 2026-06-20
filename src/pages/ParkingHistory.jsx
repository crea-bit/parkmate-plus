import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const ParkingHistory = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);

  const loadHistory = async () => {
    try {
      const response = await api.get(`/bookings/details/user/${user.id}`);
      setBookings(response.data);
    } catch (error) {
      alert("Failed to load parking history");
      console.log(error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const active = bookings.filter((b) => b.status !== "COMPLETED");

  const renderBookingCard = (booking) => (
    <div key={booking.id} style={styles.card}>
      <div style={styles.cardHeader}>
        <h3>Booking #{booking.id}</h3>
        <span style={styles.badge}>{booking.status}</span>
      </div>

      <p>
        <b>Vehicle:</b>{" "}
        {booking.vehicleNumber || "Not Available"}
        {booking.vehicleType ? ` · ${booking.vehicleType}` : ""}
      </p>

      <p>
        <b>Assistant:</b>{" "}
        {booking.assistantName || "Not Assigned"}
      </p>

      <p>
        <b>Pickup:</b> {booking.pickupLocation}
      </p>

      <p>
        <b>Parking:</b> {booking.parkingLocation}
      </p>

      {booking.otp && (
        <p>
          <b>OTP:</b> {booking.otp}
        </p>
      )}
    </div>
  );

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <h1 style={styles.title}>Parking History</h1>
        <p style={styles.subtitle}>
          View your active and completed parking requests.
        </p>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h2>{bookings.length}</h2>
            <p>Total Bookings</p>
          </div>

          <div style={styles.statCard}>
            <h2>{active.length}</h2>
            <p>Active Bookings</p>
          </div>

          <div style={styles.statCard}>
            <h2>{completed.length}</h2>
            <p>Completed Bookings</p>
          </div>
        </div>

        <h2>Active Bookings</h2>

        <div style={styles.grid}>
          {active.length === 0 && (
            <div style={styles.emptyBox}>No active bookings.</div>
          )}

          {active.map(renderBookingCard)}
        </div>

        <h2 style={{ marginTop: "35px" }}>Completed Bookings</h2>

        <div style={styles.grid}>
          {completed.length === 0 && (
            <div style={styles.emptyBox}>No completed bookings.</div>
          )}

          {completed.map(renderBookingCard)}
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

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "35px",
  },

  statCard: {
    background: "#1f2937",
    padding: "25px",
    borderRadius: "16px",
    border: "1px solid rgba(0,194,255,0.2)",
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
    border: "1px solid rgba(255,255,255,0.08)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },

  badge: {
    background: "rgba(0,194,255,0.16)",
    color: "#00c2ff",
    border: "1px solid rgba(0,194,255,0.45)",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  emptyBox: {
    background: "#1f2937",
    padding: "22px",
    borderRadius: "16px",
    color: "#9db4cc",
    border: "1px solid rgba(255,255,255,0.08)",
  },
};

export default ParkingHistory;