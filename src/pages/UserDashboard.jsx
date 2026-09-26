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

  const currentlyParked = bookings.filter(
    (b) => b.status === "PARKED"
  ).length;

  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  return (
    <>
      <Navbar />

      {/* Mobile Responsive CSS */}
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .user-dashboard-page {
            width: 100%;
            overflow-x: hidden;
          }

          .user-profile-card {
            width: 100%;
          }

          .user-stats-grid,
          .user-actions-grid,
          .user-vehicle-grid,
          .user-info-grid {
            width: 100%;
          }

          @media (max-width: 768px) {

            .user-dashboard-page {
              padding: 88px 18px 30px !important;
            }

            .user-dashboard-hero {
              margin-bottom: 24px !important;
            }

            .user-dashboard-title {
              font-size: 32px !important;
              line-height: 1.2 !important;
              letter-spacing: -0.5px !important;
            }

            .user-dashboard-subtitle {
              font-size: 16px !important;
              line-height: 1.6 !important;
            }

            /* PROFILE */
            .user-profile-card {
              padding: 18px !important;
              gap: 14px !important;
              flex-wrap: wrap !important;
              border-radius: 16px !important;
              margin-bottom: 24px !important;
            }

            .user-profile-avatar {
              width: 58px !important;
              height: 58px !important;
              min-width: 58px !important;
              border-radius: 15px !important;
              font-size: 26px !important;
            }

            .user-profile-info {
              flex: 1 !important;
              min-width: 0 !important;
            }

            .user-profile-name {
              font-size: 21px !important;
              line-height: 1.25 !important;
            }

            .user-profile-details {
              font-size: 14px !important;
              line-height: 1.5 !important;
            }

            .user-profile-badge {
              margin-left: auto !important;
              padding: 7px 12px !important;
              font-size: 12px !important;
            }

            /* STATS */
            .user-stats-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 12px !important;
              margin-bottom: 30px !important;
            }

            .user-stat-card {
              padding: 18px !important;
              border-radius: 16px !important;
              min-width: 0 !important;
            }

            .user-stat-number {
              font-size: 26px !important;
            }

            .user-stat-text {
              font-size: 14px !important;
              line-height: 1.4 !important;
            }

            /* SECTION TITLES */
            .user-section-title {
              font-size: 22px !important;
              margin-bottom: 16px !important;
            }

            /* QUICK ACTIONS */
            .user-actions-grid {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
              margin-bottom: 30px !important;
            }

            .user-action-card {
              min-height: auto !important;
              height: auto !important;
              padding: 22px !important;
              border-radius: 18px !important;
            }

            .user-action-icon {
              font-size: 32px !important;
              margin-bottom: 12px !important;
            }

            .user-action-title {
              font-size: 22px !important;
              margin-bottom: 8px !important;
            }

            .user-action-text {
              font-size: 15px !important;
              line-height: 1.55 !important;
            }

            /* VEHICLES */
            .user-vehicle-grid {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
              margin-bottom: 30px !important;
            }

            .user-vehicle-card {
              width: 100% !important;
              min-height: 0 !important;
              height: auto !important;
              border-radius: 18px !important;
            }

            .user-vehicle-image,
            .user-no-image {
              height: 180px !important;
              min-height: 180px !important;
            }

            .user-no-image {
              font-size: 52px !important;
            }

            .user-vehicle-content {
              padding: 18px !important;
            }

            .user-vehicle-number {
              font-size: 20px !important;
            }

            .user-vehicle-details {
              font-size: 14px !important;
            }

            /* EMPTY VEHICLES */
            .user-empty-box {
              padding: 20px !important;
              line-height: 1.6 !important;
            }

            /* INFORMATION */
            .user-info-grid {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
              padding-bottom: 20px !important;
            }

            .user-info-card {
              padding: 20px !important;
              border-radius: 18px !important;
            }

            .user-info-title {
              font-size: 21px !important;
            }

            .user-info-text {
              font-size: 15px !important;
              line-height: 1.6 !important;
            }
          }

          @media (max-width: 420px) {

            .user-dashboard-page {
              padding-left: 14px !important;
              padding-right: 14px !important;
            }

            .user-dashboard-title {
              font-size: 29px !important;
            }

            .user-profile-card {
              align-items: flex-start !important;
            }

            .user-profile-badge {
              width: 100% !important;
              text-align: center !important;
              margin-left: 0 !important;
              margin-top: 4px !important;
            }

            .user-stats-grid {
              grid-template-columns: 1fr 1fr !important;
              gap: 10px !important;
            }

            .user-stat-card {
              padding: 15px !important;
            }

            .user-stat-number {
              font-size: 24px !important;
            }

            .user-stat-text {
              font-size: 13px !important;
            }

            .user-action-card {
              padding: 20px !important;
            }

            .user-action-title {
              font-size: 20px !important;
            }

            .user-action-text {
              font-size: 14px !important;
            }

            .user-vehicle-image,
            .user-no-image {
              height: 160px !important;
              min-height: 160px !important;
            }
          }
        `}
      </style>

      <div className="user-dashboard-page" style={styles.page}>

        {/* HERO */}
        <div
          className="user-dashboard-hero"
          style={styles.hero}
        >
          <h1
            className="user-dashboard-title"
            style={styles.title}
          >
            Welcome back,{" "}
            <span style={styles.blue}>
              {user?.name}
            </span>
          </h1>

          <p
            className="user-dashboard-subtitle"
            style={styles.subtitle}
          >
            ParkMate Plus helps you request a parking assistant,
            track your vehicle location, and request vehicle return safely.
          </p>
        </div>

        {/* PROFILE */}
        <div
          className="user-profile-card"
          style={styles.profileCard}
        >
          <div
            className="user-profile-avatar"
            style={styles.avatar}
          >
            {user?.name?.charAt(0)}
          </div>

          <div
            className="user-profile-info"
            style={styles.profileInfo}
          >
            <h2
              className="user-profile-name"
              style={styles.profileName}
            >
              {user?.name}
            </h2>

            <p
              className="user-profile-details"
              style={styles.profileDetails}
            >
              {user?.email} · {user?.phone}
            </p>
          </div>

          <span
            className="user-profile-badge"
            style={styles.badge}
          >
            USER
          </span>
        </div>

        {/* STATS */}
        <div
          className="user-stats-grid"
          style={styles.statsGrid}
        >
          <div
            className="user-stat-card"
            style={styles.statCard}
          >
            <h2
              className="user-stat-number"
              style={styles.statNumber}
            >
              {vehicles.length}
            </h2>

            <p
              className="user-stat-text"
              style={styles.statText}
            >
              Registered Vehicles
            </p>
          </div>

          <div
            className="user-stat-card"
            style={styles.statCard}
          >
            <h2
              className="user-stat-number"
              style={styles.statNumber}
            >
              {bookings.length}
            </h2>

            <p
              className="user-stat-text"
              style={styles.statText}
            >
              Total Parking Requests
            </p>
          </div>

          <div
            className="user-stat-card"
            style={styles.statCard}
          >
            <h2
              className="user-stat-number"
              style={styles.statNumber}
            >
              {currentlyParked}
            </h2>

            <p
              className="user-stat-text"
              style={styles.statText}
            >
              Currently Parked
            </p>
          </div>

          <div
            className="user-stat-card"
            style={styles.statCard}
          >
            <h2
              className="user-stat-number"
              style={styles.statNumber}
            >
              {completedBookings}
            </h2>

            <p
              className="user-stat-text"
              style={styles.statText}
            >
              Completed Requests
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <h2
          className="user-section-title"
          style={styles.sectionTitle}
        >
          Quick Actions
        </h2>

        <div
          className="user-actions-grid"
          style={styles.grid}
        >

          <Link
            to="/vehicles/add"
            className="user-action-card"
            style={styles.card}
          >
            <div
              className="user-action-icon"
              style={styles.icon}
            >
              🚗
            </div>

            <h2
              className="user-action-title"
              style={styles.cardTitle}
            >
              Add Vehicle
            </h2>

            <p
              className="user-action-text"
              style={styles.cardText}
            >
              Add your vehicle details before creating a parking request.
            </p>
          </Link>

          <Link
            to="/bookings/create"
            className="user-action-card"
            style={styles.card}
          >
            <div
              className="user-action-icon"
              style={styles.icon}
            >
              📍
            </div>

            <h2
              className="user-action-title"
              style={styles.cardTitle}
            >
              Create Booking
            </h2>

            <p
              className="user-action-text"
              style={styles.cardText}
            >
              Request an assistant to pick up and park your vehicle.
            </p>
          </Link>

          <Link
            to="/bookings/track"
            className="user-action-card"
            style={styles.card}
          >
            <div
              className="user-action-icon"
              style={styles.icon}
            >
              🗺️
            </div>

            <h2
              className="user-action-title"
              style={styles.cardTitle}
            >
              Track Vehicle
            </h2>

            <p
              className="user-action-text"
              style={styles.cardText}
            >
              Track vehicle location, OTP, and parking status.
            </p>
          </Link>

          <Link
            to="/ratings/add"
            className="user-action-card"
            style={styles.card}
          >
            <div
              className="user-action-icon"
              style={styles.icon}
            >
              ⭐
            </div>

            <h2
              className="user-action-title"
              style={styles.cardTitle}
            >
              Give Rating
            </h2>

            <p
              className="user-action-text"
              style={styles.cardText}
            >
              Rate the assistant after your booking is completed.
            </p>
          </Link>

          <Link
            to="/parking/history"
            className="user-action-card"
            style={styles.card}
          >
            <div
              className="user-action-icon"
              style={styles.icon}
            >
              🕘
            </div>

            <h2
              className="user-action-title"
              style={styles.cardTitle}
            >
              Parking History
            </h2>

            <p
              className="user-action-text"
              style={styles.cardText}
            >
              View your active and completed parking requests.
            </p>
          </Link>

        </div>

        {/* VEHICLES */}
        <h2
          className="user-section-title"
          style={styles.sectionTitle}
        >
          My Vehicles
        </h2>

        {vehicles.length === 0 ? (

          <div
            className="user-empty-box"
            style={styles.emptyBox}
          >
            No vehicles added yet.
            Add your first vehicle to start booking.
          </div>

        ) : (

          <div
            className="user-vehicle-grid"
            style={styles.vehicleGrid}
          >

            {vehicles.map((vehicle) => (

              <div
                key={vehicle.id}
                className="user-vehicle-card"
                style={styles.vehicleCard}
              >

                {vehicle.imageUrl ? (

                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.vehicleNumber}
                    className="user-vehicle-image"
                    style={styles.vehicleImage}
                  />

                ) : (

                  <div
                    className="user-no-image"
                    style={styles.noImage}
                  >
                    🚗
                  </div>

                )}

                <div
                  className="user-vehicle-content"
                  style={styles.vehicleContent}
                >

                  <h3
                    className="user-vehicle-number"
                    style={styles.vehicleNumber}
                  >
                    {vehicle.vehicleNumber}
                  </h3>

                  <p
                    className="user-vehicle-details"
                    style={styles.vehicleDetails}
                  >
                    <b>Type:</b> {vehicle.vehicleType}
                  </p>

                  <p
                    className="user-vehicle-details"
                    style={styles.vehicleDetails}
                  >
                    <b>Brand:</b> {vehicle.brand}
                  </p>

                  <p
                    className="user-vehicle-details"
                    style={styles.vehicleDetails}
                  >
                    <b>Color:</b> {vehicle.color}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

        {/* INFORMATION */}
        <div
          className="user-info-grid"
          style={styles.infoGrid}
        >

          <div
            className="user-info-card"
            style={styles.infoCard}
          >

            <h2
              className="user-info-title"
              style={styles.infoTitle}
            >
              How It Works
            </h2>

            <p
              className="user-info-text"
              style={styles.infoText}
            >
              1. Add your vehicle.
            </p>

            <p
              className="user-info-text"
              style={styles.infoText}
            >
              2. Create a parking request with GPS location.
            </p>

            <p
              className="user-info-text"
              style={styles.infoText}
            >
              3. Assistant accepts and parks your vehicle.
            </p>

            <p
              className="user-info-text"
              style={styles.infoText}
            >
              4. Request return when you need your vehicle back.
            </p>

          </div>

          <div
            className="user-info-card"
            style={styles.infoCard}
          >

            <h2
              className="user-info-title"
              style={styles.infoTitle}
            >
              Safety Features
            </h2>

            <p
              className="user-info-text"
              style={styles.infoText}
            >
              OTP verification before pickup.
            </p>

            <p
              className="user-info-text"
              style={styles.infoText}
            >
              Parking location within 1 km to reduce fuel waste.
            </p>

            <p
              className="user-info-text"
              style={styles.infoText}
            >
              GPS-based pickup and parking location.
            </p>

            <p
              className="user-info-text"
              style={styles.infoText}
            >
              Assistant rating and feedback system.
            </p>

          </div>

        </div>

      </div>
    </>
  );
};

const styles = {

  page: {
    minHeight: "calc(100vh - 72px)",
    background: "var(--page-bg)",
    color: "var(--text-primary)",
    padding: "42px 40px",
  },

  hero: {
    maxWidth: "1000px",
    marginBottom: "32px",
  },

  title: {
    fontSize: "clamp(32px, 5vw, 46px)",
    margin: "0 0 12px",
    color: "var(--text-primary)",
    lineHeight: "1.15",
    letterSpacing: "-1px",
  },

  blue: {
    color: "var(--primary)",
  },

  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "18px",
    maxWidth: "900px",
    lineHeight: "1.7",
    margin: 0,
  },

  profileCard: {
    background: "var(--card-bg)",
    border: "1px solid var(--border-strong)",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    boxShadow: "var(--shadow)",
  },

  avatar: {
    width: "68px",
    height: "68px",
    minWidth: "68px",
    borderRadius: "18px",
    background: "var(--primary)",
    color: "#06111f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "800",
  },

  profileInfo: {
    minWidth: 0,
  },

  profileName: {
    margin: "0 0 6px",
    color: "var(--text-primary)",
  },

  profileDetails: {
    margin: 0,
    color: "var(--text-secondary)",
    wordBreak: "break-word",
  },

  badge: {
    marginLeft: "auto",
    background: "rgba(0, 194, 255, 0.12)",
    color: "var(--primary)",
    border: "1px solid var(--border-strong)",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
    marginBottom: "38px",
  },

  statCard: {
    background: "var(--card-bg)",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
  },

  statNumber: {
    margin: "0 0 7px",
    color: "var(--text-primary)",
    fontSize: "28px",
  },

  statText: {
    margin: 0,
    color: "var(--text-secondary)",
    fontWeight: "600",
  },

  sectionTitle: {
    margin: "0 0 20px",
    color: "var(--text-primary)",
    fontSize: "24px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "38px",
  },

  card: {
    minHeight: "190px",
    padding: "26px",
    borderRadius: "20px",
    background: "var(--card-bg)",
    textDecoration: "none",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
  },

  icon: {
    fontSize: "34px",
    marginBottom: "16px",
  },

  cardTitle: {
    margin: "0 0 8px",
    color: "var(--text-primary)",
  },

  cardText: {
    margin: 0,
    color: "var(--text-secondary)",
    lineHeight: "1.6",
  },

  vehicleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "22px",
    marginBottom: "38px",
  },

  vehicleCard: {
    background: "var(--card-bg)",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
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
    background: "var(--card-secondary)",
  },

  vehicleContent: {
    padding: "20px",
  },

  vehicleNumber: {
    margin: "0 0 12px",
    color: "var(--text-primary)",
  },

  vehicleDetails: {
    margin: "7px 0",
    color: "var(--text-secondary)",
  },

  emptyBox: {
    background: "var(--card-bg)",
    padding: "25px",
    borderRadius: "18px",
    marginBottom: "38px",
    color: "var(--text-secondary)",
    border: "1px solid var(--border)",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "22px",
    paddingBottom: "30px",
  },

  infoCard: {
    background: "var(--card-bg)",
    padding: "26px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
  },

  infoTitle: {
    margin: "0 0 15px",
    color: "var(--text-primary)",
  },

  infoText: {
    margin: "8px 0",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
  },
};

export default UserDashboard;