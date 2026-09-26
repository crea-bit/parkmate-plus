import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import AssistantLocationTracker from "./AssistantLocationTracker";

const AssistantDashboard = () => {
  const assistant = JSON.parse(localStorage.getItem("assistant"));

  const [requests, setRequests] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // =========================================================
  // LOAD AVAILABLE REQUESTS
  // =========================================================

  const loadRequests = async () => {
    try {
      const response = await api.get("/bookings/details/available");
      setRequests(response.data);
    } catch (error) {
      alert("Failed to load available requests");
      console.log(error);
    }
  };

  // =========================================================
  // LOAD ASSIGNED BOOKINGS
  // =========================================================

  const loadMyBookings = async () => {
    try {
      if (!assistant?.id) return;

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

  // =========================================================
  // ACCEPT BOOKING
  // =========================================================

  const acceptBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/accept`);

      alert("Booking accepted successfully");

      await loadRequests();
      await loadMyBookings();
    } catch (error) {
      console.log("Accept booking error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to accept booking"
      );
    }
  };

  // =========================================================
  // UPDATE BOOKING STATUS
  // =========================================================

  const updateStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status/${status}`);

      alert("Status updated to " + status);

      await loadMyBookings();
      await loadRequests();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to update status"
      );

      console.log(error);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadRequests();
    loadMyBookings();
  }, []);

  // =========================================================
  // ASSISTANT INITIALS
  // =========================================================

  const initials = assistant?.name
    ? assistant.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  // =========================================================
  // BOOKING COUNTS
  // =========================================================

  const activeBookings = myBookings.filter(
    (booking) => booking.status !== "COMPLETED"
  ).length;

  const completedBookings = myBookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    if (status === "COMPLETED") return styles.completed;

    if (status === "PARKED") return styles.parked;

    if (status === "REQUESTED") return styles.requested;

    if (status === "ASSIGNED") return styles.assigned;

    if (status === "PICKED_UP") return styles.active;

    if (status === "RETURNING") return styles.returning;

    if (status === "RETURN_REQUESTED") {
      return styles.returnRequested;
    }

    return styles.defaultStatus;
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
      <Navbar />

      {/* =====================================================
          MOBILE / GPS TRACKER
      ====================================================== */}

      <AssistantLocationTracker />

      {/* =====================================================
          MAIN PAGE
      ====================================================== */}

      <div className="assistant-dashboard-page" style={styles.page}>

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div
          className="assistant-dashboard-header"
          style={styles.header}
        >
          {/* LEFT */}
          <div className="assistant-header-content">
            <h1 style={styles.title}>
              Assistant{" "}
              <span style={styles.highlight}>
                Dashboard
              </span>
            </h1>

            <p style={styles.subtitle}>
              Manage parking requests, update vehicle status,
              and complete assigned bookings.
            </p>
          </div>

          {/* PROFILE */}
          <div
            className="assistant-profile-card"
            style={styles.profileCard}
          >
            <div style={styles.avatar}>
              {initials}
            </div>

            <div className="assistant-profile-info">
              <h2 style={styles.profileName}>
                {assistant?.name || "Assistant"}
              </h2>

              <p style={styles.profileText}>
                {assistant?.email || ""}
              </p>

              <span style={styles.roleBadge}>
                ASSISTANT
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            ANALYTICS
        ==================================================== */}

        <div
          className="assistant-analytics-grid"
          style={styles.analyticsGrid}
        >
          {/* OPEN REQUESTS */}

          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>
              {requests.length}
            </h2>

            <p style={styles.statLabel}>
              Open Requests
            </p>
          </div>

          {/* TOTAL ASSIGNED */}

          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>
              {myBookings.length}
            </h2>

            <p style={styles.statLabel}>
              Total Assigned
            </p>
          </div>

          {/* ACTIVE */}

          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>
              {activeBookings}
            </h2>

            <p style={styles.statLabel}>
              Active Bookings
            </p>
          </div>

          {/* COMPLETED */}

          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>
              {completedBookings}
            </h2>

            <p style={styles.statLabel}>
              Completed
            </p>
          </div>

          {/* RATING */}

          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>
              {Number(averageRating).toFixed(1)}
            </h2>

            <p style={styles.statLabel}>
              Average Rating
            </p>
          </div>
        </div>

        {/* ===================================================
            MAIN TWO SECTIONS
        ==================================================== */}

        <div
          className="assistant-main-grid"
          style={styles.mainGrid}
        >
          {/* =================================================
              AVAILABLE REQUESTS
          ================================================== */}

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                Available Parking Requests
              </h2>

              <span style={styles.countBadge}>
                {requests.length} open
              </span>
            </div>

            {requests.length === 0 ? (
              <div style={styles.emptyBox}>
                <div style={styles.emptyIcon}>
                  📭
                </div>

                <h3 style={styles.emptyTitle}>
                  No available requests
                </h3>

                <p style={styles.emptyText}>
                  New parking requests will appear here.
                </p>
              </div>
            ) : (
              <div className="assistant-card-grid">
                {requests.map((booking) => (
                  <div
                    key={booking.id}
                    className="assistant-booking-card"
                    style={styles.bookingCard}
                  >
                    {/* CARD TOP */}

                    <div
                      className="assistant-card-top"
                      style={styles.cardTop}
                    >
                      <h3 style={styles.bookingTitle}>
                        Booking #{booking.id}
                      </h3>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(
                            booking.status
                          ),
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* INFO */}

                    <div
                      className="assistant-info-grid"
                      style={styles.infoGrid}
                    >
                      <div style={styles.infoBox}>
                        <span style={styles.infoLabel}>
                          User
                        </span>

                        <strong
                          style={styles.infoValue}
                        >
                          {booking.userName ||
                            "Unknown User"}
                        </strong>
                      </div>

                      <div style={styles.infoBox}>
                        <span style={styles.infoLabel}>
                          Vehicle
                        </span>

                        <strong
                          style={styles.infoValue}
                        >
                          {booking.vehicleNumber ||
                            "Unknown Vehicle"}
                        </strong>

                        <small
                          style={styles.smallText}
                        >
                          {booking.vehicleType || ""}
                        </small>
                      </div>

                      <div style={styles.locationBox}>
                        <span style={styles.infoLabel}>
                          Pickup
                        </span>

                        <strong
                          style={styles.infoValue}
                        >
                          {booking.pickupLocation ||
                            "Not available"}
                        </strong>
                      </div>

                      <div style={styles.locationBox}>
                        <span style={styles.infoLabel}>
                          Parking
                        </span>

                        <strong
                          style={styles.infoValue}
                        >
                          {booking.parkingLocation ||
                            "Not available"}
                        </strong>
                      </div>
                    </div>

                    {/* ACCEPT */}

                    <button
                      style={styles.primaryButton}
                      onClick={() =>
                        acceptBooking(booking.id)
                      }
                    >
                      ✓ Accept Booking
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* =================================================
              ASSIGNED BOOKINGS
          ================================================== */}

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                My Assigned Bookings
              </h2>

              <span style={styles.countBadge}>
                {myBookings.length} total
              </span>
            </div>

            {myBookings.length === 0 ? (
              <div style={styles.emptyBox}>
                <div style={styles.emptyIcon}>
                  📋
                </div>

                <h3 style={styles.emptyTitle}>
                  No assigned bookings
                </h3>

                <p style={styles.emptyText}>
                  Accepted bookings will appear here.
                </p>
              </div>
            ) : (
              <div className="assistant-card-grid">
                {myBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="assistant-booking-card"
                    style={styles.bookingCard}
                  >
                    {/* CARD TOP */}

                    <div
                      className="assistant-card-top"
                      style={styles.cardTop}
                    >
                      <div
                        className="assistant-booking-heading"
                      >
                        <h3 style={styles.bookingTitle}>
                          Booking #{booking.id}
                        </h3>

                        <p style={styles.smallText}>
                          {booking.vehicleNumber ||
                            "Unknown Vehicle"}{" "}
                          {booking.vehicleType &&
                            `· ${booking.vehicleType}`}
                        </p>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(
                            booking.status
                          ),
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* OTP */}

                    <div style={styles.otpBox}>
                      <span style={styles.infoLabel}>
                        OTP
                      </span>

                      <strong style={styles.otpValue}>
                        {booking.otp}
                      </strong>
                    </div>

                    {/* INFO */}

                    <div
                      className="assistant-info-grid"
                      style={styles.infoGrid}
                    >
                      <div style={styles.infoBox}>
                        <span style={styles.infoLabel}>
                          User
                        </span>

                        <strong
                          style={styles.infoValue}
                        >
                          {booking.userName ||
                            "Unknown User"}
                        </strong>
                      </div>

                      <div style={styles.infoBox}>
                        <span style={styles.infoLabel}>
                          Vehicle
                        </span>

                        <strong
                          style={styles.infoValue}
                        >
                          {booking.vehicleNumber ||
                            "Unknown Vehicle"}
                        </strong>
                      </div>

                      <div style={styles.locationBox}>
                        <span style={styles.infoLabel}>
                          Pickup
                        </span>

                        <strong
                          style={styles.infoValue}
                        >
                          {booking.pickupLocation ||
                            "Not available"}
                        </strong>
                      </div>

                      <div style={styles.locationBox}>
                        <span style={styles.infoLabel}>
                          Parking
                        </span>

                        <strong
                          style={styles.infoValue}
                        >
                          {booking.parkingLocation ||
                            "Not available"}
                        </strong>
                      </div>
                    </div>

                    {/* =================================================
                        RETURN REQUESTED
                    ================================================== */}

                    {booking.status ===
                      "RETURN_REQUESTED" && (
                      <button
                        style={styles.primaryButton}
                        onClick={() =>
                          updateStatus(
                            booking.id,
                            "RETURNING"
                          )
                        }
                      >
                        🚗 Start Return
                      </button>
                    )}

                    {/* =================================================
                        NORMAL STATUS ACTIONS
                    ================================================== */}

                    {booking.status !== "COMPLETED" &&
                      booking.status !==
                        "RETURN_REQUESTED" && (
                        <div
                          className="assistant-action-grid"
                          style={styles.actionGrid}
                        >
                          <button
                            style={styles.outlineButton}
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "PICKED_UP"
                              )
                            }
                          >
                            🚗 Picked Up
                          </button>

                          <button
                            style={styles.outlineButton}
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "PARKED"
                              )
                            }
                          >
                            🅿 Parked
                          </button>

                          <button
                            style={styles.outlineButton}
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "RETURNING"
                              )
                            }
                          >
                            🔄 Returning
                          </button>

                          <button
                            style={styles.successButton}
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "COMPLETED"
                              )
                            }
                          >
                            ✓ Completed
                          </button>
                        </div>
                      )}

                    {/* =================================================
                        RETURNING
                    ================================================== */}

                    {booking.status ===
                      "RETURNING" && (
                      <button
                        style={{
                          ...styles.successButton,
                          width: "100%",
                          marginTop: "12px",
                        }}
                        onClick={() =>
                          updateStatus(
                            booking.id,
                            "COMPLETED"
                          )
                        }
                      >
                        ✓ Mark Vehicle Returned
                      </button>
                    )}

                    {/* =================================================
                        COMPLETED
                    ================================================== */}

                    {booking.status ===
                      "COMPLETED" && (
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

      {/* =====================================================
          MOBILE RESPONSIVE CSS
      ====================================================== */}

      <style>{`

        /* =====================================================
           GLOBAL ASSISTANT DASHBOARD
        ====================================================== */

        .assistant-dashboard-page {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .assistant-profile-card {
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }

        .assistant-profile-info {
          min-width: 0;
          max-width: 100%;
        }

        .assistant-profile-info h2,
        .assistant-profile-info p {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .assistant-header-content {
          min-width: 0;
        }

        .assistant-card-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 18px;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .assistant-card-grid > div {
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }

        .assistant-info-grid {
          min-width: 0;
        }

        .assistant-info-grid > div {
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
        }

        .assistant-info-grid strong,
        .assistant-info-grid span,
        .assistant-info-grid small {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .assistant-card-top {
          min-width: 0;
        }

        .assistant-booking-heading {
          min-width: 0;
        }

        .assistant-booking-heading h3,
        .assistant-booking-heading p {
          overflow-wrap: anywhere;
          word-break: break-word;
        }


        /* =====================================================
           BOOKING CARDS - ALWAYS ONE PER ROW
           Prevents assigned bookings from becoming
           narrow letter-by-letter columns.
        ====================================================== */

        .assistant-card-grid {
          grid-template-columns: minmax(0, 1fr) !important;
        }

        .assistant-card-grid > .assistant-booking-card {
          width: 100%;
        }


        /* =====================================================
           TABLET / MOBILE
        ====================================================== */

        @media (max-width: 900px) {

          .assistant-dashboard-page {
            padding: 28px 20px !important;
          }

          .assistant-dashboard-header {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          .assistant-profile-card {
            width: 100%;
          }

          .assistant-analytics-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr)) !important;
            gap: 14px !important;
          }

          .assistant-main-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          .assistant-card-grid {
            grid-template-columns:
              minmax(0, 1fr);
          }
        }


        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 600px) {

          .assistant-dashboard-page {
            padding: 22px 14px !important;
          }

          .assistant-dashboard-header {
            margin-bottom: 22px !important;
          }

          .assistant-dashboard-header h1 {
            font-size: 36px !important;
            line-height: 1.12 !important;
          }

          .assistant-dashboard-header p {
            font-size: 16px !important;
            line-height: 1.55 !important;
          }

          .assistant-profile-card {
            padding: 18px !important;
            gap: 14px !important;
            align-items: center !important;
          }

          .assistant-profile-card > div:first-child {
            width: 58px !important;
            height: 58px !important;
            min-width: 58px !important;
            font-size: 24px !important;
            border-radius: 15px !important;
          }

          .assistant-profile-info h2 {
            font-size: 21px !important;
            line-height: 1.25 !important;
          }

          .assistant-profile-info p {
            font-size: 14px !important;
            line-height: 1.4 !important;
          }

          .assistant-analytics-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr)) !important;

            gap: 10px !important;

            margin-bottom: 22px !important;
          }

          .assistant-analytics-grid > div {
            min-width: 0 !important;
          }

          .assistant-section {
            padding: 16px !important;
          }

          .assistant-info-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr)) !important;
          }

          .assistant-action-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr)) !important;
          }

          .assistant-card-top {
            flex-wrap: wrap !important;
          }

          .assistant-card-top h3 {
            font-size: 20px !important;
          }
        }


        /* =====================================================
           SMALL PHONE
        ====================================================== */

        @media (max-width: 420px) {

          .assistant-dashboard-page {
            padding: 18px 10px !important;
          }

          .assistant-dashboard-header h1 {
            font-size: 32px !important;
          }

          .assistant-profile-card {
            padding: 15px !important;
          }

          .assistant-profile-card > div:first-child {
            width: 52px !important;
            height: 52px !important;
            min-width: 52px !important;
            font-size: 22px !important;
          }

          .assistant-profile-info h2 {
            font-size: 18px !important;
          }

          .assistant-profile-info p {
            font-size: 13px !important;
          }

          .assistant-analytics-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr)) !important;
          }

          .assistant-info-grid {
            grid-template-columns: 1fr !important;
          }

          .assistant-action-grid {
            grid-template-columns: 1fr !important;
          }

          .assistant-card-top {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .assistant-card-top .status-badge {
            align-self: flex-start;
          }
        }


        /* =====================================================
           VERY SMALL PHONE
        ====================================================== */

        @media (max-width: 360px) {

          .assistant-dashboard-page {
            padding: 16px 8px !important;
          }

          .assistant-dashboard-header h1 {
            font-size: 29px !important;
          }

          .assistant-analytics-grid {
            grid-template-columns: 1fr !important;
          }

          .assistant-profile-card {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .assistant-profile-info {
            width: 100%;
          }
        }

      `}</style>
    </>
  );
};


