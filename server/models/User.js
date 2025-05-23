const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    portfolioValue: {
        type: Number,
        default: 0
    },
    esgScore: {
        type: Number,
        default: 0
    },
    finalScore: {
        type: Number,
        default: 0
    },
    normalizedValue: {
        type: Number,
        default: 0
    },
    sectorScore: {
        type: Number,
        default: 0
    },
    avgESGScore: {
        type: Number,
        default: 0
    },
    sectorDistribution: {
        type: Object,
        default: {}
    },
    holdings: [{
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        shares: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 