import { useNavigate } from "react-router-dom";
import logo from "../assets/parkmate-logo.png";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* Header */}
      <header className="landing-header">
        <div className="landing-brand">
          <img
            src={logo}
            alt="ParkMate Plus"
            className="landing-logo"
          />

          <span>ParkMate Plus</span>
        </div>

        <button
          className="landing-login-btn"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </header>


      {/* Hero Section */}
      <main className="landing-main">

        <section className="landing-hero">

          <div className="landing-content">

            <div className="landing-badge">
              🅿️ Smart Parking Management
            </div>

            <h1>
              Park Smarter.
              <br />
              <span>Move Safer.</span>
            </h1>

            <p>
              ParkMate Plus makes parking simple with GPS-based
              parking locations, nearby assistants, secure OTP
              verification, and easy vehicle tracking.
            </p>

            <div className="landing-actions">

              <button
                className="landing-primary-btn"
                onClick={() => navigate("/login")}
              >
                Get Started →
              </button>

              <button
                className="landing-secondary-btn"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>

            </div>

          </div>


          {/* Logo / Feature Card */}
          <div className="landing-visual">

            <div className="landing-logo-card">

              <img
                src={logo}
                alt="ParkMate Plus Logo"
                className="landing-main-logo"
              />

              <h2>ParkMate Plus</h2>

              <p>
                Your smart parking assistant
              </p>

              <div className="landing-mini-features">

                <div>
                  📍
                  <span>GPS Parking</span>
                </div>

                <div>
                  🚗
                  <span>Nearby Assistants</span>
                </div>

                <div>
                  🔐
                  <span>Secure OTP</span>
                </div>

                <div>
                  🗺️
                  <span>Vehicle Tracking</span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Features */}
        <section className="landing-features">

          <div className="landing-feature-card">
            <div className="feature-icon">📍</div>
            <h3>GPS Based Parking</h3>
            <p>
              Find nearby parking locations and select a
              suitable parking point using GPS.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="feature-icon">🚗</div>
            <h3>Nearby Assistants</h3>
            <p>
              Discover available parking assistants around
              your location.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="feature-icon">🔐</div>
            <h3>OTP Security</h3>
            <p>
              Verify your parking request securely before
              handing over your vehicle.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Track Your Vehicle</h3>
            <p>
              Follow your booking status and vehicle journey
              through the application.
            </p>
          </div>

        </section>


        {/* Bottom CTA */}
        <section className="landing-cta">

          <h2>
            Ready to make parking easier?
          </h2>

          <p>
            Start using ParkMate Plus today.
          </p>

          <button
            className="landing-primary-btn"
            onClick={() => navigate("/register")}
          >
            Join ParkMate Plus →
          </button>

        </section>

      </main>


      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <img
            src={logo}
            alt="ParkMate Plus"
          />
          <span>ParkMate Plus</span>
        </div>

        <p>
          © 2026 ParkMate Plus. Smart Parking Management System.
        </p>
      </footer>

    </div>
  );
}

export default LandingPage;