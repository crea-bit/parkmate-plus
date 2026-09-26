import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Rating = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);

  const [ratingData, setRatingData] = useState({
    bookingId: "",
    userId: user?.id || "",
    assistantId: "",
    rating: "",
    feedback: "",
  });

  // --------------------------------------------------
  // Load User Bookings
  // --------------------------------------------------

  const loadBookings = async () => {
    if (!user?.id) {
      alert("User session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await api.get(
        `/bookings/user/${user.id}`
      );

      setBookings(response.data || []);
    } catch (error) {
      console.log("Load bookings error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load bookings"
      );
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // --------------------------------------------------
  // Booking Selection
  // --------------------------------------------------

  const handleBookingChange = (e) => {
    const bookingId = e.target.value;

    const selectedBooking = bookings.find(
      (booking) =>
        booking.id === Number(bookingId)
    );

    setRatingData((prev) => ({
      ...prev,
      bookingId,
      assistantId:
        selectedBooking?.assistantId || "",
    }));

    // Reset rating when changing booking
    setHoveredStar(0);
  };

  // --------------------------------------------------
  // Feedback Change
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRatingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Star Selection
  // --------------------------------------------------

  const handleStarClick = (star) => {
    setRatingData((prev) => ({
      ...prev,
      rating: String(star),
    }));
  };

  // --------------------------------------------------
  // Submit Rating
  // --------------------------------------------------

  const submitRating = async (e) => {
    e.preventDefault();

    if (!ratingData.bookingId) {
      alert("Please select a completed booking.");
      return;
    }

    if (!ratingData.assistantId) {
      alert("No assistant is assigned to this booking.");
      return;
    }

    if (!ratingData.rating) {
      alert("Please select a rating.");
      return;
    }

    if (!ratingData.feedback.trim()) {
      alert("Please enter your feedback.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/ratings/add", {
        bookingId: Number(ratingData.bookingId),
        userId: Number(user.id),
        assistantId: Number(ratingData.assistantId),
        rating: Number(ratingData.rating),
        feedback: ratingData.feedback.trim(),
      });

      alert("Rating submitted successfully ⭐");

      navigate("/dashboard/user");
    } catch (error) {
      console.log("Submit rating error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to submit rating";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Only Completed Bookings With Assistant
  // --------------------------------------------------

  const completedBookings = bookings.filter(
    (booking) =>
      booking.status === "COMPLETED" &&
      booking.assistantId !== null &&
      booking.assistantId !== undefined
  );

  return (
    <>
      <Navbar />

      <div className="pm-page-center">

        <div
          className="pm-form-card"
          style={{ maxWidth: "500px" }}
        >

          {/* Header */}
          <div style={{ marginBottom: "28px" }}>

            <div
              style={{
                fontSize: "2rem",
                marginBottom: "10px",
              }}
            >
              ⭐
            </div>

            <h2 className="pm-form-card-title">
              Rate Your Assistant
            </h2>

            <p className="pm-form-card-subtitle">
              Share your experience with the parking assistant
            </p>

          </div>

          {/* Form */}
          <form
            className="pm-form"
            onSubmit={submitRating}
          >

            {/* Booking Selector */}
            <div className="pm-field">

              <label className="pm-label">
                Select Booking
              </label>

              <select
                className="pm-select"
                value={ratingData.bookingId}
                onChange={handleBookingChange}
                required
              >

                <option value="">
                  -- Choose a completed booking --
                </option>

                {completedBookings.map((booking) => (
                  <option
                    key={booking.id}
                    value={booking.id}
                  >
                    Booking #{booking.id}
                  </option>
                ))}

              </select>

              {completedBookings.length === 0 && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-dim)",
                    marginTop: "6px",
                  }}
                >
                  No completed bookings available to rate.
                </p>
              )}

            </div>

            {/* Assistant ID */}
            <div className="pm-field">

              <label className="pm-label">
                Assistant ID
              </label>

              <input
                className="pm-input"
                type="text"
                value={ratingData.assistantId}
                readOnly
                placeholder="Auto-filled on booking selection"
              />

            </div>

            {/* Rating */}
            <div className="pm-field">

              <label className="pm-label">
                Rating
              </label>

              <div className="pm-stars-row">

                {[1, 2, 3, 4, 5].map((star) => (

                  <span
                    key={star}
                    className={
                      "pm-star" +
                      (
                        star <=
                        (
                          hoveredStar ||
                          Number(ratingData.rating)
                        )
                          ? " active"
                          : ""
                      )
                    }
                    onMouseEnter={() =>
                      setHoveredStar(star)
                    }
                    onMouseLeave={() =>
                      setHoveredStar(0)
                    }
                    onClick={() =>
                      handleStarClick(star)
                    }
                    role="button"
                    tabIndex={0}
                    aria-label={`Rate ${star} star${
                      star > 1 ? "s" : ""
                    }`}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" ||
                        e.key === " "
                      ) {
                        handleStarClick(star);
                      }
                    }}
                  >
                    ★
                  </span>

                ))}

              </div>

              {ratingData.rating && (
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    marginTop: "6px",
                  }}
                >
                  You selected{" "}

                  <strong
                    style={{
                      color: "#fbbf24",
                    }}
                  >
                    {ratingData.rating} star
                    {Number(ratingData.rating) > 1
                      ? "s"
                      : ""}
                  </strong>

                </p>
              )}

              <input
                type="hidden"
                name="rating"
                value={ratingData.rating}
                required
              />

            </div>

            {/* Feedback */}
            <div className="pm-field">

              <label className="pm-label">
                Feedback
              </label>

              <textarea
                className="pm-textarea"
                name="feedback"
                placeholder="Describe your experience with the assistant..."
                value={ratingData.feedback}
                onChange={handleChange}
                rows="4"
                required
              />

            </div>

            {/* Submit */}
            <div style={{ marginTop: "8px" }}>

              <button
                className="pm-btn pm-btn-primary pm-btn-full"
                type="submit"
                disabled={
                  loading ||
                  !ratingData.bookingId ||
                  !ratingData.rating ||
                  !ratingData.assistantId ||
                  !ratingData.feedback.trim()
                }
              >
                {loading
                  ? "Submitting..."
                  : "Submit Rating"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default Rating;