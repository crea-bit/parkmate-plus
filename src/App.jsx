import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";

// =========================
// LANDING PAGE
// =========================
import LandingPage from "./pages/LandingPage";

// =========================
// AUTHENTICATION
// =========================
import Login from "./pages/Login";
import Register from "./pages/Register";

// =========================
// DASHBOARDS
// =========================
import UserDashboard from "./pages/UserDashboard";
import AssistantDashboard from "./pages/AssistantDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// =========================
// USER PAGES
// =========================
import AddVehicle from "./pages/AddVehicle";
import CreateBooking from "./pages/CreateBooking";
import TrackBooking from "./pages/TrackBooking";
import Rating from "./pages/Rating";
import ParkingHistory from "./pages/ParkingHistory";
import Notifications from "./pages/Notifications";

// =========================
// SECURITY
// =========================
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>

        <Routes>

          {/* ==================================================
              LANDING PAGE
              First page when user opens ParkMate Plus
          ================================================== */}

          <Route
            path="/"
            element={<LandingPage />}
          />


          {/* ==================================================
              AUTHENTICATION
          ================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ==================================================
              USER DASHBOARD
          ================================================== */}

          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute allowedRole="USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              ASSISTANT DASHBOARD
          ================================================== */}

          <Route
            path="/dashboard/assistant"
            element={
              <ProtectedRoute allowedRole="ASSISTANT">
                <AssistantDashboard />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              ADMIN DASHBOARD
          ================================================== */}

          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              ADD VEHICLE
              USER ONLY
          ================================================== */}

          <Route
            path="/vehicles/add"
            element={
              <ProtectedRoute allowedRole="USER">
                <AddVehicle />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              CREATE BOOKING
              USER ONLY
          ================================================== */}

          <Route
            path="/bookings/create"
            element={
              <ProtectedRoute allowedRole="USER">
                <CreateBooking />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              TRACK BOOKING
              USER ONLY
          ================================================== */}

          <Route
            path="/bookings/track"
            element={
              <ProtectedRoute allowedRole="USER">
                <TrackBooking />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              RATING
              USER ONLY
          ================================================== */}

          <Route
            path="/ratings/add"
            element={
              <ProtectedRoute allowedRole="USER">
                <Rating />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              PARKING HISTORY
              USER ONLY
          ================================================== */}

          <Route
            path="/parking/history"
            element={
              <ProtectedRoute allowedRole="USER">
                <ParkingHistory />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              NOTIFICATIONS
              AUTHENTICATED USERS
          ================================================== */}

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />


          {/* ==================================================
              UNKNOWN URL
              SEND USER BACK TO LANDING PAGE
          ================================================== */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>

      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;