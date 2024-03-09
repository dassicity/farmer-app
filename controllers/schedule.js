const Schedule = require('../models/schedule');
const Farm = require('../models/farm');

exports.createSchedule = async (req, res) => {
    try {
        const { daysAfterSowing, fertilizer, quantity, quantityUnit, farmId } = req.body;

        // Input validation
        if (!daysAfterSowing || !fertilizer || !quantity || !quantityUnit || !farmId) {
            return res.status(400).json({ error: 'Missing required fields' });
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