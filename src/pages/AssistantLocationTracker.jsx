import { useEffect, useRef, useState } from "react";
import api from "../services/api";

const AssistantLocationTracker = () => {

  const [tracking, setTracking] =
    useState(false);

  const [error, setError] =
    useState("");

  const intervalRef =
    useRef(null);


  // =========================================================
  // GET ASSISTANT
  // =========================================================

  const getAssistant = () => {

    try {

      return JSON.parse(
        localStorage.getItem("assistant")
      );

    } catch (error) {

      console.error(
        "Unable to read assistant data:",
        error
      );

      return null;
    }
  };


  // =========================================================
  // UPDATE LOCATION
  // =========================================================

  const updateLocation = () => {

    const assistant =
      getAssistant();

    if (!assistant?.id) {

      setError(
        "Assistant information not found."
      );

      return;
    }


    if (!navigator.geolocation) {

      setError(
        "Geolocation is not supported by this browser."
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const latitude =
              position.coords.latitude;

          const longitude =
              position.coords.longitude;


          await api.put(
            `/assistants/${assistant.id}/location`,
            {
              latitude,
              longitude,
            }
          );


          setTracking(true);

          setError("");


          console.log(
            "Assistant location updated:",
            latitude,
            longitude
          );

        } catch (error) {

          console.error(
            "Location update failed:",
            error
          );

          setTracking(false);

          setError(
            error.response?.data?.message ||
            "Unable to update assistant location"
          );
        }
      },


      (locationError) => {

        console.error(
          "GPS error:",
          locationError
        );

        setTracking(false);


        if (
          locationError.code ===
          locationError.PERMISSION_DENIED
        ) {

          setError(
            "Location permission denied."
          );

        } else if (
          locationError.code ===
          locationError.POSITION_UNAVAILABLE
        ) {

          setError(
            "Location information unavailable."
          );

        } else if (
          locationError.code ===
          locationError.TIMEOUT
        ) {

          setError(
            "Location request timed out."
          );

        } else {

          setError(
            "Unable to get current location."
          );
        }
      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  };


  // =========================================================
  // START TRACKING
  // =========================================================

  useEffect(() => {

    const assistant =
      getAssistant();

    if (!assistant?.id) {
      return;
    }


    // Immediate update
    updateLocation();


    // Every 10 seconds
    intervalRef.current =
      setInterval(
        updateLocation,
        10000
      );


    return () => {

      if (intervalRef.current) {

        clearInterval(
          intervalRef.current
        );
      }
    };

  }, []);


  // =========================================================
  // UI
  // =========================================================

  return (

    <div style={styles.container}>

      <div style={styles.title}>
        📍 Assistant Location
      </div>


      {tracking ? (

        <div style={styles.success}>
          🟢 Location sharing active
        </div>

      ) : (

        <div style={styles.waiting}>
          🟡 Getting your location...
        </div>

      )}


      {error && (

        <div style={styles.error}>
          ⚠️ {error}
        </div>

      )}

    </div>
  );
};


// =========================================================
// STYLES
// =========================================================

const styles = {

  container: {
    background: "#111827",
    border:
      "1px solid rgba(0,194,255,0.18)",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "18px",
  },

  title: {
    color: "white",
    fontWeight: "bold",
    marginBottom: "6px",
  },

  success: {
    color: "#22c55e",
    fontSize: "14px",
  },

  waiting: {
    color: "#facc15",
    fontSize: "14px",
  },

  error: {
    color: "#ef4444",
    fontSize: "13px",
    marginTop: "6px",
  },
};

export default AssistantLocationTracker;