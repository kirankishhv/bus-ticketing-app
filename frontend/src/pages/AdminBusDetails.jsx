import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function AdminBusDetails() {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `https://bus-ticketing-app-mfon.onrender.com/admin/bus/${busId}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to view bookings");
    }
  };

  const resetBus = async () => {
    if (!window.confirm("Reset bus? This will cancel all bookings.")) return;

    try {
      await axios.post(
        `https://bus-ticketing-app-mfon.onrender.com/admin/bus/${busId}/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Bus reset successfully");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to reset bus");
    }
  };

  return (
    <div className="container">
      <button className="secondary" onClick={() => navigate("/admin")}>
        ← Back
      </button>

      <h2 style={{ marginTop: 20 }}>Bus Bookings</h2>

      <button className="danger" onClick={resetBus}>
        Reset Bus
      </button>

      <hr />

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="card">
            <p>User: {b.user?.email}</p>
            <p>Seat Number: {b.seatNumber}</p>
            <p>Status: {b.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminBusDetails;
