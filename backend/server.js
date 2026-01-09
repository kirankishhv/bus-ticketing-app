const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const authMiddleware = require("./src/middleware/authMiddleware");

// DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./src/routes/authRoutes"));
app.use("/admin", require("./src/routes/adminRoutes"));
app.use("/buses", require("./src/routes/busRoutes"));
app.use("/bookings", require("./src/routes/bookingRoutes"));

// Test routes
app.get("/protected-user", authMiddleware(["USER"]), (req, res) => {
  res.json({ message: "User access granted" });
});

app.get("/protected-admin", authMiddleware(["ADMIN"]), (req, res) => {
  res.json({ message: "Admin access granted" });
});

app.get("/", (req, res) => {
  res.send("Bus Ticketing API is running");
});

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("MongoDB connected");
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
