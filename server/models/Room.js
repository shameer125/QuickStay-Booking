const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    price: { type: Number, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    category: { type: String, required: true }, // e.g., Hotel, Apartment, Resort
    type: { type: String, default: 'Single Bed' },
    offer: { type: Number, default: 0 }, // percentage off
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
