const Booking = require("../models/Booking");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const addBookingItems = async (req, res) => {
  const { room, checkIn, checkOut, totalPrice } = req.body;

  if (!room || !checkIn || !checkOut || !totalPrice) {
    return res.status(400).json({ message: "Missing booking details" });
  }

  const booking = new Booking({
    user: req.user._id,
    room,
    checkIn,
    checkOut,
    totalPrice,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private

const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate(
    "room",
    "title images location price rating",
  );
  res.json(bookings);
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin

const getBookings = async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user", "id name")
    .populate("room", "title");
  res.json(bookings);
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin

const updateBookingStatus = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.status = req.body.status || booking.status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id/cancel
// @access  Private

const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: "Not authorized to cancel this booking" });
    }
    
    booking.status = "Cancelled";
    const updatedBooking = await booking.save();
    res.json({ message: "Booking cancelled successfully", booking: updatedBooking });
  } else {
    res.status(404).json({ message: "Booking not found" });
  }
};

module.exports = {
  addBookingItems,
  getMyBookings,
  getBookings,
  updateBookingStatus,
  cancelBooking,
};
