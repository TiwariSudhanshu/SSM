const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    sector: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stockPrice: {
        type: Number,
        required: true,
        default: 0
    },
    esgScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    availableShares: {
        type: Number,
        required: true,
        default: 1000000
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Company', companySchema); 