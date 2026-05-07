const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dns = require("dns");
const connectDB = require("./config/db");
const createAdminUser = require("./utils/seedAdmin");
const seedRooms = require("./utils/seedRooms");
const seedBookings = require("./utils/seedBookings");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const mongoose = require("mongoose");

connectDB()
  .then(() => {
    // Only run seed scripts if database is actually connected
    if (mongoose.connection.readyState === 1) {
      return createAdminUser()
        .then(seedRooms)
        .then(seedBookings);
    }
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

const app = express();

app.use(express.json());

// Production Ready CORS
const allowedOrigins = [
  "http://localhost:5173", // Local Vite
  "http://localhost:3000", // Local React altenative
  process.env.FRONTEND_URL, // Production Frontend
].filter(Boolean);

const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      // Dev: allow any browser origin so registration works from LAN IP, machine
      // hostname, IPv6 ::1, custom Vite ports, etc. (credentials still scoped per-origin).
      if (!isProduction) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

// Basic Route
app.get("/", (req, res) => {
  res.send("QuickStay API is running...");
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
