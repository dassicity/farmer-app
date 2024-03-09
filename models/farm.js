const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    area: {
        type: Number,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    cropGrown: {
        type: String,
        required: true
    },
    sowingDate: {
        type: Date,
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;