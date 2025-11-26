// File: config/config.js 
const dotenv=require("dotenv")
dotenv.config();
module.exports = {
   
   MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    BASE_URL :process.env.BASE_URL,
    API_KEY :process.env.API_KEY,
    DEVICE_ID :process.env.DEVICE_ID

};