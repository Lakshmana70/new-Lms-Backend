// File: config/db.js
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("mongodb connected");
    } catch (err) {
        console.log(err);
        process.exit(1); 
    }
};

module.exports = connectDB;