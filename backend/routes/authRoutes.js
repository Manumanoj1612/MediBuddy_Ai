const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// =============================
// REGISTER
// =============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, isDoctor, phoneNumber, description } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isDoctor && !phoneNumber) {
      return res.status(400).json({ message: "Phone number is required for doctors" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isDoctor: !!isDoctor,
      phoneNumber: isDoctor ? phoneNumber : undefined,
      description: isDoctor ? description : undefined,
      doctorVerified: false
    });

    await newUser.save();

    if (isDoctor) {
      return res.json({
        message: "Doctor account request submitted. Our team will verify your credentials before activation."
      });
    } else {
      return res.json({ message: "Signup successful!" });
    }
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// =============================
// LOGIN
// =============================
router.post("/login", async (req, res) => {
  try {
    const { email, password, isDoctor , phoneNumber , description} = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // If doctor not verified yet
    if (user.isDoctor && !user.doctorVerified) {
      return res.status(403).json({ message: "Doctor account pending verification" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isDoctor: user.isDoctor },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isDoctor: user.isDoctor
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error"});
  }
});

// =============================
// ADMIN VERIFY DOCTOR
// =============================
router.patch("/verify-doctor/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.isDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    user.doctorVerified = true;
    await user.save();

    res.json({ message: "Doctor verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
