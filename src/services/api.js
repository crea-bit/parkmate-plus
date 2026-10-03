import axios from "axios";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://parkmate-plus-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================================
// GET JWT TOKEN
// =====================================================

const getToken = () => {
  /*
   * Assistant login may store the token using different
   * localStorage keys depending on the login implementation.
   *
   * Priority:
   * 1. assistantToken
   * 2. token
   * 3. userToken
   */

  const assistantToken = localStorage.getItem("assistantToken");

  if (assistantToken) {
    return assistantToken;
  }

  const token = localStorage.getItem("token");

  if (token) {
    return token;
  }

  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    return userToken;
  }

  return null;
};

// =====================================================
// REQUEST INTERCEPTOR
// Attach JWT to EVERY API request
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status = error.response?.status;

    // -------------------------------------------------
    // 401 = TOKEN INVALID / EXPIRED
    // -------------------------------------------------

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("assistantToken");
      localStorage.removeItem("userToken");

      localStorage.removeItem("user");
      localStorage.removeItem("assistant");

      window.location.href = "/login";
    }

    // -------------------------------------------------
    // 403 = AUTHENTICATED BUT WRONG ROLE
    // IMPORTANT:
    // Do NOT logout automatically here.
    // -------------------------------------------------

    if (status === 403) {
      console.error(
        "403 Forbidden - Check Assistant JWT / role / endpoint permissions"
      );
    }

    return Promise.reject(error);
  }
);

export default api;