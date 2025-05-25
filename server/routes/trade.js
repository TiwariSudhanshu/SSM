const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Company = require('../models/Company');
const Trade = require('../models/Trade');
const { getIO } = require('../socket');

// Execute trade
router.post('/execute', protect, async (req, res) => {
    try {
        const { companyId, type, shares } = req.body;
        const io = getIO();

        // Get company and user
        const company = await Company.findById(companyId);
        const user = await User.findById(req.user._id);

        if (!company || !user) {
            return res.status(404).json({ message: 'Company or user not found' });
        }

        // Validate trade
        if (type === 'BUY') {
            if (company.availableShares < shares) {
                return res.status(400).json({ message: 'Not enough shares available' });
            }
            // Validate sufficient balance for buy
            if (user.balance < (company.stockPrice * shares)) {
                return res.status(400).json({ message: 'Insufficient funds' });
            }
        } else if (type === 'SELL') {
            const holding = user.holdings.find(h => h.company.toString() === companyId);
            if (!holding || holding.shares < shares) {
                return res.status(400).json({ message: 'Not enough shares to sell' });
            }
        }

        // Calculate trade values
        const tradeValue = company.stockPrice * shares;

        // Update company shares
        company.availableShares += type === 'BUY' ? -shares : shares;
        await company.save();

        // Update user holdings and balance
        const holdingIndex = user.holdings.findIndex(h => h.company.toString() === companyId);
        if (holdingIndex === -1 && type === 'BUY') {
            user.holdings.push({ company: companyId, shares });
        } else if (holdingIndex !== -1) {
            user.holdings[holdingIndex].shares += type === 'BUY' ? shares : -shares;
            if (user.holdings[holdingIndex].shares === 0) {
                user.holdings.splice(holdingIndex, 1);
            }
        }

        // Update balance based on trade type
        user.balance += type === 'BUY' ? -tradeValue : tradeValue;

        // Recalculate portfolioValue based on initial balance + value of holdings
        let holdingsValue = 0;
        // Fetch companies data if not already available (assuming we have it populated or can fetch)
        // For now, let's assume user.holdings.company is populated with company details including stockPrice
        if (user.holdings && user.holdings.length > 0) {
            holdingsValue = user.holdings.reduce((total, holding) => {
                // Find the company details from the populated holding or fetch if necessary
                const companyDetails = companies.find(comp => comp._id.toString() === holding.company.toString());
                if (companyDetails) {
                     return total + (holding.shares * companyDetails.stockPrice);
                }
               return total;
            }, 0);
        }
        // Assuming initial balance is 100000 (as set during registration)
        user.portfolioValue = 100000 + holdingsValue;

        await user.save();

        // Create trade record
        const trade = await Trade.create({
            user: user._id,
            company: companyId,
            type,
            shares,
            price: company.stockPrice,
            esgValue: company.esgScore,
            totalValue: tradeValue
        });

        // Emit updates
        io.emit('tradeUpdate', {
            userId: user._id,
            companyId,
            type,
            shares,
            price: company.stockPrice
        });

        io.emit('companyUpdate', {
            companyId,
            availableShares: company.availableShares,
            stockPrice: company.stockPrice
        });

        // Include updated user object (with balance and portfolioValue) in the response
        res.json({ trade, user: user.toObject(), company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 