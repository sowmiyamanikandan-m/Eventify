const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

userId:String,

eventId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Event"
}

});

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);