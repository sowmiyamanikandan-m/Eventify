const Booking = require("../models/Booking");
const Event = require("../models/Event");

exports.bookEvent = async (req, res) => {
  const { userId, eventId, seats } = req.body;

  const event = await Event.findById(eventId);

  if (event.availableSeats < seats) {
    return res.status(400).json({ message: "Not enough seats" });
  }

  event.availableSeats -= seats;
  await event.save();

  const booking = await Booking.create({
    userId,
    eventId,
    seatsBooked: seats
  });

  res.json(booking);
};