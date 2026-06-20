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

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/vehicles/add/${user.id}`, vehicle);
      alert("Vehicle added successfully");
      navigate("/dashboard/user");
    } catch (error) {
      alert("Failed to add vehicle");
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="pm-page-center">
        <div className="pm-form-card">
          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🚗</div>
            <h2 className="pm-form-card-title">Add Vehicle</h2>
            <p className="pm-form-card-subtitle">
              Register a new vehicle to use with ParkMate Plus
            </p>
          </div>

          {vehicle.imageUrl && (
            <img
              src={vehicle.imageUrl}
              alt="Vehicle preview"
              style={styles.preview}
            />
          )}

          <form className="pm-form" onSubmit={handleSubmit}>
            <div className="pm-field">
              <label className="pm-label">Vehicle Number</label>
              <input
                className="pm-input"
                name="vehicleNumber"
                placeholder="e.g. MH 01 AB 1234"
                value={vehicle.vehicleNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pm-field">
              <label className="pm-label">Vehicle Type</label>
              <input
                className="pm-input"
                name="vehicleType"
                placeholder="e.g. Sedan, SUV, Hatchback"
                value={vehicle.vehicleType}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pm-field">
              <label className="pm-label">Brand</label>
              <input
                className="pm-input"
                name="brand"
                placeholder="e.g. Toyota, Honda, Hyundai"
                value={vehicle.brand}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pm-field">
              <label className="pm-label">Color</label>
              <input
                className="pm-input"
                name="color"
                placeholder="e.g. White, Black, Silver"
                value={vehicle.color}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pm-field">
              <label className="pm-label">Vehicle Image URL</label>
              <input
                className="pm-input"
                name="imageUrl"
                placeholder="Paste vehicle image URL"
                value={vehicle.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginTop: "8px" }}>
              <button className="pm-btn pm-btn-primary pm-btn-full" type="submit">
                Add Vehicle
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
    marginBottom: "20px",
    border: "1px solid rgba(0,194,255,0.25)",
  },
};

export default AddVehicle;