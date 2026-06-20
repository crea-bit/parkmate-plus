import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import api from "../services/api";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [averageRating, setAverageRating] = useState(0);
  const [assistantRatings, setAssistantRatings] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const usersList = await api.get("/admin/users");
      const assistantsList = await api.get("/admin/assistants");
      const vehiclesList = await api.get("/admin/vehicles");

      const bookingsList = await api.get("/bookings/details/all");

      const avgRating = await api.get("/ratings/average");
      const assistantAnalytics = await api.get("/ratings/assistant-analytics");

      setUsers(usersList.data);
      setAssistants(assistantsList.data);
      setVehicles(vehiclesList.data);
      setBookings(bookingsList.data);
      setAverageRating(avgRating.data);
      setAssistantRatings(assistantAnalytics.data);
    } catch (error) {
      alert("Failed to load admin dashboard");
      console.log(error);
    }
  };

  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  const activeBookings = bookings.filter(
    (b) => b.status !== "COMPLETED"
  ).length;

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      booking.id?.toString().includes(searchText) ||
      booking.userId?.toString().includes(searchText) ||
      booking.userName?.toLowerCase().includes(searchText) ||
      booking.vehicleId?.toString().includes(searchText) ||
      booking.vehicleNumber?.toLowerCase().includes(searchText) ||
      booking.vehicleType?.charAt(0).toUpperCase() +
      booking.vehicleType?.slice(1).toLowerCase() ||
      booking.assistantId?.toString().includes(searchText) ||
      booking.assistantName?.toLowerCase().includes(searchText) ||
      booking.pickupLocation?.toLowerCase().includes(searchText) ||
      booking.parkingLocation?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const bestAssistant =
    assistantRatings.length > 0
      ? [...assistantRatings].sort(
          (a, b) => b.averageRating - a.averageRating
        )[0]
      : null;

  const statusData = [
    {
      name: "Requested",
      value: bookings.filter((b) => b.status === "REQUESTED").length,
    },
    {
      name: "Assigned",
      value: bookings.filter((b) => b.status === "ASSIGNED").length,
    },
    {
      name: "Picked Up",
      value: bookings.filter((b) => b.status === "PICKED_UP").length,
    },
    {
      name: "Parked",
      value: bookings.filter((b) => b.status === "PARKED").length,
    },
    {
      name: "Return Requested",
      value: bookings.filter((b) => b.status === "RETURN_REQUESTED").length,
    },
    {
      name: "Returning",
      value: bookings.filter((b) => b.status === "RETURNING").length,
    },
    {
      name: "Completed",
      value: completedBookings,
    },
  ].filter((item) => item.value > 0);

  const completionData = [
    { name: "Completed", value: completedBookings },
    { name: "Active", value: activeBookings },
  ];

  const ratingChartData = assistantRatings.map((item) => ({
    assistant: `A-${item.assistantId}`,
    rating: Number(item.averageRating.toFixed(1)),
  }));

  const chartColors = [
    "#00c2ff",
    "#22c55e",
    "#f59e0b",
    "#a855f7",
    "#fb7185",
    "#3b82f6",
    "#f97316",
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "#22c55e";
      case "REQUESTED":
        return "#f59e0b";
      case "ASSIGNED":
        return "#3b82f6";
      case "PICKED_UP":
        return "#a855f7";
      case "PARKED":
        return "#00c2ff";
      case "RETURN_REQUESTED":
        return "#fb7185";
      case "RETURNING":
        return "#f97316";
      default:
        return "#94a3b8";
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            Admin <span style={styles.blue}>Dashboard</span>
          </h1>
          <p style={styles.subtitle}>
            Manage users, assistants, vehicles, bookings, ratings, and platform
            activity.
          </p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.icon}>👤</div>
            <h2>{users.length}</h2>
            <p>Total Users</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.icon}>🧑‍💼</div>
            <h2>{assistants.length}</h2>
            <p>Assistants</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.icon}>🚗</div>
            <h2>{vehicles.length}</h2>
            <p>Vehicles</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.icon}>📋</div>
            <h2>{bookings.length}</h2>
            <p>Total Bookings</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.icon}>✅</div>
            <h2>{completedBookings}</h2>
            <p>Completed</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.icon}>⏳</div>
            <h2>{activeBookings}</h2>
            <p>Active</p>
          </div>

          <div style={styles.statCard}>
            <div style={styles.icon}>⭐</div>
            <h2>{Number(averageRating).toFixed(1)}</h2>
            <p>Average Rating</p>
          </div>
        </div>

        <div style={styles.chartGrid}>
          <div style={styles.chartCard}>
            <h2>Booking Status Distribution</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={95}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartCard}>
            <h2>Completed vs Active</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={completionData}>
                <XAxis dataKey="name" stroke="#9db4cc" />
                <YAxis stroke="#9db4cc" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#00c2ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartCard}>
            <h2>Assistant Ratings</h2>
            {ratingChartData.length === 0 ? (
              <p style={{ color: "#9db4cc" }}>No ratings available</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ratingChartData}>
                  <XAxis dataKey="assistant" stroke="#9db4cc" />
                  <YAxis stroke="#9db4cc" domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#22c55e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.leftSection}>
            <div style={styles.sectionHeader}>
              <h2>All Bookings</h2>
              <span style={styles.countBadge}>
                {filteredBookings.length} records
              </span>
            </div>

            <div style={styles.filterBox}>
              <input
                style={styles.searchInput}
                type="text"
                placeholder="Search by booking, user, vehicle, assistant, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                style={styles.select}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="REQUESTED">Requested</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="PICKED_UP">Picked Up</option>
                <option value="PARKED">Parked</option>
                <option value="RETURN_REQUESTED">Return Requested</option>
                <option value="RETURNING">Returning</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {filteredBookings.length === 0 ? (
              <div style={styles.empty}>No bookings found</div>
            ) : (
              filteredBookings
                .slice()
                .reverse()
                .map((booking) => (
                  <div key={booking.id} style={styles.bookingCard}>
                    <div style={styles.bookingTop}>
                      <div>
                        <h3>Booking #{booking.id}</h3>
                        <p style={styles.smallText}>
                          {booking.vehicleNumber || "Unknown Vehicle"}
                          {booking.vehicleType ? ` · ${booking.vehicleType}` : ""}
                        </p>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          background: getStatusColor(booking.status),
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div style={styles.bookingGrid}>
                      <p>
                        <b>User:</b> {booking.userName || "Unknown User"}
                      </p>
                      <p>
                        <b>Vehicle:</b>{" "}
                        {booking.vehicleNumber || "Unknown Vehicle"}
                      </p>
                      <p>
                        <b>Vehicle Type:</b>{" "}
                        {booking.vehicleType || "Not Available"}
                      </p>
                      <p>
                        <b>Assistant:</b>{" "}
                        {booking.assistantName || "Not Assigned"}
                      </p>
                      <p>
                        <b>OTP:</b> {booking.otp}
                      </p>
                      <p>
                        <b>Pickup:</b> {booking.pickupLocation}
                      </p>
                      <p>
                        <b>Parking:</b> {booking.parkingLocation}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>

          <div style={styles.rightSection}>
            <h2>Platform Overview</h2>

            <div style={styles.overviewCard}>
              <h3>System Summary</h3>
              <p>👥 Registered Users: {users.length}</p>
              <p>🧑‍💼 Assistants: {assistants.length}</p>
              <p>🚗 Registered Vehicles: {vehicles.length}</p>
              <p>📋 Total Bookings: {bookings.length}</p>
              <p>✅ Completed: {completedBookings}</p>
              <p>⏳ Active: {activeBookings}</p>
              <p>⭐ Average Rating: {Number(averageRating).toFixed(1)}</p>
            </div>

            <div style={styles.overviewCard}>
              <h3>Top Performer</h3>

              {bestAssistant ? (
                <>
                  <p>
                    <b>Assistant ID:</b> {bestAssistant.assistantId}
                  </p>
                  <p>
                    <b>Average Rating:</b>{" "}
                    {bestAssistant.averageRating.toFixed(1)}
                  </p>
                  <p>
                    <b>Total Ratings:</b> {bestAssistant.totalRatings}
                  </p>
                </>
              ) : (
                <p>No ratings available</p>
              )}
            </div>

            <div style={styles.overviewCard}>
              <h3>Assistant Ratings</h3>

              {assistantRatings.length === 0 ? (
                <p>No ratings available</p>
              ) : (
                assistantRatings.map((rating) => (
                  <div key={rating.assistantId} style={styles.ratingBox}>
                    <p>
                      <b>Assistant ID:</b> {rating.assistantId}
                    </p>
                    <p>
                      <b>Average Rating:</b>{" "}
                      {rating.averageRating.toFixed(1)}
                    </p>
                    <p>
                      <b>Total Ratings:</b> {rating.totalRatings}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div style={styles.overviewCard}>
  <h3>Recent Activity</h3>

  {bookings.length === 0 ? (
    <p>No recent activity</p>
  ) : (
    bookings
      .slice()
      .reverse()
      .slice(0, 5)
      .map((booking) => (
        <p key={booking.id}>
          📌 Booking #{booking.id} - {booking.status}
          {booking.assistantName
            ? ` by ${booking.assistantName}`
            : ""}
        </p>
      ))
  )}
</div>

            <div style={styles.overviewCard}>
              <h3>Quick Insights</h3>

              <p>
                Vehicles per user:{" "}
                {users.length > 0
                  ? (vehicles.length / users.length).toFixed(1)
                  : 0}
              </p>

              <p>
                Completion Rate:{" "}
                {bookings.length > 0
                  ? ((completedBookings / bookings.length) * 100).toFixed(0)
                  : 0}
                %
              </p>

              <p>Pending/Active Requests: {activeBookings}</p>
            </div>
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
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "42px",
    marginBottom: "10px",
  },
  blue: {
    color: "#00c2ff",
  },
  subtitle: {
    color: "#9db4cc",
    fontSize: "17px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    background: "#1f2937",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid rgba(0,194,255,0.18)",
  },
  icon: {
    fontSize: "32px",
    marginBottom: "10px",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
    marginBottom: "30px",
  },
  chartCard: {
    background: "#1f2937",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid rgba(0,194,255,0.18)",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "25px",
    alignItems: "start",
  },
  leftSection: {
    background: "#1f2937",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  rightSection: {
    background: "#1f2937",
    padding: "24px",
    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  countBadge: {
    background: "#111827",
    color: "#9db4cc",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  filterBox: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    minWidth: "260px",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#111827",
    color: "white",
    outline: "none",
  },
  select: {
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#111827",
    color: "white",
    outline: "none",
  },
  bookingCard: {
    background: "#111827",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "16px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  bookingTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "12px",
  },
  smallText: {
    color: "#9db4cc",
    marginTop: "6px",
  },
  statusBadge: {
    color: "white",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  bookingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "8px",
  },
  overviewCard: {
    background: "#111827",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "18px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  ratingBox: {
    marginBottom: "12px",
    padding: "12px",
    background: "#0f172a",
    borderRadius: "10px",
  },
  empty: {
    background: "#111827",
    padding: "40px",
    textAlign: "center",
    borderRadius: "14px",
    color: "#9db4cc",
  },
};

export default AdminDashboard;