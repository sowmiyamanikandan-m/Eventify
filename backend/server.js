require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

/* ENSURE UPLOADS DIRECTORY EXISTS */
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* IMPORT ROUTES */
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const User = require("./models/user");

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* STATIC FILES */
app.use("/uploads", express.static(uploadDir));

/* ROUTES */
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

/* SEED DEFAULT USER IF NONE EXISTS */
const seedDefaultUser = async () => {
  try {
    const existing = await User.findOne({ email: "user@example.com" });
    if (!existing) {
      await User.create({
        name: "Demo User",
        email: "user@example.com",
        password: "user123",
        role: "user"
      });
      console.log("✅ Seeded default user: user@example.com / user123");
    }
  } catch (err) {
    console.error("User seed note:", err.message);
  }
};

/* DB CONNECTION */
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventdb";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");
    await seedDefaultUser();
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

/* GLOBAL ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

/* SERVER */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📌 Admin Login: admin / admin123`);
  console.log(`📌 Default User: user@example.com / user123`);
});