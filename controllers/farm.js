const Farm = require('../models/farm');
const Farmer = require('../models/farmer');

exports.createFarm = async (req, res) => {
    try {
        const { area, village, cropGrown, sowingDate, farmerId } = req.body;

        // Input validation
        if (!area || !village || !cropGrown || !sowingDate || !farmerId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        const farm = new Farm({ area, village, cropGrown, sowingDate, farmer: farmerId });
        await farm.save();

        res.status(201).json(farm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};