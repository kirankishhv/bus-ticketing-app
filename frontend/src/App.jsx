import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Buses from "./pages/Buses";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBusDetails from "./pages/AdminBusDetails";
import AdminCreateBus from "./pages/AdminCreateBus";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      {/* HEADER */}
      <div className="header">
        <div className="header-content">Bus Ticketing App</div>
      </div>

      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* USER ROUTES */}
        <Route
          path="/buses"
          element={
            <ProtectedRoute>
              <Layout>
                <Buses />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <Layout>
                <MyBookings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bus/:busId"
          element={
            <AdminRoute>
              <Layout>
                <AdminBusDetails />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/create-bus"
          element={
            <AdminRoute>
              <Layout>
                <AdminCreateBus />
              </Layout>
            </AdminRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
