const Farm = require('../models/farm');
const Farmer = require('../models/farmer');

const Validator = require('validator');
const isEmpty = require('../utils/is-empty');

// Add Farm details to database
exports.createFarm = async (req, res) => {
    try {
        const { area, village, cropGrown, sowingDate, farmerId } = req.body;

        // Input validation
        const errors = {};

        // Validate area
        if (isEmpty(area)) {
            errors.area = 'Area is required';
        } else if (!Validator.isNumeric(area.toString())) {
            errors.area = 'Area must be a number';
        }

        // Validate village
        if (isEmpty(village)) {
            errors.village = 'Village is required';
        } else if (!Validator.isLength(village, { min: 2, max: 50 })) {
            errors.village = 'Village must be between 2 and 50 characters';
        }

        // Validate cropGrown
        if (isEmpty(cropGrown)) {
            errors.cropGrown = 'Crop grown is required';
        } else if (!Validator.isLength(cropGrown, { min: 2, max: 50 })) {
            errors.cropGrown = 'Crop grown must be between 2 and 50 characters';
        }

        // Validate sowingDate
        if (isEmpty(sowingDate)) {
            errors.sowingDate = 'Sowing date is required';
        } else if (!Validator.isISO8601(sowingDate)) {
            errors.sowingDate = 'Invalid date format, please use ISO 8601 format';
        }

        // Validate farmerId
        if (isEmpty(farmerId)) {
            errors.farmerId = 'Farmer ID is required';
        } else if (!Validator.isMongoId(farmerId)) {
            errors.farmerId = 'Invalid Farmer ID';
        }

        // Check if there are any validation errors
        if (!isEmpty(errors)) {
            return res.status(400).json({ errors });
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