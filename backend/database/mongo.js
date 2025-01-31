const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Can be removed
            useUnifiedTopology: true // Can be removed
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;