const express = require('express');
const farmerController = require('../controllers/farmer');

const router = express.Router();

// GET routes
router.get('/crop/:crop', farmerController.getFarmersByCrop);

// POST route
router.post('/add', farmerController.createFarmer);
router.post('/:farmerId/bill', farmerController.calculateBillOfMaterials);

module.exports = router;