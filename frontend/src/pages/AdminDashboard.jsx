import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [buses, setBuses] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "ADMIN") {
      localStorage.clear();
      navigate("/", { replace: true });
      return;
    }

    fetchAdminData();
    fetchBuses();
    // eslint-disable-next-line
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/admin/bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(res.data.bookings || []);
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
      alert("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const res = await axios.get("http://localhost:5001/buses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  if (loading) {
    return <h2 style={{ padding: 40 }}>Loading admin dashboard...</h2>;
  }

  return (
    <div className="container">
      {/* TOP BAR */}
      <div className="top-bar">
        <h2>Admin Dashboard</h2>

        <div>
          <button
            className="primary"
            style={{ marginRight: 10 }}
            onClick={() => navigate("/admin/create-bus")}
          >
            + Create Bus
          </button>

          <button className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="card">Total Bookings: {stats.totalBookings}</div>
        <div className="card">Active Bookings: {stats.activeBookings}</div>
        <div className="card">Cancelled Bookings: {stats.cancelledBookings}</div>
        <div className="card">Revenue: ₹ {stats.totalRevenue}</div>
      </div>

      {/* ALL BUSES */}
      <h3 style={{ marginTop: 30 }}>All Buses</h3>

      {buses.length === 0 ? (
        <p>No buses found.</p>
      ) : (
        <div className="bus-list">
          {buses.map((bus) => (
            <div key={bus._id} className="card bus-row">
              <div>
                <h4>{bus.busNumber}</h4>
                <p>
                  {bus.source} → {bus.destination}
                </p>
                <p>Date: {bus.date}</p>
                <p>Price: ₹ {bus.pricePerSeat}</p>
              </div>

              <button
                className="primary"
                onClick={() => navigate(`/admin/bus/${bus._id}`)}
              >
                View Bus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
