import { Link } from "react-router-dom";
import logo from "../assets/parkmate-logo.png";

const Home = () => {
  return (
    <div className="pm-home">

      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="pm-home-hero">

        <div className="pm-home-content">

          {/* LOGO */}
          <div className="pm-home-logo">
            <img
              src={logo}
              alt="ParkMate Plus"
            />
          </div>

          {/* BRAND */}
          <div className="pm-home-brand">
            Park<span>Mate</span> Plus
          </div>

          {/* TITLE */}
          <h1>
            Smart Parking.
            <br />
            <span>Simple & Stress-Free.</span>
          </h1>

          {/* DESCRIPTION */}
          <p className="pm-home-description">
            ParkMate Plus helps you find parking, connect with
            parking assistants, track your vehicle and manage
            your parking journey with ease.
          </p>

          {/* BUTTONS */}
          <div className="pm-home-actions">

            <Link
              to="/login"
              className="pm-home-btn pm-home-btn-primary"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="pm-home-btn pm-home-btn-secondary"
            >
              Create Account
            </Link>

          </div>

        </div>


        {/* =========================
            FEATURE CARD
        ========================= */}
        <div className="pm-home-feature-card">

          <div className="pm-home-feature">

            <div className="pm-home-feature-icon">
              🅿️
            </div>

            <div>
              <h3>Park</h3>
              <p>
                Find nearby available parking spaces.
              </p>
            </div>

          </div>


          <div className="pm-home-feature">

            <div className="pm-home-feature-icon">
              🚗
            </div>

            <div>
              <h3>Assist</h3>
              <p>
                Connect with available parking assistants.
              </p>
            </div>

          </div>


          <div className="pm-home-feature">

            <div className="pm-home-feature-icon">
              📍
            </div>

            <div>
              <h3>Track</h3>
              <p>
                Track your vehicle and booking status.
              </p>
            </div>

          </div>


          <div className="pm-home-feature">

            <div className="pm-home-feature-icon">
              😌
            </div>

            <div>
              <h3>Relax</h3>
              <p>
                Enjoy a smoother parking experience.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          BOTTOM
      ========================= */}
      <footer className="pm-home-footer">
        <p>
          © 2026 ParkMate Plus · Park • Assist • Track • Relax
        </p>
      </footer>


      {/* =========================
          PAGE CSS
      ========================= */}
      <style>{`

        /* ==========================================
           MAIN PAGE
        ========================================== */

        .pm-home {
          min-height: 100vh;

          background: var(--bg);

          color: var(--text);

          display: flex;

          flex-direction: column;
        }


        /* ==========================================
           HERO
        ========================================== */

        .pm-home-hero {

          flex: 1;

          width: 100%;

          max-width: 1200px;

          margin: 0 auto;

          padding: 70px 40px;

          box-sizing: border-box;

          display: grid;

          grid-template-columns: 1.2fr 0.8fr;

          align-items: center;

          gap: 70px;
        }


        /* ==========================================
           CONTENT
        ========================================== */

        .pm-home-content {
          max-width: 650px;
        }


        /* ==========================================
           LOGO
        ========================================== */

        .pm-home-logo {

          width: 105px;

          height: 105px;

          display: flex;

          align-items: center;

          justify-content: center;

          margin-bottom: 18px;

          border-radius: 24px;

          background: var(--card);

          border: 1px solid var(--border-accent);

          box-shadow: var(--shadow-md);

          overflow: hidden;
        }


        .pm-home-logo img {

          width: 82px !important;

          height: 82px !important;

          max-width: 82px !important;

          max-height: 82px !important;

          object-fit: contain !important;

          display: block !important;

        }


        /* ==========================================
           BRAND
        ========================================== */

        .pm-home-brand {

          font-size: 24px;

          font-weight: 800;

          margin-bottom: 18px;

          color: var(--text);
        }


        .pm-home-brand span {
          color: var(--primary);
        }


        /* ==========================================
           TITLE
        ========================================== */

        .pm-home-content h1 {

          margin: 0;

          font-size: clamp(42px, 6vw, 72px);

          line-height: 1.05;

          letter-spacing: -2px;

          font-weight: 900;

          color: var(--text);
        }


        .pm-home-content h1 span {
          color: var(--primary);
        }


        /* ==========================================
           DESCRIPTION
        ========================================== */

        .pm-home-description {

          max-width: 580px;

          margin-top: 25px;

          margin-bottom: 32px;

          font-size: 18px;

          line-height: 1.7;

          color: var(--text-muted);
        }


        /* ==========================================
           BUTTONS
        ========================================== */

        .pm-home-actions {

          display: flex;

          gap: 15px;

          flex-wrap: wrap;
        }


        .pm-home-btn {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          min-width: 150px;

          padding: 14px 24px;

          border-radius: 10px;

          text-decoration: none;

          font-size: 15px;

          font-weight: 800;

          box-sizing: border-box;

          transition: all 0.2s ease;
        }


        .pm-home-btn-primary {

          background: var(--primary);

          color: #000;

          box-shadow: 0 8px 25px rgba(0, 190, 255, 0.25);
        }


        .pm-home-btn-primary:hover {

          transform: translateY(-2px);

          box-shadow: 0 12px 30px rgba(0, 190, 255, 0.35);
        }


        .pm-home-btn-secondary {

          background: var(--card);

          color: var(--text);

          border: 1px solid var(--border);
        }


        .pm-home-btn-secondary:hover {

          transform: translateY(-2px);

          border-color: var(--primary);

          color: var(--primary);
        }


        /* ==========================================
           FEATURE CARD
        ========================================== */

        .pm-home-feature-card {

          padding: 25px;

          background: var(--card);

          border: 1px solid var(--border-accent);

          border-radius: 22px;

          box-shadow: var(--shadow-md);

          display: flex;

          flex-direction: column;

          gap: 10px;
        }


        /* ==========================================
           FEATURE
        ========================================== */

        .pm-home-feature {

          display: flex;

          align-items: center;

          gap: 16px;

          padding: 18px;

          border-radius: 14px;

          background: var(--input-bg);

          border: 1px solid var(--border);

          transition: transform 0.2s ease;
        }


        .pm-home-feature:hover {

          transform: translateX(4px);

          border-color: var(--border-accent);
        }


        .pm-home-feature-icon {

          width: 48px;

          height: 48px;

          min-width: 48px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 12px;

          background: var(--primary-glow);

          font-size: 24px;
        }


        .pm-home-feature h3 {

          margin: 0 0 5px;

          font-size: 17px;

          color: var(--text);
        }


        .pm-home-feature p {

          margin: 0;

          font-size: 13px;

          line-height: 1.5;

          color: var(--text-muted);
        }


        /* ==========================================
           FOOTER
        ========================================== */

        .pm-home-footer {

          padding: 18px;

          text-align: center;

          border-top: 1px solid var(--border);

          color: var(--text-muted);

          font-size: 13px;
        }


        /* ==========================================
           TABLET
        ========================================== */

        @media (max-width: 900px) {

          .pm-home-hero {

            grid-template-columns: 1fr;

            gap: 40px;

            padding: 55px 30px;
          }


          .pm-home-content {

            max-width: 700px;

            margin: 0 auto;

            text-align: center;
          }


          .pm-home-logo {

            margin-left: auto;

            margin-right: auto;
          }


          .pm-home-description {

            margin-left: auto;

            margin-right: auto;
          }


          .pm-home-actions {

            justify-content: center;
          }


          .pm-home-feature-card {

            max-width: 650px;

            width: 100%;

            margin: 0 auto;

            box-sizing: border-box;
          }

        }


        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 600px) {

          .pm-home-hero {

            padding: 40px 20px;

            gap: 30px;
          }


          .pm-home-logo {

            width: 82px;

            height: 82px;

            border-radius: 18px;
          }


          .pm-home-logo img {

            width: 64px !important;

            height: 64px !important;

            max-width: 64px !important;

            max-height: 64px !important;
          }


          .pm-home-brand {

            font-size: 20px;
          }


          .pm-home-content h1 {

            font-size: 42px;

            letter-spacing: -1.5px;
          }


          .pm-home-description {

            font-size: 16px;

            line-height: 1.6;
          }


          .pm-home-actions {

            flex-direction: column;

            width: 100%;
          }


          .pm-home-btn {

            width: 100%;
          }


          .pm-home-feature-card {

            padding: 15px;
          }


          .pm-home-feature {

            padding: 14px;
          }


          .pm-home-feature-icon {

            width: 42px;

            height: 42px;

            min-width: 42px;

            font-size: 20px;
          }

        }

      `}</style>

    </div>
  );
};

export default Home;