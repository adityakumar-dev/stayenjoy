const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  homestayId: { type: mongoose.Schema.Types.ObjectId, ref: "Homestay", required: true },

  checkIn: { type: String, required: true }, // Format: "YYYY-MM-DD"
  checkOut: { type: String, required: true },

  totalGuests: { type: Number, required: true },
  roomsBooked: { type: Number, required: true },

  pricePerNight: { type: Number, required: true },
  totalPrice: { type: Number, required: true },

  isHomeStay: { type: Boolean, default: false },

  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  },

  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
