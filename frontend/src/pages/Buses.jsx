import { useEffect, useState } from "react";
import axios from "axios";

function Buses() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const token = localStorage.getItem("token");

  const fetchBuses = async () => {
    const res = await axios.get("http://localhost:5001/buses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBuses(res.data);
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const confirmBooking = async () => {
    try {
      for (let seat of selectedSeats) {
        await axios.post(
          "http://localhost:5001/bookings",
          { busId: selectedBus._id, seatNumber: seat },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSelectedSeats([]);
      setSelectedBus(null);
      fetchBuses();
      alert("Booking successful!");
    } catch (err) {
      alert("Booking failed");
    }
  };

  const totalPrice =
    (selectedBus?.pricePerSeat || 0) * selectedSeats.length;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          className="secondary"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>

        <button
          className="primary"
          onClick={() => (window.location.href = "/my-bookings")}
        >
          My Bookings
        </button>
      </div>

      <h2 style={{ marginTop: 30 }}>Available Buses</h2>

      <div className="bus-list">
        {buses.map((bus) => (
          <div key={bus._id} className="card">
            <p>
              <strong>
                {bus.source} → {bus.destination}
              </strong>
            </p>
            <p>Date: {bus.date}</p>
            <p>Available Seats: {bus.availableSeats}</p>
            <p>Price: ₹{bus.pricePerSeat || 0}</p>

            <button
              className="primary"
              onClick={() => {
                setSelectedBus(bus);
                setSelectedSeats([]);
              }}
            >
              View Seats
            </button>
          </div>
        ))}
      </div>

      {selectedBus && (
        <div className="card">
          <h3>Bus {selectedBus.busNumber}</h3>

          <div className="seat-grid">
            {selectedBus.seats.map((seat) => (
              <button
                key={seat._id}
                className={`seat ${
                  seat.isBooked
                    ? "booked"
                    : selectedSeats.includes(seat.seatNumber)
                    ? "selected"
                    : "available"
                }`}
                disabled={seat.isBooked}
                onClick={() => toggleSeat(seat.seatNumber)}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>

          <p style={{ marginTop: 20 }}>
            Selected Seats: {selectedSeats.join(", ") || "None"}
          </p>

          <p>
            <strong>Total Price: ₹{totalPrice}</strong>
          </p>

          <button
            className="primary"
            disabled={selectedSeats.length === 0}
            onClick={confirmBooking}
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default Buses;
