const mongoose = require("mongoose");

const homestaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // per night
  images: { type: [String], required: true }, // array of image URLs or filenames
  location: { type: String, required: true }, // e.g., "Rishikesh, Uttarakhand"
  gmapLink: { type: String }, // optional Google Maps link

  amenities: { type: [String], required: true }, // e.g., ["WiFi", "AC", "Pool"]
  maxGuests: { type: Number, required: true },
  availableRooms: { type: Number, required: true },

  ownerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },

  totalRating: { type: Number, default: 0 }, // optional: can also store avgRating
  reviews: { type: [Object], default: [] }, // or use a separate schema

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Homestay = mongoose.model("Homestay", homestaySchema);
module.exports = Homestay;
