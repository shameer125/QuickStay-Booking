const Booking = require("../models/Booking");
const User = require("../models/User");
const Room = require("../models/Room");

const seedBookings = async () => {
  try {
    // Get admin user and check if they have bookings
    const adminUser = await User.findOne({ email: "admin@quickstay.com" });
    const rooms = await Room.find().limit(2);

    console.log("Admin user found:", !!adminUser);
    console.log("Rooms found:", rooms.length);

    if (adminUser && rooms.length >= 2) {
      // Check if admin already has bookings
      const existingBookings = await Booking.find({ user: adminUser._id });
      console.log("Existing bookings for admin:", existingBookings.length);

      if (existingBookings.length === 0) {
        const sampleBookings = [
          {
            user: adminUser._id,
            room: rooms[0]._id,
            checkIn: new Date("2026-05-01"),
            checkOut: new Date("2026-05-03"),
            totalPrice: rooms[0].price * 2, // 2 nights
            status: "Confirmed",
          },
          {
            user: adminUser._id,
            room: rooms[1]._id,
            checkIn: new Date("2026-06-15"),
            checkOut: new Date("2026-06-18"),
            totalPrice: rooms[1].price * 3, // 3 nights
            status: "Pending",
          },
        ];

        await Booking.insertMany(sampleBookings);
        console.log("Sample bookings created successfully for admin");
      } else {
        console.log("Admin already has bookings");
      }
    } else {
      console.log("Admin user or rooms not found, skipping booking seeding");
    }
  } catch (error) {
    console.error("Booking seeding failed:", error.message);
  }
};

module.exports = seedBookings;
