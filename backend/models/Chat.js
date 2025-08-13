// backend/models/Chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userMessage: { type: String, required: true },
  aiMessage: { type: String, required: true },
  classification: { type: String, enum: ["Accurate", "Misleading", "Harmful", "Not classified"], default: "Not classified" },
  sources: [{ type: String }],
  accuracyPercentage: { type: Number, min: 0, max: 100 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
