import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Rating = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);

  const [ratingData, setRatingData] = useState({
    bookingId: "",
    userId: user?.id,
    assistantId: "",
    rating: "",
    feedback: "",
  });

  const loadBookings = async () => {
    try {
      const response = await api.get(`/bookings/user/${user.id}`);
      setBookings(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load bookings");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleBookingChange = (e) => {
    const bookingId = e.target.value;

    const selectedBooking = bookings.find(
      (booking) => booking.id === Number(bookingId)
    );

    setRatingData({
      ...ratingData,
      bookingId,
      assistantId: selectedBooking?.assistantId || "",
    });
  };

  const handleChange = (e) => {
    setRatingData({
      ...ratingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarClick = (star) => {
    setRatingData({ ...ratingData, rating: String(star) });
  };

  const submitRating = async (e) => {
    e.preventDefault();

    try {
      await api.post("/ratings/add", {
        bookingId: Number(ratingData.bookingId),
        userId: Number(user.id),
        assistantId: Number(ratingData.assistantId),
        rating: Number(ratingData.rating),
        feedback: ratingData.feedback,
      });

      alert("Rating submitted successfully");
      navigate("/dashboard/user");
    } catch (error) {
      console.log(error);
      alert("Failed to submit rating");
    }
  };

  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED" && b.assistantId !== null
  );

  return (
    <>
      <Navbar />

      <div className="pm-page-center">
        <div className="pm-form-card" style={{ maxWidth: "500px" }}>

          <div style={{ marginBottom: "28px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "10px" }}>⭐</div>
            <h2 className="pm-form-card-title">Rate Your Assistant</h2>
            <p className="pm-form-card-subtitle">
              Share your experience with the parking assistant
            </p>
          </div>

          <form className="pm-form" onSubmit={submitRating}>

            {/* Booking Selector */}
            <div className="pm-field">
              <label className="pm-label">Select Booking</label>
              <select
                className="pm-select"
                value={ratingData.bookingId}
                onChange={handleBookingChange}
                required
              >
                <option value="">-- Choose a completed booking --</option>
                {completedBookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    Booking #{booking.id}
                  </option>
                ))}
              </select>
              {completedBookings.length === 0 && (
                <p style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "4px" }}>
                  No completed bookings available to rate.
                </p>
              )}
            </div>

            {/* Assistant ID (read-only) */}
            <div className="pm-field">
              <label className="pm-label">Assistant ID</label>
              <input
                className="pm-input"
                value={ratingData.assistantId}
                readOnly
                placeholder="Auto-filled on booking selection"
              />
            </div>

            {/* Star Rating */}
            <div className="pm-field">
              <label className="pm-label">Rating</label>
              <div className="pm-stars-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      "pm-star" +
                      (star <= (hoveredStar || Number(ratingData.rating))
                        ? " active"
                        : "")
                    }
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleStarClick(star)}
                    role="button"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {ratingData.rating && (
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
                  You selected{" "}
                  <strong style={{ color: "#fbbf24" }}>
                    {ratingData.rating} star{ratingData.rating > 1 ? "s" : ""}
                  </strong>
                </p>
              )}
              {/* Hidden input to carry value for form validation */}
              <input
                type="hidden"
                name="rating"
                value={ratingData.rating}
                required
              />
            </div>

            {/* Feedback */}
            <div className="pm-field">
              <label className="pm-label">Feedback</label>
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

            <div style={{ marginTop: "8px" }}>
              <button
                className="pm-btn pm-btn-primary pm-btn-full"
                type="submit"
                disabled={!ratingData.bookingId || !ratingData.rating}
              >
                Submit Rating
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default Rating;