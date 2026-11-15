const express = require("express");
const router = express.Router();
const multer = require("multer");
const Event = require("../models/event");

/* IMAGE STORAGE */
const storage = multer.diskStorage({
destination:"uploads/",
filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname);
}
});

const upload = multer({storage});

/* GET EVENTS */
router.get("/",async(req,res)=>{
const events = await Event.find();
res.json(events);
});

/* ADD EVENT */
router.post("/add", upload.single("image"), async (req, res) => {
  try {

    console.log("BODY:", req.body); // 👈 DEBUG

    const total = parseInt(req.body.totalSeats);

    const newEvent = new Event({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      fromTime: req.body.fromTime,
      toTime: req.body.toTime,

      // 🔥 MAIN FIX
      totalSeats: total,
      availableSeats: total,

      image: req.file ? req.file.filename : ""
    });

    await newEvent.save();

    res.json({ message: "Event Added Successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});



/* DELETE EVENT */
router.delete("/:id",async(req,res)=>{
await Event.findByIdAndDelete(req.params.id);
res.json({message:"Deleted"});
});

/* UPDATE EVENT */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const existing = await Event.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Event not found" });
    }

    const seatsInput = req.body.totalSeats || req.body.seats;
    const total = seatsInput ? parseInt(seatsInput) : existing.totalSeats;

    const updatedData = {
      title: req.body.title || existing.title,
      description: req.body.description || existing.description,
      location: req.body.location || existing.location,
      date: req.body.date || existing.date,
      fromTime: req.body.fromTime || existing.fromTime,
      toTime: req.body.toTime || existing.toTime,
      totalSeats: total,
      availableSeats: req.body.availableSeats !== undefined ? parseInt(req.body.availableSeats) : Math.min(existing.availableSeats || total, total)
    };

    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Update Failed", error: err.message });
  }
});

module.exports = router;