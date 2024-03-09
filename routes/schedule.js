const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule');

// GET routes
router.get('/due', scheduleController.getSchedulesDue);

// POST route
router.post('/add', scheduleController.createSchedule);

module.exports = router;