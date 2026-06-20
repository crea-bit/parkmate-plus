import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const AssistantDashboard = () => {
  const assistant = JSON.parse(localStorage.getItem("assistant"));

  const [requests, setRequests] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const loadRequests = async () => {
    try {
      const response = await api.get("/bookings/details/available");
      setRequests(response.data);
    } catch (error) {
      alert("Failed to load available requests");
      console.log(error);
    }
  };

  const loadMyBookings = async () => {
    try {
      const response = await api.get(
        `/bookings/details/assistant/${assistant.id}`
      );
      setMyBookings(response.data);

      const ratingResponse = await api.get(
        `/ratings/assistant/${assistant.id}/average`
      );
      setAverageRating(ratingResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/assign/${assistant.id}`);
      alert("Booking accepted successfully");
      loadRequests();
      loadMyBookings();
    } catch (error) {
      alert("Failed to accept booking");
      console.log(error);
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status/${status}`);
      alert("Status updated to " + status);
      loadMyBookings();
      loadRequests();
    } catch (error) {
      alert("Failed to update status");
      console.log(error);
    }
  };

  useEffect(() => {
    loadRequests();
    loadMyBookings();
  }, []);

  const initials = assistant?.name
    ? assistant.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  const activeBookings = myBookings.filter(
    (booking) => booking.status !== "COMPLETED"
  ).length;

  const completedBookings = myBookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  const getStatusStyle = (status) => {
    if (status === "COMPLETED") return styles.completed;
    if (status === "PARKED") return styles.parked;
    if (status === "REQUESTED") return styles.requested;
    if (status === "ASSIGNED") return styles.assigned;
    if (status === "PICKED_UP") return styles.active;
    if (status === "RETURNING") return styles.returning;
    if (status === "RETURN_REQUESTED") return styles.returnRequested;
    return styles.defaultStatus;
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Assistant <span style={styles.highlight}>Dashboard</span>
            </h1>
            <p style={styles.subtitle}>
              Manage parking requests, update vehicle status, and complete
              assigned bookings.
            </p>
          </div>

          <div style={styles.profileCard}>
            <div style={styles.avatar}>{initials}</div>

            <div>
              <h2 style={styles.profileName}>
                {assistant?.name || "Assistant"}
              </h2>
              <p style={styles.profileText}>{assistant?.email}</p>
              <span style={styles.roleBadge}>ASSISTANT</span>
            </div>
          </div>
        </div>

        <div style={styles.analyticsGrid}>
          <div style={styles.statCard}>
            <h2>{requests.length}</h2>
            <p>Open Requests</p>
          </div>

          <div style={styles.statCard}>
            <h2>{myBookings.length}</h2>
            <p>Total Assigned</p>
          </div>

          <div style={styles.statCard}>
            <h2>{activeBookings}</h2>
            <p>Active Bookings</p>
          </div>

          <div style={styles.statCard}>
            <h2>{completedBookings}</h2>
            <p>Completed</p>
          </div>

          <div style={styles.statCard}>
            <h2>{Number(averageRating).toFixed(1)}</h2>
            <p>Average Rating</p>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2>Available Parking Requests</h2>
              <span style={styles.countBadge}>{requests.length} open</span>
            </div>

            {requests.length === 0 ? (
              <div style={styles.emptyBox}>
                <div style={styles.emptyIcon}>📭</div>
                <h3>No available requests</h3>
                <p>New parking requests will appear here.</p>
              </div>
            ) : (
              <div style={styles.cardGrid}>
                {requests.map((booking) => (
                  <div key={booking.id} style={styles.bookingCard}>
                    <div style={styles.cardTop}>
                      <h3>Booking #{booking.id}</h3>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(booking.status),
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div style={styles.infoGrid}>
                      <div style={styles.infoBox}>
                        <span>User</span>
                        <strong>{booking.userName || "Unknown User"}</strong>
                      </div>

                      <div style={styles.infoBox}>
                        <span>Vehicle</span>
                        <strong>
                          {booking.vehicleNumber || "Unknown Vehicle"}
                        </strong>
                        <small>{booking.vehicleType}</small>
                      </div>

                      <div style={styles.locationBox}>
                        <span>Pickup</span>
                        <strong>{booking.pickupLocation}</strong>
                      </div>

                      <div style={styles.locationBox}>
                        <span>Parking</span>
                        <strong>{booking.parkingLocation}</strong>
                      </div>
                    </div>

                    <button
                      style={styles.primaryButton}
                      onClick={() => acceptBooking(booking.id)}
                    >
                      ✓ Accept Booking
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2>My Assigned Bookings</h2>
              <span style={styles.countBadge}>{myBookings.length} total</span>
            </div>

            {myBookings.length === 0 ? (
              <div style={styles.emptyBox}>
                <div style={styles.emptyIcon}>📋</div>
                <h3>No assigned bookings</h3>
                <p>Accepted bookings will appear here.</p>
              </div>
            ) : (
              <div style={styles.cardGrid}>
                {myBookings.map((booking) => (
                  <div key={booking.id} style={styles.bookingCard}>
                    <div style={styles.cardTop}>
                      <div>
                        <h3>Booking #{booking.id}</h3>
                        <p style={styles.smallText}>
                          {booking.vehicleNumber || "Unknown Vehicle"}{" "}
                          {booking.vehicleType && `· ${booking.vehicleType}`}
                        </p>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(booking.status),
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div style={styles.otpBox}>
                      <span>OTP</span>
                      <strong>{booking.otp}</strong>
                    </div>

                    <div style={styles.infoGrid}>
                      <div style={styles.infoBox}>
                        <span>User</span>
                        <strong>{booking.userName || "Unknown User"}</strong>
                      </div>

                      <div style={styles.infoBox}>
                        <span>Vehicle</span>
                        <strong>
                          {booking.vehicleNumber || "Unknown Vehicle"}
                        </strong>
                      </div>

                      <div style={styles.locationBox}>
                        <span>Pickup</span>
                        <strong>{booking.pickupLocation}</strong>
                      </div>

                      <div style={styles.locationBox}>
                        <span>Parking</span>
                        <strong>{booking.parkingLocation}</strong>
                      </div>
                    </div>

                    {booking.status === "RETURN_REQUESTED" && (
                      <button
                        style={styles.primaryButton}
                        onClick={() => updateStatus(booking.id, "RETURNING")}
                      >
                        🚗 Start Return
                      </button>
                    )}

                    {booking.status !== "COMPLETED" &&
                      booking.status !== "RETURN_REQUESTED" && (
                        <div style={styles.actionGrid}>
                          <button
                            style={styles.outlineButton}
                            onClick={() =>
                              updateStatus(booking.id, "PICKED_UP")
                            }
                          >
                            🚗 Picked Up
                          </button>

                          <button
                            style={styles.outlineButton}
                            onClick={() => updateStatus(booking.id, "PARKED")}
                          >
                            🅿 Parked
                          </button>

                          <button
                            style={styles.outlineButton}
                            onClick={() =>
                              updateStatus(booking.id, "RETURNING")
                            }
                          >
                            🔄 Returning
                          </button>

                          <button
                            style={styles.successButton}
                            onClick={() =>
                              updateStatus(booking.id, "COMPLETED")
                            }
                          >
                            ✓ Completed
                          </button>
                        </div>
                      )}

                    {booking.status === "RETURNING" && (
                      <button
                        style={{
                          ...styles.successButton,
                          width: "100%",
                          marginTop: "12px",
                        }}
                        onClick={() => updateStatus(booking.id, "COMPLETED")}
                      >
                        ✓ Mark Vehicle Returned
                      </button>
                    )}

                    {booking.status === "COMPLETED" && (
                      <div style={styles.completedBox}>
                        ✅ This booking is completed.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
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

  header: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "24px",
    alignItems: "stretch",
    marginBottom: "28px",
  },

  title: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  highlight: {
    color: "#00c2ff",
  },

  subtitle: {
    color: "#9db4cc",
    fontSize: "17px",
    maxWidth: "700px",
  },

  profileCard: {
    background: "#1f2937",
    border: "1px solid rgba(0,194,255,0.35)",
    borderRadius: "18px",
    padding: "26px",
    display: "flex",
    alignItems: "center",
    gap: "22px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "18px",
    background: "#00c2ff",
    color: "#06111f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },

  profileName: {
    margin: 0,
  },

  profileText: {
    color: "#9db4cc",
    margin: "8px 0",
  },

  roleBadge: {
    background: "rgba(0,194,255,0.16)",
    color: "#00c2ff",
    border: "1px solid rgba(0,194,255,0.45)",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "18px",
    marginBottom: "30px",
  },

  statCard: {
    background: "#1f2937",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    minHeight: "110px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "26px",
    alignItems: "start",
  },

  section: {
    background: "rgba(31,41,55,0.35)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "20px",
    padding: "22px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "18px",
  },

  countBadge: {
    background: "#111827",
    color: "#9db4cc",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "13px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "18px",
  },

  bookingCard: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "18px",
    border: "1px solid rgba(0,194,255,0.16)",
    boxShadow: "0 8px 22px rgba(0,0,0,0.22)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "flex-start",
    marginBottom: "15px",
  },

  smallText: {
    color: "#9db4cc",
    marginTop: "6px",
  },

  statusBadge: {
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },

  completed: {
    background: "rgba(34,197,94,0.18)",
    color: "#22c55e",
    border: "1px solid rgba(34,197,94,0.5)",
  },

  parked: {
    background: "rgba(0,194,255,0.18)",
    color: "#00c2ff",
    border: "1px solid rgba(0,194,255,0.5)",
  },

  requested: {
    background: "rgba(245,158,11,0.18)",
    color: "#f59e0b",
    border: "1px solid rgba(245,158,11,0.5)",
  },

  assigned: {
    background: "rgba(168,85,247,0.18)",
    color: "#a855f7",
    border: "1px solid rgba(168,85,247,0.5)",
  },

  active: {
    background: "rgba(59,130,246,0.18)",
    color: "#60a5fa",
    border: "1px solid rgba(59,130,246,0.5)",
  },

  returning: {
    background: "rgba(245,158,11,0.18)",
    color: "#f59e0b",
    border: "1px solid rgba(245,158,11,0.5)",
  },

  returnRequested: {
    background: "rgba(251,113,133,0.18)",
    color: "#fb7185",
    border: "1px solid rgba(251,113,133,0.5)",
  },

  defaultStatus: {
    background: "rgba(148,163,184,0.18)",
    color: "#cbd5e1",
    border: "1px solid rgba(148,163,184,0.5)",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginBottom: "16px",
  },

  infoBox: {
    background: "#111827",
    padding: "13px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  locationBox: {
    background: "#111827",
    padding: "13px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  otpBox: {
    background: "#111827",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    marginTop: "14px",
  },

  primaryButton: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "none",
    background: "#00c2ff",
    color: "#06111f",
    fontWeight: "bold",
    cursor: "pointer",
  },

  outlineButton: {
    padding: "11px",
    borderRadius: "10px",
    border: "1px solid rgba(0,194,255,0.45)",
    background: "transparent",
    color: "#00c2ff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  successButton: {
    padding: "11px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "#06111f",
    fontWeight: "bold",
    cursor: "pointer",
  },

  completedBox: {
    marginTop: "14px",
    background: "rgba(34,197,94,0.12)",
    color: "#22c55e",
    border: "1px solid rgba(34,197,94,0.35)",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "bold",
  },

  emptyBox: {
    background: "#111827",
    borderRadius: "16px",
    padding: "35px",
    textAlign: "center",
    color: "#9db4cc",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },
};

export default AssistantDashboard;