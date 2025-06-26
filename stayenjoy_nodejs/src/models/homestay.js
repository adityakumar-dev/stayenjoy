const mongoose = require("mongoose");

const homestaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, 
  images: { type: [String], required: true },
  city: { type: String, required: true },
  location: { type: String, required: true },
  gmapLink: { type: String },

  type: { type: String, enum: ['home', 'room', 'mixed'], default: 'home' },
  amenities: { type: [String], required: true },
  maxGuests: { type: Number, required: true },
  availableRooms: { type: Number, required: true },

  bookingDate: [
    {
      date: { type: String, required: true }, 
      count: { type: Number, default: 0 }
    }
  ],

  ownerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  totalRating: { type: Number, default: 0 },
  reviews: { type: [Object], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Homestay = mongoose.model("Homestay", homestaySchema);
module.exports = Homestay;
