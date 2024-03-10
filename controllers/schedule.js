const Schedule = require('../models/schedule');
const Farm = require('../models/farm');

const Validator = require('validator');
const isEmpty = require('../utils/is-empty');

exports.createSchedule = async (req, res) => {
    try {
        const { daysAfterSowing, fertilizer, quantity, quantityUnit, farmId } = req.body;

        // Input validation
        const errors = {};

        // Validate daysAfterSowing
        if (isEmpty(daysAfterSowing)) {
            errors.daysAfterSowing = 'Days after sowing is required';
        } else if (!Validator.isInt(daysAfterSowing.toString(), { min: 1 })) {
            errors.daysAfterSowing = 'Days after sowing must be a positive integer';
        }

        // Validate fertilizer
        if (isEmpty(fertilizer)) {
            errors.fertilizer = 'Fertilizer is required';
        } else if (!Validator.isLength(fertilizer, { min: 2, max: 50 })) {
            errors.fertilizer = 'Fertilizer must be between 2 and 50 characters';
        }

        // Validate quantity
        if (isEmpty(quantity)) {
            errors.quantity = 'Quantity is required';
        } else if (!Validator.isNumeric(quantity.toString())) {
            errors.quantity = 'Quantity must be a number';
        }

        // Validate quantityUnit
        if (isEmpty(quantityUnit)) {
            errors.quantityUnit = 'Quantity unit is required';
        } else {
            const validUnits = ['ton', 'kg', 'g', 'L', 'mL'];
            if (!validUnits.includes(quantityUnit)) {
                errors.quantityUnit = 'Invalid quantity unit';
            }
        }

        // Validate farmId
        if (isEmpty(farmId)) {
            errors.farmId = 'Farm ID is required';
        } else if (!Validator.isMongoId(farmId)) {
            errors.farmId = 'Invalid Farm ID';
        }

        // Check if there are any validation errors
        if (!isEmpty(errors)) {
            return res.status(400).json({ errors });
        }

        const farm = await Farm.findById(farmId);
        if (!farm) {
            return res.status(404).json({ error: 'Farm not found' });
        }

        const schedule = new Schedule({ daysAfterSowing, fertilizer, quantity, quantityUnit, farm: farmId });
        await schedule.save();

        res.status(201).json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getSchedulesDue = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);

        // console.log(today);
        // console.log(tomorrow);

        // Find all schedules and associated farms
        const schedules = await Schedule.find().populate('farm');

        const schedulesForToday = [];
        const schedulesForTomorrow = [];

        schedules.forEach(schedule => {
            const { daysAfterSowing, farm } = schedule;
            const sowingDate = farm.sowingDate;

            const dueDate = new Date(sowingDate);
            dueDate.setDate(sowingDate.getDate() + daysAfterSowing);

            // console.log(`Date of sowing - ${sowingDate} -> Due Date - ${dueDate} after ${daysAfterSowing} days after sowing.`)

            if (dueDate >= today && dueDate < tomorrow) {
                // console.log(tomorrow);
                schedulesForToday.push(schedule);
            } else if (dueDate > today && dueDate < dayAfterTomorrow) {
                schedulesForTomorrow.push(schedule);
            }
        });

        res.status(200).json({ schedulesForToday, schedulesForTomorrow });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};