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
  // Check which account is actually logged in.
  // USER login uses "token".
  // ASSISTANT login uses "assistantToken".

  const user = localStorage.getItem("user");
  const assistant = localStorage.getItem("assistant");

  // ---------------------------------------------------
  // USER
  // ---------------------------------------------------

  if (user) {
    const token = localStorage.getItem("token");

    if (token) {
      return token;
    }

    const userToken = localStorage.getItem("userToken");

    if (userToken) {
      return userToken;
    }
  }

  // ---------------------------------------------------
  // ASSISTANT
  // ---------------------------------------------------

  if (assistant) {
    const assistantToken = localStorage.getItem("assistantToken");

    if (assistantToken) {
      return assistantToken;
    }
  }

  // ---------------------------------------------------
  // FALLBACK
  // ---------------------------------------------------

  const token = localStorage.getItem("token");

  if (token) {
    return token;
  }

  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    return userToken;
  }

  const assistantToken = localStorage.getItem("assistantToken");

  if (assistantToken) {
    return assistantToken;
  }

  return null;
};

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    // -------------------------------------------------
    // Attach JWT
    // -------------------------------------------------

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // -------------------------------------------------
    // IMPORTANT FOR CLOUDINARY / FORM DATA
    //
    // Axios must NOT force application/json when
    // sending FormData.
    //
    // Browser will automatically create:
    // multipart/form-data; boundary=...
    // -------------------------------------------------

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
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

    // =================================================
    // 401 = TOKEN INVALID / EXPIRED
    // =================================================

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("assistantToken");
      localStorage.removeItem("userToken");

      localStorage.removeItem("user");
      localStorage.removeItem("assistant");

      window.location.href = "/login";
    }

    // =================================================
    // 403 = FORBIDDEN
    // =================================================

    if (status === 403) {
      console.error(
        "403 Forbidden - Check JWT role / endpoint permissions"
      );
    }

    return Promise.reject(error);
  }
);

// =====================================================
// EXPORT
// =====================================================

export default api;