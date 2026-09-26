export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("assistant");

  window.location.href = "/login";
};