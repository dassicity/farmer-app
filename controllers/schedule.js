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