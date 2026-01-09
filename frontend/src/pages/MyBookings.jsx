import { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await axios.get("http://localhost:5001/bookings/my", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    await axios.delete(`http://localhost:5001/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    fetchBookings();
  };

  return (
    <div className="container">
      <h2>My Bookings</h2>

      {bookings.map((b) => (
        <div
          key={b._id}
          className={`card ${
            b.status === "CANCELLED"
              ? "booking-cancelled"
              : "booking-active"
          }`}
        >
          <p>
            <strong>
              {b.bus.source} → {b.bus.destination}
            </strong>
          </p>
          <p>Date: {b.bus.date}</p>
          <p>Seat: {b.seatNumber}</p>
          <p>Status: {b.status}</p>

          {b.status !== "CANCELLED" && (
            <button
              className="danger"
              onClick={() => cancelBooking(b._id)}
            >
              Cancel Booking
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyBookings;
