const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceIp: { type: String, required: true },
  deviceInfo: { type: String, required: true },
  deviceType: { type: String, required: true },
  deviceUUID: { type: String, required: true },
  deviceOS: { type: String },
  deviceBrowser: { type: String },
  deviceVersion: { type: String },
  lastLoginAt: { type: Date, default: Date.now },
  firstLoginAt: { type: Date, default: Date.now },
  allowedLogin: { type: Boolean, default: true }
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
