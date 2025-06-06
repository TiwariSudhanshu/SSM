const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register user
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user (password will be hashed by the pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
            balance: 100000, // Initialize balance with 100000
            portfolioValue: 100000, // Initialize portfolioValue (will be recalculated)
            esgScore: 0,
            holdings: []
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            balance: user.balance, // Include balance in the response
            portfolioValue: user.portfolioValue,
            esgScore: user.esgScore,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password using the model's method
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            portfolioValue: user.portfolioValue,
            esgScore: user.esgScore,
            isAdmin: user.isAdmin,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 