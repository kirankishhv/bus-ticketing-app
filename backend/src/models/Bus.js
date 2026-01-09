const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: Number,
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const busSchema = new mongoose.Schema(
  {
    busNumber: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: String, required: true },

    pricePerSeat: {
      type: Number,
      required: true,
    },

    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    seats: [seatSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);
