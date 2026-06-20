import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const loadDashboardData = async () => {
    try {
      const vehicleRes = await api.get(`/vehicles/user/${user.id}`);
      const bookingRes = await api.get(`/bookings/user/${user.id}`);

      setVehicles(vehicleRes.data);
      setBookings(bookingRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const currentlyParked = bookings.filter((b) => b.status === "PARKED").length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.hero}>
          <h1 style={styles.title}>
            Welcome back, <span style={styles.blue}>{user?.name}</span>
          </h1>

          <p style={styles.subtitle}>
            ParkMate Plus helps you request a parking assistant, track your
            vehicle location, and request vehicle return safely.
          </p>
        </div>

        <div style={styles.profileCard}>
          <div style={styles.avatar}>{user?.name?.charAt(0)}</div>

          <div>
            <h2>{user?.name}</h2>
            <p>{user?.email} · {user?.phone}</p>
          </div>

          <span style={styles.badge}>USER</span>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h2>{vehicles.length}</h2>
            <p>Registered Vehicles</p>
          </div>

          <div style={styles.statCard}>
            <h2>{bookings.length}</h2>
            <p>Total Parking Requests</p>
          </div>

          <div style={styles.statCard}>
            <h2>{currentlyParked}</h2>
            <p>Currently Parked</p>
          </div>

          <div style={styles.statCard}>
            <h2>{completedBookings}</h2>
            <p>Completed Requests</p>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>Quick Actions</h2>

        <div style={styles.grid}>
          <Link to="/vehicles/add" style={styles.card}>
            <div style={styles.icon}>🚗</div>
            <h2>Add Vehicle</h2>
            <p>Add your vehicle details before creating a parking request.</p>
          </Link>

          <Link to="/bookings/create" style={styles.card}>
            <div style={styles.icon}>📍</div>
            <h2>Create Booking</h2>
            <p>Request an assistant to pick up and park your vehicle.</p>
          </Link>

          <Link to="/bookings/track" style={styles.card}>
            <div style={styles.icon}>🗺️</div>
            <h2>Track Vehicle</h2>
            <p>Track vehicle location, OTP, and parking status.</p>
          </Link>

          <Link to="/ratings/add" style={styles.card}>
            <div style={styles.icon}>⭐</div>
            <h2>Give Rating</h2>
            <p>Rate the assistant after your booking is completed.</p>
          </Link>

          <Link to="/parking/history" style={styles.card}>
            <div style={styles.icon}>🕘</div>
            <h2>Parking History</h2>
            <p>View your active and completed parking requests.</p>
          </Link>
        </div>

        <h2 style={styles.sectionTitle}>My Vehicles</h2>

        {vehicles.length === 0 ? (
          <div style={styles.emptyBox}>
            No vehicles added yet. Add your first vehicle to start booking.
          </div>
        ) : (
          <div style={styles.vehicleGrid}>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} style={styles.vehicleCard}>
                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.vehicleNumber}
                    style={styles.vehicleImage}
                  />
                ) : (
                  <div style={styles.noImage}>🚗</div>
                )}

                <div style={styles.vehicleContent}>
                  <h3>{vehicle.vehicleNumber}</h3>
                  <p><b>Type:</b> {vehicle.vehicleType}</p>
                  <p><b>Brand:</b> {vehicle.brand}</p>
                  <p><b>Color:</b> {vehicle.color}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <h2>How It Works</h2>
            <p>1. Add your vehicle.</p>
            <p>2. Create a parking request with GPS location.</p>
            <p>3. Assistant accepts and parks your vehicle.</p>
            <p>4. Request return when you need your vehicle back.</p>
          </div>

          <div style={styles.infoCard}>
            <h2>Safety Features</h2>
            <p>OTP verification before pickup.</p>
            <p>Parking location within 1 km to reduce fuel waste.</p>
            <p>GPS-based pickup and parking location.</p>
            <p>Assistant rating and feedback system.</p>
          </div>
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
  hero: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "44px",
    marginBottom: "12px",
    color: "white",
  },
  blue: {
    color: "#00c2ff",
  },
  subtitle: {
    color: "#9db4cc",
    fontSize: "18px",
    maxWidth: "900px",
    lineHeight: "1.6",
  },
  profileCard: {
    background: "#1f2937",
    border: "1px solid rgba(0,194,255,0.35)",
    borderRadius: "18px",
    padding: "26px",
    display: "flex",
    alignItems: "center",
    gap: "22px",
    marginBottom: "28px",
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
    fontSize: "32px",
    fontWeight: "bold",
  },
  badge: {
    marginLeft: "auto",
    background: "rgba(0,194,255,0.16)",
    color: "#00c2ff",
    border: "1px solid rgba(0,194,255,0.45)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "35px",
  },
  statCard: {
    background: "#1f2937",
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid rgba(0,194,255,0.18)",
  },
  sectionTitle: {
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "22px",
    marginBottom: "35px",
  },
  card: {
    minHeight: "180px",
    padding: "26px",
    borderRadius: "18px",
    background: "#1f2937",
    textDecoration: "none",
    color: "white",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  icon: {
    fontSize: "34px",
    marginBottom: "18px",
  },
  vehicleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "22px",
    marginBottom: "35px",
  },
  vehicleCard: {
    background: "#1f2937",
    borderRadius: "18px",
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  vehicleImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
  },
  noImage: {
    height: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "60px",
    background: "#111827",
  },
  vehicleContent: {
    padding: "20px",
  },
  emptyBox: {
    background: "#1f2937",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "35px",
    color: "#9db4cc",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "22px",
  },
  infoCard: {
    background: "#1f2937",
    padding: "26px",
    borderRadius: "18px",
    border: "1px solid rgba(0,194,255,0.18)",
  },
};

export default UserDashboard;