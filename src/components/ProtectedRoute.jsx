import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const assistant = localStorage.getItem("assistant");

  // No JWT → not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let currentRole = null;

  // Assistant
  if (assistant) {
    try {
      const assistantData = JSON.parse(assistant);
      currentRole = assistantData.role || "ASSISTANT";
    } catch (error) {
      localStorage.removeItem("assistant");
      localStorage.removeItem("token");

      return <Navigate to="/login" replace />;
    }
  }

  // User / Admin
  if (user) {
    try {
      const userData = JSON.parse(user);
      currentRole = userData.role;
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return <Navigate to="/login" replace />;
    }
  }

  // Role does not match
  if (allowedRole && currentRole !== allowedRole) {
    if (currentRole === "USER") {
      return <Navigate to="/dashboard/user" replace />;
    }

    if (currentRole === "ASSISTANT") {
      return <Navigate to="/dashboard/assistant" replace />;
    }

    if (currentRole === "ADMIN") {
      return <Navigate to="/dashboard/admin" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;