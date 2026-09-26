import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/parkmate-logo.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // =========================
      // USER REGISTRATION
      // =========================
      if (formData.role === "USER") {
        await api.post("/users/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: "USER",
        });
      }

      // =========================
      // ASSISTANT REGISTRATION
      // =========================
      else if (formData.role === "ASSISTANT") {
        await api.post("/assistants/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          status: "AVAILABLE",
          rating: 0,
        });
      }

      alert("Registration successful");

      // Go to login after registration
      navigate("/login");

    } catch (error) {
      console.log("Registration error:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="pm-auth-bg">
      <div className="pm-auth-card">

        <div className="pm-auth-header">

          {/* =========================
              LOGO
          ========================= */}
          <div className="pm-auth-logo">
            <img
              src={logo}
              alt="ParkMate Plus Logo"
            />
          </div>

          {/* =========================
              BRAND NAME
          ========================= */}
          <div className="pm-auth-brand-name">
            Park<span>Mate</span> Plus
          </div>

          <h1 className="pm-auth-title">
            Create account
          </h1>

          <p className="pm-auth-subtitle">
            Join ParkMate Plus today — it's free
          </p>

        </div>

        <form
          className="pm-form"
          onSubmit={handleRegister}
        >

          {/* =========================
              ROLE
          ========================= */}
          <div className="pm-field">

            <label className="pm-label">
              Role
            </label>

            <select
              className="pm-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="USER">
                User
              </option>

              <option value="ASSISTANT">
                Assistant
              </option>

            </select>

          </div>

          {/* =========================
              FULL NAME
          ========================= */}
          <div className="pm-field">

            <label className="pm-label">
              Full Name
            </label>

            <input
              className="pm-input"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* =========================
              EMAIL
          ========================= */}
          <div className="pm-field">

            <label className="pm-label">
              Email Address
            </label>

            <input
              className="pm-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* =========================
              PASSWORD
          ========================= */}
          <div className="pm-field">

            <label className="pm-label">
              Password
            </label>

            <input
              className="pm-input"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

          </div>

          {/* =========================
              PHONE
          ========================= */}
          <div className="pm-field">

            <label className="pm-label">
              Phone Number
            </label>

            <input
              className="pm-input"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>

          {/* =========================
              CREATE ACCOUNT BUTTON
          ========================= */}
          <div style={{ marginTop: "8px" }}>

            <button
              className="pm-btn pm-btn-primary pm-btn-full"
              type="submit"
            >
              Create Account
            </button>

          </div>

          <div className="pm-divider" />

          {/* =========================
              LOGIN LINK
          ========================= */}
          <p className="pm-auth-footer">

            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>

          </p>

        </form>

      </div>
    </div>
  );
};

export default Register;