const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule');

// GET routes

// POST route
router.post('/add', scheduleController.createSchedule);

module.exports = router;