const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId:{
    type: String,  required: true, index:true, unique:true, default: mongoose.Types.ObjectId
  },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // store hashed
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
  phone: { type: String, unique: true, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  govt_id_number: { type: String }, // replaces 'id'
  id_type: { type: String, enum: ['aadhar', 'pan', 'voter_id'] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
