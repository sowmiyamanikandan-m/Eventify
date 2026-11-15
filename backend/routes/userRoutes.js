const express = require("express");
const router = express.Router();

const User = require("../models/user");

/* REGISTER (Multiple Users Allowed) */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered! Please login or use a different email." });
    }

    const user = new User({
      name: name.trim(),
      email: cleanEmail,
      password: password
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message || "Registration failed" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail, password: password });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password"
      });
    }

    res.json({
      message: "Login Success",
      user: user
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message || "Login failed" });
  }
});

/* GET ALL USERS (FOR ADMIN / DEBUG) */
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch users" });
  }
});

module.exports = router;