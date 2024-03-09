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

exports.getSchedulesDue = async (req, res) => {
    try {
        const today = new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        // Find all schedules and associated farms
        const schedules = await Schedule.find().populate('farm');

        const schedulesForToday = [];
        const schedulesForTomorrow = [];

        schedules.forEach(schedule => {
            const { daysAfterSowing, farm } = schedule;
            const sowingDate = farm.sowingDate;

            const dueDate = new Date(sowingDate);
            dueDate.setDate(sowingDate.getDate() + daysAfterSowing);

            if (dueDate >= today && dueDate < tomorrow) {
                schedulesForToday.push(schedule);
            } else if (dueDate >= tomorrow && dueDate < tomorrow.setDate(tomorrow.getDate() + 1)) {
                schedulesForTomorrow.push(schedule);
            }
        });

        res.status(200).json({ schedulesForToday, schedulesForTomorrow });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};