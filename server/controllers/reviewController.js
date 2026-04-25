const Review = require('../models/Review');
const Room = require('../models/Room');

// @desc    Create new review
// @route   POST /api/rooms/:id/reviews
// @access  Private
const createRoomReview = async (req, res) => {
    const { rating, comment } = req.body;

    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            room: req.params.id,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Room already reviewed' });
        }

        const review = await Review.create({
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            room: req.params.id,
        });

        // Update room rating
        const reviews = await Review.find({ room: req.params.id });
        room.numReviews = reviews.length;
        room.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await room.save();
        res.status(201).json({ message: 'Review added' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a room
// @route   GET /api/rooms/:id/reviews
// @access  Public
const getRoomReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ room: req.params.id }).populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRoomReview,
    getRoomReviews,
};
