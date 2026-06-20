import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

import UserDashboard from "./pages/UserDashboard";
import AssistantDashboard from "./pages/AssistantDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import AddVehicle from "./pages/AddVehicle";
import CreateBooking from "./pages/CreateBooking";
import TrackBooking from "./pages/TrackBooking";
import Rating from "./pages/Rating";
import ParkingHistory from "./pages/ParkingHistory";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/dashboard/user" element={<UserDashboard />} />
        <Route
          path="/dashboard/assistant"
          element={<AssistantDashboard />}
        />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />

        {/* Vehicle */}
        <Route path="/vehicles/add" element={<AddVehicle />} />

        {/* Booking */}
        <Route path="/bookings/create" element={<CreateBooking />} />
        <Route path="/bookings/track" element={<TrackBooking />} />

        {/* Rating */}
        <Route path="/ratings/add" element={<Rating />} />

        {/* Parking History */}
        <Route path="/parking/history" element={<ParkingHistory />} />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;