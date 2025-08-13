const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String},
  description: { type: String},
  isDoctor: { type: Boolean, default: false },
  doctorVerified: { type: Boolean, default: false }, // doctor must be verified by admin
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
