const express = require('express');
const router = express.Router();
const farmController = require('../controllers/farm');

// GET routes

// POST route
router.post('/add', farmController.createFarm);

module.exports = router;