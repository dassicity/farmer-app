const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmer');

// GET routes

// POST route
router.post('/add', farmerController.createFarmer);

module.exports = router;