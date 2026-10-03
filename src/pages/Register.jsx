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
    confirmPassword: "",
    phone: "",
    role: "USER",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // =========================
    // CONFIRM PASSWORD
    // =========================
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // =========================
    // PASSWORD LENGTH
    // =========================
    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

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

        {/* =========================
            HEADER
        ========================= */}
        <div className="pm-auth-header">

          <div className="pm-auth-logo">
            <img
              src={logo}
              alt="ParkMate Plus Logo"
            />
          </div>

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

            <div style={styles.passwordWrapper}>

              <input
                className="pm-input"
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                style={styles.passwordInput}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                style={styles.eyeButton}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>

          {/* =========================
              CONFIRM PASSWORD
          ========================= */}
          <div className="pm-field">

            <label className="pm-label">
              Confirm Password
            </label>

            <div style={styles.passwordWrapper}>

              <input
                className="pm-input"
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                style={styles.passwordInput}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                style={styles.eyeButton}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>

            </div>

          </div>

          {/* =========================
              PASSWORD MATCH MESSAGE
          ========================= */}
          {formData.confirmPassword &&
            formData.password !==
              formData.confirmPassword && (
              <p style={styles.passwordError}>
                ⚠️ Passwords do not match
              </p>
            )}

          {formData.confirmPassword &&
            formData.password ===
              formData.confirmPassword && (
              <p style={styles.passwordSuccess}>
                ✅ Passwords match
              </p>
            )}

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
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              required
            />

          </div>

          {/* =========================
              CREATE ACCOUNT
          ========================= */}
          <div style={{ marginTop: "8px" }}>

            <button
              className="pm-btn pm-btn-primary pm-btn-full"
              type="submit"
              disabled={
                formData.password !==
                formData.confirmPassword
              }
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

const styles = {
  passwordWrapper: {
    position: "relative",
    width: "100%",
  },

  passwordInput: {
    paddingRight: "55px",
  },

  eyeButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "5px",
  },

  passwordError: {
    color: "#ff6b6b",
    fontSize: "13px",
    marginTop: "-8px",
    marginBottom: "12px",
  },

  passwordSuccess: {
    color: "#22c55e",
    fontSize: "13px",
    marginTop: "-8px",
    marginBottom: "12px",
  },
};

export default Register;