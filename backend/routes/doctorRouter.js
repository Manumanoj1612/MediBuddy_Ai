// backend/routes/doctorRouter.js
const express = require("express");
const User = require("../models/User");

const router = express.Router();

// GET all verified doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ isDoctor: true, doctorVerified: true })
      .select("name email description"); // ✅ include description

    res.status(200).json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
