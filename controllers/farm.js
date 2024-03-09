const Farm = require('../models/farm');
const Farmer = require('../models/farmer');

// Add Farm details to database
exports.createFarm = async (req, res) => {
    try {
        const { area, village, cropGrown, sowingDate, farmerId } = req.body;

        // Input validation
        if (!area || !village || !cropGrown || !sowingDate || !farmerId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Find the farmer by Id
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        // Init a new Farm and save it in database
        const farm = new Farm({ area, village, cropGrown, sowingDate, farmer: farmerId });
        await farm.save();

        res.status(201).json(farm);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};