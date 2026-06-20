import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";

import api from "../services/api";
import Navbar from "../components/Navbar";

const LocationPicker = ({ setParking }) => {
  useMapEvents({
    click(e) {
      setParking({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
};

const CreateBooking = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [vehicles, setVehicles] = useState([]);
  const [pickup, setPickup] = useState(null);
  const [parking, setParking] = useState(null);

  const [booking, setBooking] = useState({
    userId: user?.id,
    vehicleId: "",
    pickupLocation: "",
    parkingLocation: "",
  });

  useEffect(() => {
    loadVehicles();
    getCurrentLocation();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await api.get(`/vehicles/user/${user.id}`);
      setVehicles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPickup({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        alert("Please allow location permission");
      }
    );
  };

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!parking) {
      alert("Please select parking location on map");
      return;
    }

    try {
      const response = await api.post("/bookings/create", {
        ...booking,
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        parkingLat: parking.lat,
        parkingLng: parking.lng,
      });

      alert("Booking Created Successfully\nOTP: " + response.data.otp);
      navigate("/bookings/track");
    } catch (error) {
      alert(error.response?.data?.message || "Parking location must be within 1 km");
      console.log(error);
    }
  };

  if (!pickup) {
    return (
      <>
        <Navbar />
        <div style={styles.page}>
          <h2>Loading your current location...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Create Booking</h1>
            <p style={styles.subtitle}>
              Select your vehicle and choose a parking point within 1 km.
            </p>
          </div>

          <div style={styles.tipCard}>
            <h3>📍 GPS Enabled</h3>
            <p>Click on the map to mark the parking location.</p>
          </div>
        </div>

        <div style={styles.layout}>
          <div style={styles.formCard}>
            <h2>Booking Details</h2>

            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Vehicle</label>
              <select
                style={styles.input}
                name="vehicleId"
                value={booking.vehicleId}
                onChange={handleChange}
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.vehicleNumber} - {vehicle.vehicleType}
                  </option>
                ))}
              </select>

              <label style={styles.label}>Pickup Location</label>
              <input
                style={styles.input}
                name="pickupLocation"
                placeholder="Example: Vidya Nagar Colony"
                value={booking.pickupLocation}
                onChange={handleChange}
                required
              />

              <label style={styles.label}>Parking Location</label>
              <input
                style={styles.input}
                name="parkingLocation"
                placeholder="Example: Betoppers School"
                value={booking.parkingLocation}
                onChange={handleChange}
                required
              />

              <button style={styles.button}>Create Booking</button>
            </form>

            {parking && (
              <div style={styles.coordinateBox}>
                <h3>Selected Location</h3>
                <p>
                  <b>Pickup:</b> {pickup.lat.toFixed(5)}, {pickup.lng.toFixed(5)}
                </p>
                <p>
                  <b>Parking:</b> {parking.lat.toFixed(5)},{" "}
                  {parking.lng.toFixed(5)}
                </p>
              </div>
            )}
          </div>

          <div style={styles.mapCard}>
            <div style={styles.mapHeader}>
              <h2>Choose Parking Location</h2>
              <p>Parking must be within 1 km from pickup point.</p>
            </div>

            <MapContainer
              center={[pickup.lat, pickup.lng]}
              zoom={16}
              style={styles.map}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={[pickup.lat, pickup.lng]} />

              {parking && <Marker position={[parking.lat, parking.lng]} />}

              {parking && (
                <Polyline
                  positions={[
                    [pickup.lat, pickup.lng],
                    [parking.lat, parking.lng],
                  ]}
                />
              )}

              <LocationPicker setParking={setParking} />
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f1720",
    color: "white",
    padding: "38px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "center",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  title: {
    fontSize: "38px",
    marginBottom: "8px",
  },

  subtitle: {
    color: "#9db4cc",
    fontSize: "17px",
  },

  tipCard: {
    background: "#1f2937",
    border: "1px solid rgba(0,194,255,0.25)",
    borderRadius: "16px",
    padding: "20px",
    minWidth: "260px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "420px 1fr",
    gap: "28px",
    alignItems: "start",
  },

  formCard: {
    background: "#1f2937",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid rgba(0,194,255,0.18)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
  },

  label: {
    display: "block",
    marginTop: "16px",
    marginBottom: "8px",
    color: "#9db4cc",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #334155",
    background: "#111827",
    color: "white",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    marginTop: "22px",
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#00c2ff",
    color: "#06111f",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "15px",
  },

  coordinateBox: {
    marginTop: "22px",
    background: "#111827",
    padding: "16px",
    borderRadius: "12px",
    color: "#cbd5e1",
  },

  mapCard: {
    background: "#1f2937",
    padding: "22px",
    borderRadius: "18px",
    border: "1px solid rgba(0,194,255,0.18)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
  },

  mapHeader: {
    marginBottom: "16px",
  },

  map: {
    height: "620px",
    width: "100%",
    borderRadius: "16px",
  },
};

export default CreateBooking;