const Farmer = require('../models/farmer');

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