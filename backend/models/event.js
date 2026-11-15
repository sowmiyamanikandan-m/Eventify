const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

title:String,
description:String,
location:String,
date:String,
fromTime:String,
toTime:String,

totalSeats:Number,     // ✅ NEW
availableSeats:Number, // ✅ NEW

image:String

});

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);