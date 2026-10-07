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
// PUBLIC ENDPOINTS
// These endpoints DO NOT need JWT
// =====================================================

const PUBLIC_ENDPOINTS = [

  "/users/register",
  "/users/login",

  "/assistants/register",
  "/assistants/login",

];

// =====================================================
// CHECK WHETHER REQUEST IS PUBLIC
// =====================================================

const isPublicEndpoint = (url) => {

  if (!url) {
    return false;
  }

  return PUBLIC_ENDPOINTS.some(
    (endpoint) =>
      url === endpoint ||
      url.startsWith(`${endpoint}?`)
  );

};

// =====================================================
// GET JWT TOKEN
// =====================================================

const getToken = () => {

  // ===================================================
  // CHECK WHICH ACCOUNT IS LOGGED IN
  // ===================================================

  const user =
    localStorage.getItem("user");

  const assistant =
    localStorage.getItem("assistant");

  // ===================================================
  // USER
  // ===================================================

  if (user) {

    const token =
      localStorage.getItem("token");

    if (token) {
      return token;
    }

    const userToken =
      localStorage.getItem("userToken");

    if (userToken) {
      return userToken;
    }

  }

  // ===================================================
  // ASSISTANT
  // ===================================================

  if (assistant) {

    const assistantToken =
      localStorage.getItem("assistantToken");

    if (assistantToken) {
      return assistantToken;
    }

  }

  // ===================================================
  // FALLBACK
  // ===================================================

  const token =
    localStorage.getItem("token");

  if (token) {
    return token;
  }

  const userToken =
    localStorage.getItem("userToken");

  if (userToken) {
    return userToken;
  }

  const assistantToken =
    localStorage.getItem("assistantToken");

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

    // =================================================
    // PUBLIC AUTH ENDPOINTS
    //
    // Never attach an old JWT to:
    //
    // /users/register
    // /users/login
    // /assistants/register
    // /assistants/login
    // =================================================

    if (
      !isPublicEndpoint(config.url)
    ) {

      const token = getToken();

      // -----------------------------------------------
      // ATTACH JWT
      // -----------------------------------------------

      if (token) {

        config.headers =
          config.headers || {};

        config.headers.Authorization =
          `Bearer ${token}`;

      }

    }

    // =================================================
    // FORM DATA
    //
    // Do NOT force application/json for FormData.
    // Browser automatically creates:
    //
    // multipart/form-data; boundary=...
    // =================================================

    if (
      config.data instanceof FormData
    ) {

      if (config.headers) {

        delete config.headers[
          "Content-Type"
        ];

      }

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

    const status =
      error.response?.status;

    // =================================================
    // 401 = TOKEN INVALID / EXPIRED
    // =================================================

    if (status === 401) {

      localStorage.removeItem("token");

      localStorage.removeItem(
        "assistantToken"
      );

      localStorage.removeItem(
        "userToken"
      );

      localStorage.removeItem("user");

      localStorage.removeItem(
        "assistant"
      );

      window.location.href =
        "/login";

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