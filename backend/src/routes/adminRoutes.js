const express = require("express");
const Bus = require("../models/Bus");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE BUS (ADMIN)
 */
router.post("/bus", authMiddleware(["ADMIN"]), async (req, res) => {
  try {
    const {
      busNumber,
      source,
      destination,
      date,
      totalSeats,
      pricePerSeat,
    } = req.body;

    if (
      !busNumber ||
      !source ||
      !destination ||
      !date ||
      !totalSeats ||
      !pricePerSeat
    ) {
      return res.status(400).json({
        message: "All fields including pricePerSeat are required",
      });
    }

    const seats = [];
    for (let i = 1; i <= totalSeats; i++) {
      seats.push({ seatNumber: i, isBooked: false });
    }

    const bus = await Bus.create({
      busNumber,
      source,
      destination,
      date,
      pricePerSeat,
      totalSeats,
      availableSeats: totalSeats,
      seats,
    });

    res.status(201).json({ message: "Bus created successfully", bus });
  } catch (err) {
    console.error("CREATE BUS ERROR:", err);
    res.status(500).json({ message: "Failed to create bus" });
  }
});

/**
 * ADMIN DASHBOARD – BOOKINGS + STATS
 */
router.get("/bookings", authMiddleware(["ADMIN"]), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "email")
      .populate("bus", "busNumber pricePerSeat");

    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(
      (b) => b.status === "BOOKED"
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.status === "CANCELLED"
    ).length;

    let totalRevenue = 0;
    bookings.forEach((b) => {
      if (b.status === "BOOKED" && b.price) {
        totalRevenue += b.price;
      }
    });

    res.json({
      bookings,
      stats: {
        totalBookings,
        activeBookings,
        cancelledBookings,
        totalRevenue,
      },
    });
  } catch (err) {
    console.error("ADMIN DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Failed to load admin dashboard" });
  }
});

/**
 * GET BOOKINGS FOR A SPECIFIC BUS (ADMIN)
 */
router.get(
  "/bus/:busId/bookings",
  authMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const bookings = await Booking.find({
        bus: req.params.busId,
      }).populate("user", "email");

      res.json(bookings);
    } catch (err) {
      console.error("BUS BOOKINGS ERROR:", err);
      res.status(500).json({ message: "Failed to load bus bookings" });
    }
  }
);

/**
 * RESET BUS (CANCEL BOOKINGS + FREE SEATS)
 */
router.post(
  "/bus/:busId/reset",
  authMiddleware(["ADMIN"]),
  async (req, res) => {
    try {
      const bus = await Bus.findById(req.params.busId);
      if (!bus) {
        return res.status(404).json({ message: "Bus not found" });
      }

      await Booking.updateMany(
        { bus: bus._id, status: "BOOKED" },
        { status: "CANCELLED" }
      );

      bus.seats.forEach((seat) => {
        seat.isBooked = false;
      });

      bus.availableSeats = bus.totalSeats;
      await bus.save();

      res.json({ message: "Bus reset successfully" });
    } catch (err) {
      console.error("RESET BUS ERROR:", err);
      res.status(500).json({ message: "Failed to reset bus" });
    }
  }
);

module.exports = router;
