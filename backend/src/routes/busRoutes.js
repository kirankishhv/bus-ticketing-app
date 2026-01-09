const express = require("express");
const Bus = require("../models/Bus");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET ALL BUSES (USER + ADMIN)
router.get("/", authMiddleware(["USER", "ADMIN"]), async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE BUS DETAILS
router.get("/:id", authMiddleware(["USER", "ADMIN"]), async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

