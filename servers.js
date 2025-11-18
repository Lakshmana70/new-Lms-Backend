// File: server.js
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const loanRoutes = require('./routes/loan.routes');
const interestRoutes = require('./routes/interest.routes');
const adminRoutes = require('./routes/admin.routes');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Mount Routes
app.use(authRoutes);
app.use(loanRoutes);
app.use(interestRoutes);
app.use(adminRoutes);

// Start Server
const PORT = 8500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});