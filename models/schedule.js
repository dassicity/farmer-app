const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    daysAfterSowing: {
        type: Number,
        required: true
    },
    fertilizer: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    quantityUnit: {
        type: String,
        required: true,
        enum: ['ton', 'kg', 'g', 'L', 'mL']
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;