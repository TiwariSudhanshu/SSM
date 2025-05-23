const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    shares: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    esgValue: {
        type: Number,
        required: true
    },
    totalValue: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Trade', tradeSchema); 