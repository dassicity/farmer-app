const express = require('express');
require('dotenv').config();

const connectDB = require('./utils/database');

const farmRoutes = require('./routes/farm');
const farmerRoutes = require('./routes/farmer');
const scheduleRoutes = require('./routes/schedule');

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});