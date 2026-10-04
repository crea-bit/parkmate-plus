import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const AddVehicle = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    vehicleType: "",
    brand: "",
    color: "",
    imageUrl: "",
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // =====================================================
  // HANDLE TEXT INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // RESIZE + COMPRESS IMAGE
  // =====================================================

  const processImage = (file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    setImageLoading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const maxWidth = 900;
        const maxHeight = 900;

        let width = img.width;
        let height = img.height;

        // Keep original aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;

          const ratio = Math.min(
            widthRatio,
            heightRatio
          );

          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        // =====================================================
        // CREATE COMPRESSED JPEG FILE
        // =====================================================

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              alert("Unable to process image.");
              setImageLoading(false);
              return;
            }

            const compressedFile = new File(
              [blob],
              "vehicle-photo.jpg",
              {
                type: "image/jpeg",
              }
            );

            // Preview image
            const previewUrl =
              URL.createObjectURL(blob);

            setVehicle((prev) => ({
              ...prev,
              imageUrl: previewUrl,
              imageFile: compressedFile,
            }));

            setImageLoading(false);
          },
          "image/jpeg",
          0.75
        );
      };

      img.onerror = () => {
        alert(
          "Unable to process the selected image."
        );

        setImageLoading(false);
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      alert("Failed to read image.");
      setImageLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // GALLERY
  // =====================================================

  const handleGalleryChange = (e) => {
    const file = e.target.files?.[0];

    processImage(file);

    // Allow same image to be selected again
    e.target.value = "";
  };

  // =====================================================
  // CAMERA
  // =====================================================

  const handleCameraChange = (e) => {
    const file = e.target.files?.[0];

    processImage(file);

    // Allow taking another photo
    e.target.value = "";
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = () => {
    setVehicle((prev) => ({
      ...prev,
      imageUrl: "",
      imageFile: null,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      alert(
        "User session expired. Please login again."
      );

      navigate("/login");
      return;
    }

    if (
      !vehicle.vehicleNumber.trim() ||
      !vehicle.vehicleType.trim() ||
      !vehicle.brand.trim() ||
      !vehicle.color.trim()
    ) {
      alert(
        "Please fill all required vehicle details."
      );

      return;
    }

    try {
      setLoading(true);

      // =====================================================
      // CREATE FORM DATA
      // =====================================================

      const formData = new FormData();

      // Vehicle JSON
      const vehicleData = {
        vehicleNumber:
          vehicle.vehicleNumber.trim(),

        vehicleType:
          vehicle.vehicleType.trim(),

        brand:
          vehicle.brand.trim(),

        color:
          vehicle.color.trim(),
      };

      const vehicleBlob = new Blob(
        [JSON.stringify(vehicleData)],
        {
          type: "application/json",
        }
      );

      formData.append(
        "vehicle",
        vehicleBlob
      );

      // =====================================================
      // ADD IMAGE FILE
      // =====================================================

      if (vehicle.imageFile) {
        formData.append(
          "image",
          vehicle.imageFile
        );
      }

      // =====================================================
      // SEND TO BACKEND
      // =====================================================

      await api.post(
        "/vehicles/add",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Vehicle added successfully 🚗"
      );

      navigate("/dashboard/user");

    } catch (error) {
      console.log(
        "Add vehicle error:",
        error
      );

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

          {/* =========================
              HEADER
          ========================= */}

          <div
            style={{
              marginBottom: "28px",
            }}
          >

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
              Register a new vehicle to use with
              ParkMate Plus
            </p>

          </div>


          {/* =========================
              IMAGE PREVIEW
          ========================= */}

          {vehicle.imageUrl && (
            <div
              style={
                styles.previewContainer
              }
            >

              <img
                src={vehicle.imageUrl}
                alt="Vehicle preview"
                style={styles.preview}
              />

              <button
                type="button"
                onClick={removeImage}
                style={styles.removeButton}
              >
                ✕ Remove Photo
              </button>

            </div>
          )}


          {/* =========================
              FORM
          ========================= */}

          <form
            className="pm-form"
            onSubmit={handleSubmit}
          >

            {/* VEHICLE NUMBER */}

            <div className="pm-field">

              <label className="pm-label">
                Vehicle Number
              </label>

              <input
                className="pm-input"
                type="text"
                name="vehicleNumber"
                placeholder="e.g. MH 01 AB 1234"
                value={
                  vehicle.vehicleNumber
                }
                onChange={handleChange}
                required
              />

            </div>


            {/* VEHICLE TYPE */}

            <div className="pm-field">

              <label className="pm-label">
                Vehicle Type
              </label>

              <input
                className="pm-input"
                type="text"
                name="vehicleType"
                placeholder="e.g. Sedan, SUV, Hatchback"
                value={
                  vehicle.vehicleType
                }
                onChange={handleChange}
                required
              />

            </div>


            {/* BRAND */}

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


            {/* COLOR */}

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


            {/* =========================
                VEHICLE IMAGE
            ========================= */}

            <div className="pm-field">

              <label className="pm-label">
                Vehicle Image
              </label>


              {/* Gallery */}

              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleGalleryChange
                }
                style={{
                  display: "none",
                }}
              />


              {/* Camera */}

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={
                  handleCameraChange
                }
                style={{
                  display: "none",
                }}
              />


              {/* Buttons */}

              <div
                style={
                  styles.imageButtons
                }
              >

                <button
                  type="button"
                  onClick={() =>
                    galleryInputRef.current?.click()
                  }
                  style={
                    styles.imageButton
                  }
                  disabled={imageLoading}
                >
                  🖼️ Choose from Gallery
                </button>


                <button
                  type="button"
                  onClick={() =>
                    cameraInputRef.current?.click()
                  }
                  style={
                    styles.imageButton
                  }
                  disabled={imageLoading}
                >
                  📸 Take Photo
                </button>

              </div>


              <p style={styles.imageHint}>
                Choose an existing vehicle
                photo or take a new photo.
              </p>


              {imageLoading && (
                <p style={styles.loadingText}>
                  Processing image...
                </p>
              )}

            </div>


            {/* =========================
                SUBMIT
            ========================= */}

            <div
              style={{
                marginTop: "8px",
              }}
            >

              <button
                className="pm-btn pm-btn-primary pm-btn-full"
                type="submit"
                disabled={
                  loading ||
                  imageLoading
                }
              >

                {loading
                  ? "Uploading Vehicle..."
                  : "Add Vehicle"}

              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
};


// =====================================================
// STYLES
// =====================================================

const styles = {

  previewContainer: {
    marginBottom: "22px",
    textAlign: "center",
  },

  preview: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "14px",
    border:
      "1px solid rgba(0, 194, 255, 0.25)",
    display: "block",
  },

  removeButton: {
    marginTop: "10px",
    background: "transparent",
    border:
      "1px solid rgba(255, 100, 100, 0.5)",
    color: "#ff7777",
    borderRadius: "10px",
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: "600",
  },

  imageButtons: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  imageButton: {
    padding: "14px 10px",
    borderRadius: "12px",
    border:
      "1px solid rgba(0, 194, 255, 0.35)",
    background: "#111827",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  imageHint: {
    color: "#9db4cc",
    fontSize: "13px",
    marginTop: "10px",
    lineHeight: "1.5",
  },

  loadingText: {
    color: "#00c2ff",
    fontSize: "13px",
    marginTop: "8px",
  },
};

export default AddVehicle;