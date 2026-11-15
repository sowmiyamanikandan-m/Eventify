const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Event = require("../models/event");

// 👉 BOOK EVENT
router.post("/book", async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || userId === "null" || userId === "undefined") {
      return res.status(401).json({ message: "Please log in as a user to book an event." });
    }

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ❌ no seats
    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: "No seats available for this event" });
    }

    // ✅ create booking
    const newBooking = new Booking({
      userId,
      eventId
    });

    await newBooking.save();

    // 🔥 reduce seats
    event.availableSeats = Math.max(0, event.availableSeats - 1);
    await event.save();

    res.json({ message: "Booking Successful", booking: newBooking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: err.message || "Booking Failed" });
  }
});

// 👉 GET USER BOOKINGS
router.get("/my/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || userId === "undefined" || userId === "null") {
      return res.json([]);
    }

    const bookings = await Booking.find({ userId }).populate("eventId");
    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

module.exports = router;