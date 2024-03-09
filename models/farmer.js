const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
});

const Farmer = mongoose.model('Farmer', farmerSchema);

module.exports = Farmer;