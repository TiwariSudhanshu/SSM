const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Company = require('../models/Company');
const { getIO } = require('../socket');

// Get user portfolio and scores
router.get('/portfolio', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('holdings.company')
            .select('-password');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all companies
router.get('/companies', protect, async (req, res) => {
    try {
        const companies = await Company.find({});
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 