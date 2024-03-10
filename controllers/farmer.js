const Farmer = require('../models/farmer');
const Farm = require('../models/farm');
const Schedule = require('../models/schedule');

const Validator = require('validator');
const isEmpty = require('../utils/is-empty');


exports.createFarmer = async (req, res) => {
    try {
        const { phoneNumber, name, language } = req.body;

        // Input validation
        const errors = {};

        // Validate phoneNumber
        if (isEmpty(phoneNumber)) {
            errors.phoneNumber = 'Phone number is required';
        } else if (!Validator.isMobilePhone(phoneNumber.toString())) {
            errors.phoneNumber = 'Invalid phone number';
        }

        // Validate name
        if (isEmpty(name)) {
            errors.name = 'Name is required';
        } else if (!Validator.isLength(name, { min: 2, max: 50 })) {
            errors.name = 'Name must be between 2 and 50 characters';
        }

        // Validate language
        if (isEmpty(language)) {
            errors.language = 'Language is required';
        } else if (!Validator.isAlpha(language)) {
            errors.language = 'Language should contain only alphabetic characters';
        }

        // Check if there are any validation errors
        if (!isEmpty(errors)) {
            return res.status(400).json({ errors });
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


// Calculate Bill of materials
exports.calculateBillOfMaterials = async (req, res) => {
    try {
        const { farmerId } = req.params;
        const { fertilizerPrices } = req.body;

        // Check if the fertilizerPrices object is provided
        if (!fertilizerPrices || typeof fertilizerPrices !== 'object') {
            return res.status(400).json({ error: 'Invalid fertilizer prices' });
        }

        // Find the farmer by ID
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ error: 'Farmer not found' });
        }

        // Find all farms associated with the farmer
        const farms = await Farm.find({ farmer: farmerId });

        // Find all schedules for the farmer's farms
        const schedules = await Schedule.find({ farm: { $in: farms.map(farm => farm._id) } });

        // Calculate the total cost for solids and liquids
        let totalCostSolid = 0;
        let totalCostLiquid = 0;

        // Calculate the total cost
        for (const schedule of schedules) {
            const { fertilizer, quantity, quantityUnit } = schedule;
            const fertilizerPriceInfo = fertilizerPrices[fertilizer];

            if (!fertilizerPriceInfo || !fertilizerPriceInfo.unit || !fertilizerPriceInfo.price) {
                // If the price unit or price for the fertilizer is not provided, skip it
                continue;
            }

            const priceUnit = fertilizerPriceInfo.unit;

            // Check if the priceUnit and quantityUnit belong to the same unit group
            const isSolidUnit = ['ton', 'kg', 'g'].includes(quantityUnit);
            const isLiquidUnit = ['L', 'mL'].includes(quantityUnit);
            const isSolidPriceUnit = ['ton', 'kg', 'g'].includes(priceUnit);
            const isLiquidPriceUnit = ['L', 'mL'].includes(priceUnit);

            if ((isSolidUnit && !isSolidPriceUnit) || (isLiquidUnit && !isLiquidPriceUnit)) {
                return res.status(400).json({ error: `Please provide prices in the correct units for ${fertilizer}` });
            }

            let price = fertilizerPriceInfo.price;

            // Convert the price to the desired unit
            if (priceUnit === 'ton') {
                price /= 1000000; // Convert from grams to tons
            } else if (priceUnit === 'kg') {
                price /= 1000; // Convert from grams to kilograms
            } else if (priceUnit === 'L') {
                price /= 1000; // Convert from milliliters to liters
            }

            let unitPrice;
            switch (quantityUnit) {
                case 'ton':
                case 'kg':
                case 'g':
                    unitPrice = price * (quantityUnit === 'ton' ? 1000000 : quantityUnit === 'kg' ? 1000 : 1);
                    totalCostSolid += quantity * unitPrice;
                    break;
                case 'L':
                case 'mL':
                    unitPrice = price * (quantityUnit === 'L' ? 1000 : 1);
                    totalCostLiquid += quantity * unitPrice;
                    break;
                default:
                    break; // Skip if the quantity unit is not recognized
            }
        }

        res.status(200).json({ totalCostSolid, totalCostLiquid });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};