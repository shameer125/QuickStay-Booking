const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.warn('WARNING: MONGODB_URI is missing. Server will run without a database.');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        console.warn('Server will continue running, but database features will be unavailable.');
    }
};

module.exports = connectDB;
