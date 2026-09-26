import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";


// ============================================================
// MAP CLICK COMPONENT
// ============================================================

const LocationPicker = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};


// ============================================================
// MAP RESIZE FIX
// Recalculate Leaflet size after the responsive layout changes
// from desktop/two-column to mobile/one-column.
// ============================================================

const MapResizeFix = () => {
  const map = useMap();

  useEffect(() => {
    const refreshMapSize = () => {
      map.invalidateSize({ animate: false });
    };

    // Run immediately and again after the mobile layout settles.
    refreshMapSize();
    const timer1 = setTimeout(refreshMapSize, 100);
    const timer2 = setTimeout(refreshMapSize, 400);

    window.addEventListener("resize", refreshMapSize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("resize", refreshMapSize);
    };
  }, [map]);

  return null;
};


// ============================================================
// CREATE BOOKING
// ============================================================

const CreateBooking = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "dark"
  );

  const [vehicles, setVehicles] = useState([]);
  const [parkingLocations, setParkingLocations] = useState([]);
  const [nearbyAssistants, setNearbyAssistants] = useState([]);

  const [selectedAssistant, setSelectedAssistant] = useState(null);

  const [pickup, setPickup] = useState({
    lat: null,
    lng: null,
  });

  const [parking, setParking] = useState({
    lat: null,
    lng: null,
  });

  const [booking, setBooking] = useState({
    vehicleId: "",
    pickupLocation: "",
    parkingLocation: "",
  });

  const [loading, setLoading] = useState(false);

  // ============================================================
  // THEME DETECTION
  // ============================================================

  useEffect(() => {
    const updateTheme = () => {
      setTheme(
        document.documentElement.getAttribute("data-theme") || "dark"
      );
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);


  // ============================================================
  // THEME COLORS
  // ============================================================

  const isLight = theme === "light";

  const colors = {
    page: isLight ? "#f4f7fb" : "#0f1720",

    card: isLight ? "#ffffff" : "#1f2937",

    cardSecondary: isLight ? "#f8fbff" : "#182334",

    input: isLight ? "#ffffff" : "#0f172a",

    inputHover: isLight ? "#f8fbff" : "#162033",

    border: isLight
      ? "rgba(15,23,42,0.15)"
      : "rgba(255,255,255,0.10)",

    borderBlue: isLight
      ? "rgba(0,119,168,0.30)"
      : "rgba(0,194,255,0.30)",

    text: isLight ? "#172033" : "#f8fafc",

    textMuted: isLight ? "#607086" : "#9db4cc",

    textDim: isLight ? "#7b8798" : "#64748b",

    primary: isLight ? "#0077a8" : "#00c2ff",

    primaryButton: isLight
      ? "linear-gradient(135deg,#008fc4,#0073a0)"
      : "linear-gradient(135deg,#00c2ff,#0099cc)",

    shadow: isLight
      ? "0 8px 30px rgba(15,23,42,0.08)"
      : "0 8px 30px rgba(0,0,0,0.30)",

    mapBorder: isLight
      ? "1px solid rgba(15,23,42,0.12)"
      : "1px solid rgba(255,255,255,0.08)",
  };


  // ============================================================
  // LOAD VEHICLES
  // ============================================================

  const loadVehicles = async () => {
    if (!user?.id) return;

    try {
      const response = await api.get(`/vehicles/user/${user.id}`);
      setVehicles(response.data || []);
    } catch (error) {
      console.log("Vehicle loading error:", error);
    }
  };


  // ============================================================
  // GET CURRENT LOCATION
  // ============================================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("GPS is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setPickup({
          lat,
          lng,
        });

        loadNearbyData(lat, lng);
      },
      (error) => {
        console.log("GPS error:", error);

        // Fallback location
        const fallbackLat = 17.42182;
        const fallbackLng = 78.64404;

        setPickup({
          lat: fallbackLat,
          lng: fallbackLng,
        });

        loadNearbyData(fallbackLat, fallbackLng);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };


  // ============================================================
  // LOAD NEARBY PARKING + ASSISTANTS
  // ============================================================

  const loadNearbyData = async (lat, lng) => {
    try {
      const [parkingResponse, assistantResponse] = await Promise.all([
        api.get(
          `/parking/nearby?lat=${lat}&lng=${lng}&radius=2`
        ),
        api.get(
          `/assistants/nearby?lat=${lat}&lng=${lng}&radius=2`
        ),
      ]);

      setParkingLocations(parkingResponse.data || []);
      setNearbyAssistants(assistantResponse.data || []);
    } catch (error) {
      console.log("Nearby data error:", error);
    }
  };


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadVehicles();
    getCurrentLocation();
  }, []);


  // ============================================================
  // HANDLE VEHICLE
  // ============================================================

  const handleVehicleChange = (e) => {
    setBooking({
      ...booking,
      vehicleId: e.target.value,
    });
  };


  // ============================================================
  // SELECT PARKING FROM MAP
  // ============================================================

  const selectParkingLocation = (lat, lng) => {
    if (!pickup.lat || !pickup.lng) {
      alert("Waiting for your current GPS location.");
      return;
    }

    const distance = calculateDistance(
      pickup.lat,
      pickup.lng,
      lat,
      lng
    );

    if (distance > 1) {
      alert(
        `Parking location is ${distance.toFixed(
          2
        )} km away.\nPlease select a location within 1 km.`
      );
      return;
    }

    setParking({
      lat,
      lng,
    });

    setBooking({
      ...booking,
      parkingLocation: `Selected parking point (${lat.toFixed(
        5
      )}, ${lng.toFixed(5)})`,
    });
  };


  // ============================================================
  // SELECT PARKING FROM LIST
  // ============================================================

  const selectParkingFromList = (location) => {
    const lat =
      location.latitude ??
      location.lat;

    const lng =
      location.longitude ??
      location.lng;

    if (lat == null || lng == null) {
      return;
    }

    selectParkingLocation(lat, lng);

    setBooking((prev) => ({
      ...prev,
      parkingLocation: location.name || "Nearby Parking",
    }));
  };


  // ============================================================
  // SELECT ASSISTANT
  // ============================================================

  const selectAssistant = (assistant) => {
    setSelectedAssistant(assistant);
  };


  // ============================================================
  // CREATE BOOKING
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!booking.vehicleId) {
      alert("Please select a vehicle.");
      return;
    }

    if (!pickup.lat || !pickup.lng) {
      alert("GPS location is required.");
      return;
    }

    if (!parking.lat || !parking.lng) {
      alert("Please select a parking location from the map.");
      return;
    }

    if (!booking.parkingLocation) {
      alert("Please select a parking location.");
      return;
    }

    const distance = calculateDistance(
      pickup.lat,
      pickup.lng,
      parking.lat,
      parking.lng
    );

    if (distance > 1) {
      alert("Parking location must be within 1 km.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        vehicleId: Number(booking.vehicleId),

        pickupLocation:
          booking.pickupLocation || "Current GPS Location",

        parkingLocation: booking.parkingLocation,

        pickupLat: pickup.lat,
        pickupLng: pickup.lng,

        parkingLat: parking.lat,
        parkingLng: parking.lng,

        assistantId: selectedAssistant
          ? Number(selectedAssistant.id)
          : null,
      };

      const response = await api.post(
        "/bookings/create",
        payload
      );

      alert(
        `Booking created successfully!\n\nBooking ID: ${
          response.data.id
        }\nOTP: ${response.data.otp}`
      );

      setBooking({
        vehicleId: "",
        pickupLocation: "",
        parkingLocation: "",
      });

      setParking({
        lat: null,
        lng: null,
      });

      setSelectedAssistant(null);

      loadNearbyData(pickup.lat, pickup.lng);
    } catch (error) {
      console.log("Booking creation error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to create booking"
      );
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // HAVERSINE DISTANCE
  // ============================================================

  const calculateDistance = (
    lat1,
    lng1,
    lat2,
    lng2
  ) => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };


  // ============================================================
  // MAP CENTER
  // ============================================================

  const mapCenter = pickup.lat && pickup.lng
    ? [pickup.lat, pickup.lng]
    : [17.42182, 78.64404];


  // ============================================================
  // CUSTOM MAP ICONS
  // ============================================================

  const parkingIcon = L.divIcon({
    className: "",
    html: `
      <div style="
        width:34px;
        height:34px;
        border-radius:50%;
        background:#16a34a;
        border:3px solid white;
        box-shadow:0 3px 12px rgba(0,0,0,.35);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-weight:800;
        font-size:16px;
      ">P</div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });


  const assistantIcon = L.divIcon({
    className: "",
    html: `
      <div style="
        width:34px;
        height:34px;
        border-radius:50%;
        background:#ef4444;
        border:3px solid white;
        box-shadow:0 3px 12px rgba(0,0,0,.35);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:16px;
      ">🚗</div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });


  const pickupIcon = L.divIcon({
    className: "",
    html: `
      <div style="
        width:36px;
        height:36px;
        border-radius:50%;
        background:#0077a8;
        border:4px solid white;
        box-shadow:0 3px 14px rgba(0,0,0,.40);
        display:flex;
        align-items:center;
        justify-content:center;
        color:white;
        font-size:17px;
      ">📍</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          background: colors.page,
          color: colors.text,
          padding: "36px",
          transition: "all .25s ease",
        }}
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          style={{
            maxWidth: "1500px",
            margin: "0 auto 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "34px",
                fontWeight: 800,
                margin: 0,
                color: colors.text,
              }}
            >
              Create Booking
            </h1>

            <p
              style={{
                marginTop: "10px",
                color: colors.textMuted,
                fontSize: "15px",
              }}
            >
              Select your vehicle and choose a parking point
              within 1 km.
            </p>
          </div>

          <div
            style={{
              background: colors.card,
              border: `1px solid ${colors.borderBlue}`,
              borderRadius: "14px",
              padding: "16px 22px",
              minWidth: "300px",
              boxShadow: colors.shadow,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: colors.text,
                marginBottom: "6px",
              }}
            >
              📍 GPS Enabled
            </div>

            <div
              style={{
                color: colors.textMuted,
                fontSize: "13px",
              }}
            >
              Nearby parking and available assistants
              within 2 km are shown.
            </div>
          </div>
        </div>


        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div
          className="create-booking-main-grid"
          style={{
            maxWidth: "1500px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "290px minmax(0, 1fr)",
            gap: "22px",
            alignItems: "start",
          }}
        >

          {/* ===================================================
              LEFT BOOKING PANEL
          =================================================== */}

          <div
            className="create-booking-details-panel"
            style={{
              background: colors.card,
              border: `1px solid ${colors.borderBlue}`,
              borderRadius: "16px",
              padding: "20px",
              boxShadow: colors.shadow,
            }}
          >

            <h2
              style={{
                margin: "0 0 22px",
                fontSize: "21px",
                color: colors.text,
              }}
            >
              Booking Details
            </h2>


            {/* VEHICLE */}

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle(colors)}>
                Vehicle
              </label>

              <select
                value={booking.vehicleId}
                onChange={handleVehicleChange}
                style={selectStyle(colors)}
              >
                <option value="">
                  Select Vehicle
                </option>

                {vehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.vehicleNumber} -{" "}
                    {vehicle.vehicleType}
                  </option>
                ))}
              </select>
            </div>


            {/* PICKUP */}

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle(colors)}>
                Pickup Location
              </label>

              <input
                type="text"
                value={booking.pickupLocation}
                onChange={(e) =>
                  setBooking({
                    ...booking,
                    pickupLocation:
                      e.target.value,
                  })
                }
                placeholder="Example: Anurag University Gate"
                style={inputStyle(colors)}
              />
            </div>


            {/* PARKING */}

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle(colors)}>
                Parking Location
              </label>

              <input
                type="text"
                value={booking.parkingLocation}
                readOnly
                placeholder="Select from map or enter name"
                style={{
                  ...inputStyle(colors),
                  cursor: "default",
                }}
              />
            </div>


            {/* SELECTED ASSISTANT */}

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle(colors)}>
                Nearby Assistant
              </label>

              {selectedAssistant ? (
                <div
                  style={{
                    background: isLight
                      ? "#f0f9ff"
                      : "#13263a",
                    border: `1px solid ${colors.borderBlue}`,
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                >
                  <strong
                    style={{
                      color: colors.text,
                      display: "block",
                    }}
                  >
                    🚗 {selectedAssistant.name}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: "5px",
                      color: colors.textMuted,
                      fontSize: "12px",
                    }}
                  >
                    {selectedAssistant.distanceKm != null
                      ? `${Number(
                          selectedAssistant.distanceKm
                        ).toFixed(2)} km away`
                      : "Nearby assistant"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedAssistant(null)
                    }
                    style={{
                      marginTop: "9px",
                      border: "none",
                      background: "transparent",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    Remove selection
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    background: isLight
                      ? "#f8fafc"
                      : "#111827",
                    borderRadius: "10px",
                    padding: "12px",
                    color: colors.textMuted,
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  Select an available assistant
                  from the map or list below.
                </div>
              )}
            </div>


            {/* CREATE BUTTON */}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "10px",
                padding: "13px",
                background: colors.primaryButton,
                color: "#05101a",
                fontWeight: 800,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                opacity: loading ? 0.65 : 1,
                boxShadow:
                  "0 4px 14px rgba(0,194,255,.25)",
              }}
            >
              {loading
                ? "Creating..."
                : "Create Booking"}
            </button>


            {/* =================================================
                NEARBY PARKING
            ================================================= */}

            <div style={{ marginTop: "28px" }}>
              <h3
                style={{
                  margin: "0 0 4px",
                  color: colors.text,
                  fontSize: "17px",
                }}
              >
                🅿️ Nearby Parking
              </h3>

              <p
                style={{
                  margin: "0 0 12px",
                  color: colors.textMuted,
                  fontSize: "12px",
                }}
              >
                Available parking within 2 km
              </p>

              {parkingLocations.length === 0 ? (
                <p
                  style={{
                    color: colors.textDim,
                    fontSize: "13px",
                  }}
                >
                  No nearby parking found.
                </p>
              ) : (
                parkingLocations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() =>
                      selectParkingFromList(
                        location
                      )
                    }
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: colors.cardSecondary,
                      border: `1px solid ${colors.border}`,
                      borderRadius: "10px",
                      padding: "12px",
                      marginBottom: "10px",
                      cursor: "pointer",
                      color: colors.text,
                    }}
                  >
                    <strong
                      style={{
                        display: "block",
                        marginBottom: "7px",
                      }}
                    >
                      🅿️ {location.name}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        color: colors.textMuted,
                        fontSize: "12px",
                        marginBottom: "4px",
                      }}
                    >
                      Available spaces:{" "}
                      {location.availableSpaces ??
                        location.available ??
                        "-"}
                    </span>

                    <span
                      style={{
                        color: colors.primary,
                        fontSize: "12px",
                      }}
                    >
                      📍{" "}
                      {location.distanceKm != null
                        ? `${Number(
                            location.distanceKm
                          ).toFixed(2)} km away`
                        : "Nearby"}
                    </span>
                  </button>
                ))
              )}
            </div>


            {/* =================================================
                NEARBY ASSISTANTS
            ================================================= */}

            <div style={{ marginTop: "28px" }}>
              <h3
                style={{
                  margin: "0 0 4px",
                  color: colors.text,
                  fontSize: "17px",
                }}
              >
                🚗 Nearby Assistants
              </h3>

              <p
                style={{
                  margin: "0 0 12px",
                  color: colors.textMuted,
                  fontSize: "12px",
                }}
              >
                Available assistants within 2 km
              </p>

              {nearbyAssistants.length === 0 ? (
                <p
                  style={{
                    color: colors.textDim,
                    fontSize: "13px",
                  }}
                >
                  No nearby assistants found.
                </p>
              ) : (
                nearbyAssistants.map((assistant) => {
                  const isSelected =
                    selectedAssistant?.id ===
                    assistant.id;

                  return (
                    <div
                      key={assistant.id}
                      style={{
                        background: isSelected
                          ? isLight
                            ? "#e8f7ff"
                            : "#123047"
                          : colors.cardSecondary,
                        border: `1px solid ${
                          isSelected
                            ? colors.primary
                            : colors.border
                        }`,
                        borderRadius: "10px",
                        padding: "12px",
                        marginBottom: "10px",
                      }}
                    >
                      <strong
                        style={{
                          color: colors.text,
                          display: "block",
                        }}
                      >
                        🚗 {assistant.name}
                      </strong>

                      <div
                        style={{
                          color: colors.textMuted,
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        ⭐{" "}
                        {Number(
                          assistant.rating || 0
                        ).toFixed(1)}
                      </div>

                      <div
                        style={{
                          color: colors.textMuted,
                          fontSize: "12px",
                          marginTop: "3px",
                        }}
                      >
                        📍{" "}
                        {assistant.distanceKm != null
                          ? `${Number(
                              assistant.distanceKm
                            ).toFixed(2)} km away`
                          : "Nearby"}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          selectAssistant(
                            assistant
                          )
                        }
                        style={{
                          width: "100%",
                          marginTop: "9px",
                          padding: "8px",
                          borderRadius: "8px",
                          border: "none",
                          background: isSelected
                            ? "#16a34a"
                            : colors.primary,
                          color: "white",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {isSelected
                          ? "✓ Selected"
                          : "Select Assistant"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

          </div>


          {/* ===================================================
              RIGHT MAP
          =================================================== */}

          <div
            className="create-booking-map-panel"
            style={{
              background: colors.card,
              border: `1px solid ${colors.borderBlue}`,
              borderRadius: "16px",
              padding: "14px",
              boxShadow: colors.shadow,
              minWidth: 0,
            }}
          >

            <h2
              style={{
                margin: "0 0 7px",
                color: colors.text,
                fontSize: "22px",
              }}
            >
              Live Parking & Assistant Map
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px",
                color: colors.textMuted,
                fontSize: "13px",
                marginBottom: "10px",
              }}
            >
              <span>🅿️ Parking = available parking</span>
              <span>🚗 Assistant = available assistant</span>
              <span>📍 Click a parking location to select it.</span>
            </div>


            <div
              style={{
                height: "500px",
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
                boxSizing: "border-box",
                borderRadius: "12px",
                border: colors.mapBorder,
              }}
            >
              <MapContainer
                center={mapCenter}
                zoom={15}
                scrollWheelZoom={true}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapResizeFix />

                <LocationPicker
                  onSelect={
                    selectParkingLocation
                  }
                />


                {/* USER LOCATION */}

                {pickup.lat &&
                  pickup.lng && (
                    <>
                      <Marker
                        position={[
                          pickup.lat,
                          pickup.lng,
                        ]}
                        icon={pickupIcon}
                      >
                        <Popup>
                          <strong>
                            Your Current Location
                          </strong>
                        </Popup>
                      </Marker>

                      <Circle
                        center={[
                          pickup.lat,
                          pickup.lng,
                        ]}
                        radius={1000}
                        pathOptions={{
                          color: colors.primary,
                          fillColor:
                            colors.primary,
                          fillOpacity: 0.04,
                          weight: 2,
                        }}
                      />
                    </>
                  )}


                {/* PARKING MARKERS */}

                {parkingLocations.map(
                  (location) => {
                    const lat =
                      location.latitude ??
                      location.lat;

                    const lng =
                      location.longitude ??
                      location.lng;

                    if (
                      lat == null ||
                      lng == null
                    ) {
                      return null;
                    }

                    return (
                      <Marker
                        key={`parking-${location.id}`}
                        position={[lat, lng]}
                        icon={parkingIcon}
                        eventHandlers={{
                          click: () =>
                            selectParkingLocation(
                              lat,
                              lng
                            ),
                        }}
                      >
                        <Popup>
                          <strong>
                            🅿️{" "}
                            {location.name}
                          </strong>

                          <br />

                          Available spaces:{" "}
                          {location.availableSpaces ??
                            "-"}
                        </Popup>
                      </Marker>
                    );
                  }
                )}


                {/* ASSISTANT MARKERS */}

                {nearbyAssistants.map(
                  (assistant) => {
                    const lat =
                      assistant.latitude;

                    const lng =
                      assistant.longitude;

                    if (
                      lat == null ||
                      lng == null
                    ) {
                      return null;
                    }

                    return (
                      <Marker
                        key={`assistant-${assistant.id}`}
                        position={[lat, lng]}
                        icon={assistantIcon}
                        eventHandlers={{
                          click: () =>
                            selectAssistant(
                              assistant
                            ),
                        }}
                      >
                        <Popup>
                          <strong>
                            🚗{" "}
                            {assistant.name}
                          </strong>

                          <br />

                          ⭐{" "}
                          {Number(
                            assistant.rating || 0
                          ).toFixed(1)}

                          <br />

                          📍{" "}
                          {assistant.distanceKm !=
                          null
                            ? `${Number(
                                assistant.distanceKm
                              ).toFixed(
                                2
                              )} km away`
                            : "Nearby"}
                        </Popup>
                      </Marker>
                    );
                  }
                )}


                {/* SELECTED PARKING MARKER */}

                {parking.lat &&
                  parking.lng && (
                    <Marker
                      position={[
                        parking.lat,
                        parking.lng,
                      ]}
                    >
                      <Popup>
                        <strong>
                          📍 Selected Parking
                        </strong>

                        <br />

                        {parking.lat.toFixed(
                          5
                        )}
                        ,{" "}
                        {parking.lng.toFixed(
                          5
                        )}
                      </Popup>
                    </Marker>
                  )}

              </MapContainer>
            </div>

          </div>
        </div>

      <style>{`
        .create-booking-main-grid {
          width: 100%;
          box-sizing: border-box;
        }

        .create-booking-details-panel,
        .create-booking-map-panel {
          min-width: 0;
          box-sizing: border-box;
        }

        .create-booking-map-panel .leaflet-container {
          width: 100% !important;
        }

        @media (max-width: 900px) {
          .create-booking-main-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          .create-booking-map-panel {
            order: 1;
            width: 100%;
          }

          .create-booking-details-panel {
            order: 2;
            width: 100%;
          }

          .create-booking-map-panel .leaflet-container {
            height: 480px !important;
          }
        }

        @media (max-width: 600px) {
          .create-booking-main-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 18px !important;
          }

          .create-booking-map-panel {
            order: 1 !important;
            width: 100% !important;
          }

          .create-booking-details-panel {
            order: 2 !important;
            width: 100% !important;
          }

          .create-booking-map-panel .leaflet-container {
            height: 420px !important;
          }
        }

        @media (max-width: 420px) {
          .create-booking-map-panel .leaflet-container {
            height: 360px !important;
          }
        }
      `}</style>

      </div>
    </>
  );
};


// ============================================================
// STYLE HELPERS
// ============================================================

const labelStyle = (colors) => ({
  display: "block",
  marginBottom: "8px",
  color: colors.textMuted,
  fontSize: "13px",
  fontWeight: 700,
});


const inputStyle = (colors) => ({
  width: "100%",
  boxSizing: "border-box",
  minHeight: "46px",
  padding: "12px 14px",
  background: colors.input,
  color: colors.text,
  border: `1px solid ${colors.border}`,
  borderRadius: "9px",
  fontSize: "14px",
  outline: "none",
});


const selectStyle = (colors) => ({
  width: "100%",
  boxSizing: "border-box",
  minHeight: "46px",
  padding: "12px 14px",
  background: colors.input,
  color: colors.text,
  border: `1px solid ${colors.border}`,
  borderRadius: "9px",
  fontSize: "14px",
  outline: "none",
  cursor: "pointer",
  colorScheme:
    colors.input === "#ffffff"
      ? "light"
      : "dark",
});


export default CreateBooking;