const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    roundNumber: {
        type: Number,
        required: true
    },
    tradeEnabled: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Round', roundSchema); 