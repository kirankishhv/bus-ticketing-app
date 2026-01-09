const express = require("express");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// BOOK A SEAT
router.post("/", authMiddleware(["USER"]), async (req, res) => {
  try {
    const { busId, seatNumber } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const seat = bus.seats.find(
      (s) => s.seatNumber === seatNumber
    );

    if (!seat || seat.isBooked) {
      return res.status(400).json({ message: "Seat not available" });
    }

    // ✅ SAFE PRICE LOGIC (THIS IS WHAT YOU WERE LOOKING FOR)
    const pricePerSeat = bus.pricePerSeat || 0;

    // Book seat
    seat.isBooked = true;
    bus.availableSeats -= 1;
    await bus.save();

    const booking = await Booking.create({
      user: req.user.id,
      bus: busId,
      seatNumber,
      price: pricePerSeat, // ✅ STORED HERE
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// VIEW MY BOOKINGS
router.get("/my", authMiddleware(["USER"]), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("bus", "busNumber source destination date");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// CANCEL BOOKING
router.delete("/:id", authMiddleware(["USER"]), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    const bus = await Bus.findById(booking.bus);
    const seat = bus.seats.find(
      (s) => s.seatNumber === booking.seatNumber
    );

    seat.isBooked = false;
    bus.availableSeats += 1;
    await bus.save();

    booking.status = "CANCELLED";
    await booking.save();

    res.json({ message: "Ticket cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

