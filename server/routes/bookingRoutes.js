const { addBookingItems, getMyBookings, getBookings, updateBookingStatus, cancelBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

router.post('/', protect, addBookingItems);
router.get('/mybookings', protect, getMyBookings);
router.get('/', protect, admin, getBookings);
router.put('/:id', protect, admin, updateBookingStatus);
router.delete('/:id/cancel', protect, cancelBooking);

module.exports = router;
