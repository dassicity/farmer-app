const Farmer = require('../models/farmer');
const Farm = require('../models/farm');

exports.createFarmer = async (req, res) => {
    try {
        const { phoneNumber, name, language } = req.body;

        // Input validation
        if (!phoneNumber || !name || !language) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const farmer = new Farmer({ phoneNumber, name, language });
        await farmer.save();

        res.status(201).json(farmer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getFarmersByCrop = async (req, res) => {
    try {
        const { crop } = req.params;
        const cropRegex = new RegExp(`^${crop}$`, 'i'); // Creating a case insensitive regex for checking crop values in the DB

        // Finding all the farms that grow the specified crop
        const farms = await Farm.find({ cropGrown: { $regex: cropRegex } }).populate('farmer');

        // Extracting and filtering out unique farmers from the farms
        const farmers = [...new Set(farms.map(farm => farm.farmer))];

        res.status(200).json(farmers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};