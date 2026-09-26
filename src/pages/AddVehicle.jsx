import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const AddVehicle = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    vehicleType: "",
    brand: "",
    color: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert("User session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (
      !vehicle.vehicleNumber.trim() ||
      !vehicle.vehicleType.trim() ||
      !vehicle.brand.trim() ||
      !vehicle.color.trim()
    ) {
      alert("Please fill all required vehicle details.");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/vehicles/add/${user.id}`, {
        vehicleNumber: vehicle.vehicleNumber.trim(),
        vehicleType: vehicle.vehicleType.trim(),
        brand: vehicle.brand.trim(),
        color: vehicle.color.trim(),
        imageUrl: vehicle.imageUrl.trim(),
      });

      alert("Vehicle added successfully 🚗");

      navigate("/dashboard/user");
    } catch (error) {
      console.log("Add vehicle error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to add vehicle";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="pm-page-center">
        <div className="pm-form-card">

          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                fontSize: "2rem",
                marginBottom: "10px",
              }}
            >
              🚗
            </div>

            <h2 className="pm-form-card-title">
              Add Vehicle
            </h2>

            <p className="pm-form-card-subtitle">
              Register a new vehicle to use with ParkMate Plus
            </p>
          </div>

          {/* Vehicle Image Preview */}
          {vehicle.imageUrl.trim() && (
            <div style={{ marginBottom: "20px" }}>
              <img
                src={vehicle.imageUrl}
                alt="Vehicle preview"
                style={styles.preview}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Form */}
          <form
            className="pm-form"
            onSubmit={handleSubmit}
          >

            {/* Vehicle Number */}
            <div className="pm-field">
              <label className="pm-label">
                Vehicle Number
              </label>

              <input
                className="pm-input"
                type="text"
                name="vehicleNumber"
                placeholder="e.g. MH 01 AB 1234"
                value={vehicle.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Vehicle Type */}
            <div className="pm-field">
              <label className="pm-label">
                Vehicle Type
              </label>

              <input
                className="pm-input"
                type="text"
                name="vehicleType"
                placeholder="e.g. Sedan, SUV, Hatchback"
                value={vehicle.vehicleType}
                onChange={handleChange}
                required
              />
            </div>

            {/* Brand */}
            <div className="pm-field">
              <label className="pm-label">
                Brand
              </label>

              <input
                className="pm-input"
                type="text"
                name="brand"
                placeholder="e.g. Toyota, Honda, Hyundai"
                value={vehicle.brand}
                onChange={handleChange}
                required
              />
            </div>

            {/* Color */}
            <div className="pm-field">
              <label className="pm-label">
                Color
              </label>

              <input
                className="pm-input"
                type="text"
                name="color"
                placeholder="e.g. White, Black, Silver"
                value={vehicle.color}
                onChange={handleChange}
                required
              />
            </div>

            {/* Image URL */}
            <div className="pm-field">
              <label className="pm-label">
                Vehicle Image URL
              </label>

              <input
                className="pm-input"
                type="url"
                name="imageUrl"
                placeholder="Paste vehicle image URL"
                value={vehicle.imageUrl}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <div style={{ marginTop: "8px" }}>
              <button
                className="pm-btn pm-btn-primary pm-btn-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding Vehicle..." : "Add Vehicle"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

const styles = {
  preview: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "14px",
    border: "1px solid rgba(0, 194, 255, 0.25)",
    display: "block",
  },
};

export default AddVehicle;