import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("assistant");

      let response;

      if (role === "USER") {
        response = await api.post("/users/login", {
          email,
          password,
        });

        if (!response.data || !response.data.id) {
          alert("Login failed: User ID not received from backend");
          console.log("User login response:", response.data);
          return;
        }

        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/dashboard/user");
      }

      else if (role === "ASSISTANT") {
        response = await api.post("/assistants/login", {
          email,
        });

        if (!response.data || !response.data.id) {
          alert("Login failed: Assistant ID not received from backend");
          console.log("Assistant login response:", response.data);
          return;
        }

        localStorage.setItem("assistant", JSON.stringify(response.data));
        navigate("/dashboard/assistant");
      }

      else if (role === "ADMIN") {
        localStorage.removeItem("user");
        localStorage.removeItem("assistant");
        navigate("/dashboard/admin");
      }

    } catch (error) {
      alert("Login failed. Check email/password.");
      console.log(error);
    }
  };

  return (
    <div className="pm-auth-bg">
      <div className="pm-auth-card">

        <div className="pm-auth-header">
          <div className="pm-auth-brand">
            <div className="pm-auth-brand-icon">🅿</div>
            <div className="pm-auth-brand-name">
              Park<span>Mate</span> Plus
            </div>
          </div>
          <h1 className="pm-auth-title">Welcome back</h1>
          <p className="pm-auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form className="pm-form" onSubmit={handleLogin}>

          <div className="pm-field">
            <label className="pm-label">Role</label>
            <select
              className="pm-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">User</option>
              <option value="ASSISTANT">Assistant</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="pm-field">
            <label className="pm-label">Email Address</label>
            <input
              className="pm-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {role === "USER" && (
            <div className="pm-field">
              <label className="pm-label">Password</label>
              <input
                className="pm-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div style={{ marginTop: "8px" }}>
            <button className="pm-btn pm-btn-primary pm-btn-full" type="submit">
              Sign In
            </button>
          </div>

          <div className="pm-divider" />

          <p className="pm-auth-footer">
            New to ParkMate?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;