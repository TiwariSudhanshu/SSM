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
        console.log('Trade execution request received:', req.body);
        const { companyId, type, shares } = req.body;
        
        if (!companyId || !type || !shares) {
            console.error('Missing required fields:', { companyId, type, shares });
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const io = getIO();

        // Get company and user
        console.log('Fetching company and user data...');
        const company = await Company.findById(companyId);
        const user = await User.findById(req.user._id);

        if (!company || !user) {
            console.error('Company or user not found:', { companyId, userId: req.user._id });
            return res.status(404).json({ message: 'Company or user not found' });
        }

        console.log('Validating trade...', {
            type,
            shares,
            availableShares: company.availableShares,
            userBalance: user.balance,
            stockPrice: company.stockPrice
        });

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
        } else {
            return res.status(400).json({ message: 'Invalid trade type' });
        }

        // Calculate trade values
        const tradeValue = company.stockPrice * shares;
        console.log('Trade values calculated:', { tradeValue, stockPrice: company.stockPrice, shares });

        // Update company shares
        company.availableShares += type === 'BUY' ? -shares : shares;
        console.log('Updating company shares:', { 
            newAvailableShares: company.availableShares,
            type,
            shares
        });
        await company.save();

        // Update user holdings and balance
        const holdingIndex = user.holdings.findIndex(h => h.company.toString() === companyId);
        console.log('Current holdings:', { 
            holdingIndex,
            currentHoldings: user.holdings,
            type,
            shares
        });

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
        console.log('Updated user balance:', { newBalance: user.balance, tradeValue, type });

        // Recalculate portfolioValue based on initial balance + value of holdings
        let holdingsValue = 0;
        
        // Fetch all companies to calculate holdings value
        console.log('Fetching companies for portfolio calculation...');
        const allCompanies = await Company.find();
        
        if (user.holdings && user.holdings.length > 0) {
            holdingsValue = user.holdings.reduce((total, holding) => {
                const companyDetails = allCompanies.find(comp => comp._id.toString() === holding.company.toString());
                if (companyDetails) {
                    return total + (holding.shares * companyDetails.stockPrice);
                }
                return total;
            }, 0);
        }
        
        // Assuming initial balance is 100000 (as set during registration)
        user.portfolioValue = 100000 + holdingsValue;
        console.log('Updated portfolio value:', { 
            portfolioValue: user.portfolioValue,
            holdingsValue,
            initialBalance: 100000
        });

        await user.save();
        console.log('User data saved successfully');

        // Create trade record
        console.log('Creating trade record...');
        const trade = await Trade.create({
            user: user._id,
            company: companyId,
            type,
            shares,
            price: company.stockPrice,
            esgValue: company.esgScore,
            totalValue: tradeValue
        });
        console.log('Trade record created:', trade);

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

        console.log('Trade execution completed successfully');
        // Include updated user object (with balance and portfolioValue) in the response
        res.json({ trade, user: user.toObject(), company });
    } catch (error) {
        console.error('Trade execution error:', {
            message: error.message,
            stack: error.stack,
            body: req.body,
            userId: req.user?._id
        });
        res.status(500).json({ 
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router; 