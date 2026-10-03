import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/parkmate-logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Clear previous login data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("assistant");

      let response;

      // =====================================================
      // USER LOGIN
      // =====================================================
      if (role === "USER") {
        response = await api.post("/users/login", {
          email,
          password,
        });

        console.log("User login response:", response.data);

        if (
          !response.data ||
          !response.data.token ||
          !response.data.user ||
          !response.data.user.id
        ) {
          alert("Login failed: Invalid response from backend");
          return;
        }

        // Make sure selected role matches backend role
        if (response.data.user.role !== "USER") {
          alert("This account is not registered as a User.");
          return;
        }

        // Save JWT token
        localStorage.setItem("token", response.data.token);

        // Save user information
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        console.log("User JWT token saved successfully");

        navigate("/dashboard/user");
      }

      // =====================================================
      // ASSISTANT LOGIN
      // =====================================================
      else if (role === "ASSISTANT") {
        response = await api.post("/assistants/login", {
          email,
          password,
        });

        console.log(
          "Assistant login response:",
          response.data
        );

        if (
          !response.data ||
          !response.data.token ||
          !response.data.assistant ||
          !response.data.assistant.id
        ) {
          alert(
            "Login failed: Invalid assistant response from backend"
          );
          return;
        }

        // Save Assistant JWT
        localStorage.setItem(
          "token",
          response.data.token
        );

        // Save Assistant information
        localStorage.setItem(
          "assistant",
          JSON.stringify(response.data.assistant)
        );

        console.log(
          "Assistant JWT saved successfully"
        );

        navigate("/dashboard/assistant");
      }

      // =====================================================
      // ADMIN LOGIN
      // =====================================================
      else if (role === "ADMIN") {
        response = await api.post("/users/login", {
          email,
          password,
        });

        console.log(
          "Admin login response:",
          response.data
        );

        if (
          !response.data ||
          !response.data.token ||
          !response.data.user ||
          !response.data.user.id
        ) {
          alert(
            "Login failed: Invalid response from backend"
          );
          return;
        }

        // IMPORTANT:
        // The account must actually have ADMIN role
        if (response.data.user.role !== "ADMIN") {
          alert(
            "Access denied: This account is not an Admin."
          );
          return;
        }

        // Save Admin JWT
        localStorage.setItem(
          "token",
          response.data.token
        );

        // Save Admin information
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        console.log(
          "Admin JWT saved successfully"
        );

        navigate("/dashboard/admin");
      }
    } catch (error) {
      console.log("Login error:", error);

      if (error.response?.status === 401) {
        alert(
          error.response?.data?.message ||
            "Invalid email or password."
        );
      } else if (error.response?.status === 403) {
        alert(
          "Access denied. You do not have permission to access this account."
        );
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="pm-auth-bg">
      <div className="pm-auth-card">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="pm-auth-header">

          {/* LOGO */}
          <div className="pm-auth-logo">
            <img
              src={logo}
              alt="ParkMate Plus Logo"
            />
          </div>

          {/* BRAND NAME */}
          <div className="pm-auth-brand-name">
            Park<span>Mate</span> Plus
          </div>

          <h1 className="pm-auth-title">
            Welcome back
          </h1>

          <p className="pm-auth-subtitle">
            Sign in to your account to continue
          </p>

        </div>

        {/* =====================================================
            LOGIN FORM
        ===================================================== */}
        <form
          className="pm-form"
          onSubmit={handleLogin}
        >

          {/* =================================================
              ROLE
          ================================================= */}
          <div className="pm-field">

            <label className="pm-label">
              Role
            </label>

            <select
              className="pm-select"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);

                // Clear credentials when switching role
                setEmail("");
                setPassword("");
              }}
            >

              <option value="USER">
                User
              </option>

              <option value="ASSISTANT">
                Assistant
              </option>

              <option value="ADMIN">
                Admin
              </option>

            </select>

          </div>

          {/* =================================================
              EMAIL
          ================================================= */}
          <div className="pm-field">

            <label className="pm-label">
              Email Address
            </label>

            <input
              className="pm-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}
          <div className="pm-field">

            <label className="pm-label">
              Password
            </label>

            <input
              className="pm-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          {/* =================================================
              LOGIN BUTTON
          ================================================= */}
          <div style={{ marginTop: "8px" }}>

            <button
              className="pm-btn pm-btn-primary pm-btn-full"
              type="submit"
            >
              Login
            </button>

          </div>

          <div className="pm-divider" />

          {/* =================================================
              REGISTER LINK
          ================================================= */}
          <p className="pm-auth-footer">

            New to ParkMate?{" "}

            <Link to="/register">
              Create an account
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
};

export default Login;