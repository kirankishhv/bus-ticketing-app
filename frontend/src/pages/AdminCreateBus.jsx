import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminCreateBus() {
  const [busNumber, setBusNumber] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [pricePerSeat, setPricePerSeat] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const createBus = async () => {
    try {
      await axios.post(
        "https://bus-ticketing-app-mfon.onrender.com/admin/bus",
        {
          busNumber,
          source,
          destination,
          date,
          totalSeats: Number(totalSeats),
          pricePerSeat: Number(pricePerSeat),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Bus created successfully");
      navigate("/admin");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create bus");
    }
  };

  return (
    <div className="container">
      <h2>Create Bus</h2>

      <input placeholder="Bus Number" value={busNumber} onChange={e => setBusNumber(e.target.value)} />
      <input placeholder="Source" value={source} onChange={e => setSource(e.target.value)} />
      <input placeholder="Destination" value={destination} onChange={e => setDestination(e.target.value)} />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="number" placeholder="Total Seats" value={totalSeats} onChange={e => setTotalSeats(e.target.value)} />
      <input type="number" placeholder="Price per Seat" value={pricePerSeat} onChange={e => setPricePerSeat(e.target.value)} />

      <button className="primary" onClick={createBus}>
        Create Bus
      </button>
    </div>
  );
}

export default AdminCreateBus;
