import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";
import logo from "../assets/parkmate-logo.png";

const Register = () => {

  const navigate = useNavigate();

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "USER",
  });

  // =========================================================
  // PASSWORD VISIBILITY
  // =========================================================

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================================
  // SUBMITTING STATE
  // Prevents double click / double tap
  // =========================================================

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = async (e) => {

    e.preventDefault();

    // =======================================================
    // PREVENT DOUBLE SUBMISSION
    // =======================================================

    if (isSubmitting) {
      return;
    }

    // =======================================================
    // CONFIRM PASSWORD
    // =======================================================

    if (formData.password !== formData.confirmPassword) {

      alert("Passwords do not match.");

      return;
    }

    // =======================================================
    // PASSWORD LENGTH
    // =======================================================

    if (formData.password.length < 6) {

      alert("Password must contain at least 6 characters.");

      return;
    }

    // =======================================================
    // START SUBMITTING
    // =======================================================

    setIsSubmitting(true);

    try {

      // =====================================================
      // USER REGISTRATION
      // =====================================================

      if (formData.role === "USER") {

        await api.post("/users/register", {

          name: formData.name,

          email: formData.email,

          password: formData.password,

          phone: formData.phone,

          role: "USER",

        });

      }

      // =====================================================
      // ASSISTANT REGISTRATION
      // =====================================================

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

      // =====================================================
      // SUCCESS
      // =====================================================

      alert("Registration successful");

      // Navigate only after successful registration
      navigate("/login");

    }

    // =======================================================
    // REGISTRATION ERROR
    // =======================================================

    catch (error) {

      console.error(
        "Registration error:",
        error
      );

      // -----------------------------------------------------
      // Backend returned a message
      // -----------------------------------------------------

      if (error.response?.data?.message) {

        alert(
          error.response.data.message
        );

      }

      // -----------------------------------------------------
      // Backend returned plain text
      // -----------------------------------------------------

      else if (
        typeof error.response?.data === "string"
      ) {

        alert(
          error.response.data
        );

      }

      // -----------------------------------------------------
      // Other error
      // -----------------------------------------------------

      else {

        alert(
          "Registration failed. Please check your internet connection and try again."
        );

      }

    }

    // =======================================================
    // ALWAYS ENABLE BUTTON AGAIN
    // =======================================================

    finally {

      setIsSubmitting(false);

    }

  };

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="pm-auth-bg">

      <div className="pm-auth-card">

        {/* =================================================
            HEADER
        ================================================= */}

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

        {/* =================================================
            REGISTRATION FORM
        ================================================= */}

        <form
          className="pm-form"
          onSubmit={handleRegister}
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
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isSubmitting}
            >

              <option value="USER">

                User

              </option>

              <option value="ASSISTANT">

                Assistant

              </option>

            </select>

          </div>

          {/* =================================================
              FULL NAME
          ================================================= */}

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
              disabled={isSubmitting}
            />

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
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >

                {showPassword ? "🙈" : "👁️"}

              </button>

            </div>

          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >

                {showConfirmPassword
                  ? "🙈"
                  : "👁️"}

              </button>

            </div>

          </div>

          {/* =================================================
              PASSWORD MATCH MESSAGE
          ================================================= */}

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

          {/* =================================================
              PHONE
          ================================================= */}

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
              disabled={isSubmitting}
            />

          </div>

          {/* =================================================
              CREATE ACCOUNT
          ================================================= */}

          <div style={{ marginTop: "8px" }}>

            <button
              className="pm-btn pm-btn-primary pm-btn-full"
              type="submit"
              disabled={
                isSubmitting ||
                formData.password !==
                  formData.confirmPassword
              }
            >

              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </div>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="pm-divider" />

          {/* =================================================
              LOGIN LINK
          ================================================= */}

          <p className="pm-auth-footer">

            Already have an account?{" "}

            <Link
              to="/login"
              onClick={(e) => {
                if (isSubmitting) {
                  e.preventDefault();
                }
              }}
            >

              Login

            </Link>

          </p>

        </form>

      </div>

    </div>

  );

};

// =========================================================
// STYLES
// =========================================================

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