// =============================================================
// STYLES
// =============================================================

const styles = {

  // ===========================================================
  // PAGE
  // ===========================================================

  page: {
    minHeight: "100vh",

    background: "var(--bg)",

    color: "var(--text)",

    padding: "40px",

    boxSizing: "border-box",
  },


  // ===========================================================
  // HEADER
  // ===========================================================

  header: {
    display: "grid",

    gridTemplateColumns: "1.3fr 1fr",

    gap: "24px",

    alignItems: "stretch",

    marginBottom: "28px",

    minWidth: 0,
  },


  title: {
    fontSize: "40px",

    lineHeight: "1.15",

    margin: "0 0 10px 0",

    color: "var(--text)",

    fontWeight: "800",
  },


  highlight: {
    color: "var(--primary)",
  },


  subtitle: {
    color: "var(--text-muted)",

    fontSize: "17px",

    lineHeight: "1.6",

    maxWidth: "700px",

    margin: 0,
  },


  // ===========================================================
  // PROFILE
  // ===========================================================

  profileCard: {
    background: "var(--card)",

    color: "var(--text)",

    border: "1px solid var(--border-accent)",

    borderRadius: "18px",

    padding: "26px",

    display: "flex",

    alignItems: "center",

    gap: "22px",

    boxShadow: "var(--shadow-lg)",

    minWidth: 0,

    overflow: "hidden",

    boxSizing: "border-box",
  },


  avatar: {
    width: "70px",

    height: "70px",

    minWidth: "70px",

    borderRadius: "18px",

    background: "var(--primary)",

    color: "#06111f",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    fontSize: "30px",

    fontWeight: "bold",
  },


  profileName: {
    margin: 0,

    color: "var(--text)",

    fontSize: "28px",

    overflowWrap: "anywhere",
  },


  profileText: {
    color: "var(--text-muted)",

    margin: "8px 0",

    overflowWrap: "anywhere",

    wordBreak: "break-word",
  },


  roleBadge: {
    display: "inline-block",

    background: "var(--primary-glow)",

    color: "var(--primary)",

    border: "1px solid var(--border-accent)",

    padding: "6px 12px",

    borderRadius: "20px",

    fontSize: "12px",

    fontWeight: "bold",
  },


  // ===========================================================
  // ANALYTICS
  // ===========================================================

  analyticsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(5, minmax(0, 1fr))",

    gap: "18px",

    marginBottom: "30px",

    minWidth: 0,
  },


  statCard: {
    background: "var(--card)",

    color: "var(--text)",

    borderRadius: "16px",

    padding: "24px",

    border: "1px solid var(--border)",

    boxShadow: "var(--shadow-sm)",

    minHeight: "110px",

    minWidth: 0,

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    boxSizing: "border-box",

    overflow: "hidden",
  },


  statNumber: {
    margin: "0 0 8px 0",

    color: "var(--text)",

    fontSize: "30px",
  },


  statLabel: {
    margin: 0,

    color: "var(--text-muted)",

    fontSize: "16px",

    lineHeight: "1.45",

    overflowWrap: "anywhere",
  },


  // ===========================================================
  // MAIN GRID
  // ===========================================================

  mainGrid: {
    display: "grid",

    gridTemplateColumns: "1fr 1fr",

    gap: "26px",

    alignItems: "start",

    minWidth: 0,
  },


  // ===========================================================
  // SECTION
  // ===========================================================

  section: {
    background: "var(--card-secondary)",

    color: "var(--text)",

    border: "1px solid var(--border)",

    borderRadius: "20px",

    padding: "22px",

    minWidth: 0,

    boxSizing: "border-box",

    overflow: "hidden",
  },


  sectionHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "15px",

    marginBottom: "18px",

    minWidth: 0,
  },


  sectionTitle: {
    margin: 0,

    color: "var(--text)",

    fontSize: "25px",

    lineHeight: "1.3",

    overflowWrap: "anywhere",
  },


  countBadge: {
    background: "var(--input-bg)",

    color: "var(--text-muted)",

    padding: "7px 12px",

    borderRadius: "20px",

    fontSize: "13px",

    whiteSpace: "nowrap",

    flexShrink: 0,
  },


  // ===========================================================
  // BOOKING CARD
  // ===========================================================

  bookingCard: {
    background: "var(--card)",

    color: "var(--text)",

    padding: "20px",

    borderRadius: "18px",

    border: "1px solid var(--border-accent)",

    boxShadow: "var(--shadow-sm)",

    minWidth: 0,

    maxWidth: "100%",

    boxSizing: "border-box",

    overflow: "hidden",
  },


  cardTop: {
    display: "flex",

    justifyContent: "space-between",

    gap: "15px",

    alignItems: "flex-start",

    marginBottom: "15px",

    minWidth: 0,
  },


  bookingTitle: {
    margin: 0,

    color: "var(--text)",

    fontSize: "21px",

    overflowWrap: "anywhere",
  },


  smallText: {
    color: "var(--text-muted)",

    marginTop: "6px",

    overflowWrap: "anywhere",

    wordBreak: "break-word",
  },


  statusBadge: {
    padding: "8px 12px",

    borderRadius: "20px",

    fontSize: "12px",

    fontWeight: "bold",

    whiteSpace: "nowrap",

    flexShrink: 0,
  },


  // ===========================================================
  // STATUS COLORS
  // ===========================================================

  completed: {
    background: "rgba(34,197,94,0.18)",

    color: "#22c55e",

    border:
      "1px solid rgba(34,197,94,0.5)",
  },


  parked: {
    background: "rgba(0,194,255,0.18)",

    color: "#00c2ff",

    border:
      "1px solid rgba(0,194,255,0.5)",
  },


  requested: {
    background: "rgba(245,158,11,0.18)",

    color: "#f59e0b",

    border:
      "1px solid rgba(245,158,11,0.5)",
  },


  assigned: {
    background: "rgba(168,85,247,0.18)",

    color: "#a855f7",

    border:
      "1px solid rgba(168,85,247,0.5)",
  },


  active: {
    background: "rgba(59,130,246,0.18)",

    color: "#60a5fa",

    border:
      "1px solid rgba(59,130,246,0.5)",
  },


  returning: {
    background: "rgba(245,158,11,0.18)",

    color: "#f59e0b",

    border:
      "1px solid rgba(245,158,11,0.5)",
  },


  returnRequested: {
    background: "rgba(251,113,133,0.18)",

    color: "#fb7185",

    border:
      "1px solid rgba(251,113,133,0.5)",
  },


  defaultStatus: {
    background: "rgba(148,163,184,0.18)",

    color: "#cbd5e1",

    border:
      "1px solid rgba(148,163,184,0.5)",
  },


  // ===========================================================
  // INFO
  // ===========================================================

  infoGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",

    gap: "12px",

    marginBottom: "16px",

    minWidth: 0,
  },


  infoBox: {
    background: "var(--input-bg)",

    padding: "13px",

    borderRadius: "12px",

    display: "flex",

    flexDirection: "column",

    gap: "5px",

    minWidth: 0,

    boxSizing: "border-box",

    overflow: "hidden",
  },


  locationBox: {
    background: "var(--input-bg)",

    padding: "13px",

    borderRadius: "12px",

    display: "flex",

    flexDirection: "column",

    gap: "5px",

    minWidth: 0,

    boxSizing: "border-box",

    overflow: "hidden",
  },


  infoLabel: {
    color: "var(--text-muted)",

    fontSize: "13px",

    fontWeight: "600",
  },


  infoValue: {
    color: "var(--text)",

    overflowWrap: "anywhere",

    wordBreak: "break-word",

    lineHeight: "1.4",
  },


  // ===========================================================
  // OTP
  // ===========================================================

  otpBox: {
    background: "var(--input-bg)",

    padding: "14px",

    borderRadius: "12px",

    marginBottom: "14px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "10px",
  },


  otpValue: {
    color: "var(--text)",

    fontSize: "20px",

    letterSpacing: "2px",
  },


  // ===========================================================
  // BUTTONS
  // ===========================================================

  primaryButton: {
    width: "100%",

    padding: "13px",

    borderRadius: "10px",

    border: "none",

    background: "var(--primary)",

    color: "#06111f",

    fontWeight: "bold",

    cursor: "pointer",

    boxSizing: "border-box",
  },


  outlineButton: {
    padding: "11px",

    borderRadius: "10px",

    border:
      "1px solid var(--border-accent)",

    background: "transparent",

    color: "var(--primary)",

    fontWeight: "bold",

    cursor: "pointer",

    minWidth: 0,
  },


  successButton: {
    padding: "11px",

    borderRadius: "10px",

    border: "none",

    background: "#22c55e",

    color: "#06111f",

    fontWeight: "bold",

    cursor: "pointer",

    minWidth: 0,
  },


  actionGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",

    gap: "10px",

    marginTop: "14px",

    minWidth: 0,
  },


  // ===========================================================
  // EMPTY
  // ===========================================================

  emptyBox: {
    background: "var(--input-bg)",

    borderRadius: "16px",

    padding: "35px",

    textAlign: "center",

    color: "var(--text-muted)",

    boxSizing: "border-box",
  },


  emptyIcon: {
    fontSize: "40px",

    marginBottom: "10px",
  },


  emptyTitle: {
    color: "var(--text)",

    margin: "0 0 8px 0",
  },


  emptyText: {
    color: "var(--text-muted)",

    margin: 0,
  },


  // ===========================================================
  // COMPLETED
  // ===========================================================

  completedBox: {
    marginTop: "14px",

    background:
      "rgba(34,197,94,0.12)",

    color: "#22c55e",

    border:
      "1px solid rgba(34,197,94,0.35)",

    padding: "12px",

    borderRadius: "10px",

    fontWeight: "bold",

    textAlign: "center",
  },
};

export default AssistantDashboard;