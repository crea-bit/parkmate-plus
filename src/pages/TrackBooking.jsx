import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";

import api from "../services/api";
import Navbar from "../components/Navbar";

const TrackBooking = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const response = await api.get(`/bookings/details/user/${user.id}`);
      setBookings(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const requestReturn = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/request-return`);
      alert("Return Requested");
      loadBookings();
    } catch (error) {
      console.log(error);
      alert("Failed to request return");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

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
            <h1 style={styles.title}>Track Vehicle</h1>
            <p style={styles.subtitle}>
              View your booking status, OTP, vehicle location, and return request.
            </p>
          </div>

          <div style={styles.summaryCard}>
            <h2>{bookings.length}</h2>
            <p>Total Bookings</p>
          </div>
        </div>

        {bookings.length === 0 && (
          <div style={styles.emptyBox}>
            <h2>No Bookings Found</h2>
            <p>Create a parking request to track your vehicle.</p>
          </div>
        )}

        <div style={styles.grid}>
          {bookings.map((booking) => (
            <div key={booking.id} style={styles.bookingCard}>
              <div style={styles.cardTop}>
                <div>
                  <h2 style={styles.bookingTitle}>Booking #{booking.id}</h2>
                  <p style={styles.smallText}>
                    {booking.vehicleNumber || "Unknown Vehicle"}
                    {booking.vehicleType ? ` · ${booking.vehicleType}` : ""}
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

              <div style={styles.infoGrid}>
                <div style={styles.infoBox}>
                  <span>OTP</span>
                  <strong>{booking.otp}</strong>
                </div>

                <div style={styles.infoBox}>
                  <span>Assistant</span>
                  <strong>
                    {booking.assistantName || "Not Assigned"}
                  </strong>
                </div>

                <div style={styles.infoBox}>
                  <span>Vehicle Number</span>
                  <strong>{booking.vehicleNumber || "Not Available"}</strong>
                </div>

                <div style={styles.infoBox}>
                  <span>Vehicle Type</span>
                  <strong>{booking.vehicleType || "Not Available"}</strong>
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

              {booking.pickupLat && booking.parkingLat ? (
                <div style={styles.mapBox}>
                  <MapContainer
                    center={[booking.pickupLat, booking.pickupLng]}
                    zoom={16}
                    style={{
                      height: "280px",
                      width: "100%",
                      borderRadius: "14px",
                    }}
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <Marker position={[booking.pickupLat, booking.pickupLng]} />
                    <Marker position={[booking.parkingLat, booking.parkingLng]} />

                    <Polyline
                      positions={[
                        [booking.pickupLat, booking.pickupLng],
                        [booking.parkingLat, booking.parkingLng],
                      ]}
                    />
                  </MapContainer>

                  <div style={styles.coordinateBox}>
                    <p>
                      📍 Vehicle Location:{" "}
                      {Number(booking.parkingLat).toFixed(5)},{" "}
                      {Number(booking.parkingLng).toFixed(5)}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={styles.noMapBox}>
                  <p>No GPS location available for this booking.</p>
                </div>
              )}

              {booking.status === "RETURN_REQUESTED" && (
                <div style={styles.pendingReturnBox}>
                  ✅ Return request sent. Assistant will bring your vehicle back.
                </div>
              )}

              {booking.status === "RETURNING" && (
                <div style={styles.returningBox}>
                  🚗 Assistant is returning your vehicle.
                </div>
              )}

              {booking.status === "COMPLETED" && (
                <div style={styles.completedBox}>
                  ✅ Booking completed successfully.
                </div>
              )}

              {booking.status !== "RETURN_REQUESTED" &&
                booking.status !== "RETURNING" &&
                booking.status !== "COMPLETED" && (
                  <button
                    style={{
                      ...styles.returnButton,
                      ...(booking.status === "PARKED"
                        ? styles.returnButtonActive
                        : styles.returnButtonDisabled),
                    }}
                    disabled={booking.status !== "PARKED"}
                    onClick={() => requestReturn(booking.id)}
                  >
                    {booking.status === "PARKED"
                      ? "Request Vehicle Return"
                      : "Return Available After Parking"}
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
    padding: "38px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  title: {
    fontSize: "36px",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#9db4cc",
    fontSize: "16px",
  },

  summaryCard: {
    background: "#1f2937",
    border: "1px solid rgba(0,194,255,0.3)",
    borderRadius: "16px",
    padding: "20px 28px",
    textAlign: "center",
    minWidth: "160px",
  },

  emptyBox: {
    background: "#1f2937",
    padding: "30px",
    borderRadius: "16px",
    border: "1px solid rgba(0,194,255,0.2)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(430px, 1fr))",
    gap: "24px",
    alignItems: "start",
  },

  bookingCard: {
    background: "#1f2937",
    borderRadius: "18px",
    padding: "24px",
    border: "1px solid rgba(0,194,255,0.18)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    alignItems: "flex-start",
    marginBottom: "20px",
  },

  bookingTitle: {
    margin: 0,
    fontSize: "26px",
  },

  smallText: {
    color: "#9db4cc",
    marginTop: "6px",
  },

  statusBadge: {
    padding: "8px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "13px",
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
    marginBottom: "18px",
  },

  infoBox: {
    background: "#111827",
    padding: "14px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  locationBox: {
    background: "#111827",
    padding: "14px",
    borderRadius: "12px",
    gridColumn: "span 1",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  mapBox: {
    marginTop: "15px",
  },

  coordinateBox: {
    background: "#111827",
    padding: "12px",
    borderRadius: "12px",
    marginTop: "12px",
    color: "#9db4cc",
  },

  noMapBox: {
    background: "#111827",
    padding: "20px",
    borderRadius: "12px",
    color: "#9db4cc",
    marginTop: "12px",
  },

  returnButton: {
    marginTop: "18px",
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "bold",
    fontSize: "15px",
  },

  returnButtonActive: {
    background: "#00c2ff",
    color: "#07111d",
    cursor: "pointer",
  },

  returnButtonDisabled: {
    background: "#334155",
    color: "#94a3b8",
    cursor: "not-allowed",
  },

  pendingReturnBox: {
    marginTop: "18px",
    background: "rgba(251,113,133,0.14)",
    color: "#fb7185",
    border: "1px solid rgba(251,113,133,0.4)",
    padding: "13px",
    borderRadius: "12px",
    fontWeight: "bold",
  },

  returningBox: {
    marginTop: "18px",
    background: "rgba(245,158,11,0.14)",
    color: "#f59e0b",
    border: "1px solid rgba(245,158,11,0.4)",
    padding: "13px",
    borderRadius: "12px",
    fontWeight: "bold",
  },

  completedBox: {
    marginTop: "18px",
    background: "rgba(34,197,94,0.14)",
    color: "#22c55e",
    border: "1px solid rgba(34,197,94,0.4)",
    padding: "13px",
    borderRadius: "12px",
    fontWeight: "bold",
  },
};

export default TrackBooking;