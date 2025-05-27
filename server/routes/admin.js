const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User');
const Round = require('../models/Round');
const { getIO } = require('../socket');
const { calculatePortfolioMetrics } = require('../utils/scoreCalculations');

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
});

// Add new company
router.post('/companies', async (req, res) => {
  try {
    const { name, sector, description, stockPrice, esgScore, availableShares } = req.body;

    // Validate required fields
    if (!name || !sector || !description || !stockPrice || !esgScore || !availableShares) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate ESG score
    if (esgScore < 1 || esgScore > 10) {
      return res.status(400).json({ message: 'ESG score must be between 1 and 10' });
    }

    // Check if company with same name exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this name already exists' });
    }

    const company = new Company({
      name,
      sector,
      description,
      stockPrice,
      esgScore,
      availableShares,
    });
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ message: 'Failed to create company' });
  }
});

// Update company
router.put('/companies/:id', async (req, res) => {
  try {
    const { name, sector, description, stockPrice, esgScore, availableShares } = req.body;

    // Validate required fields
    if (!name || !sector || !description || !stockPrice || !esgScore || !availableShares) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate ESG score
    if (esgScore < 1 || esgScore > 10) {
      return res.status(400).json({ message: 'ESG score must be between 1 and 10' });
    }

    // Check if company exists
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if name is being changed and if it conflicts with another company
    if (name !== company.name) {
      const existingCompany = await Company.findOne({ name });
      if (existingCompany) {
        return res.status(400).json({ message: 'Company with this name already exists' });
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { name, sector, description, stockPrice, esgScore, availableShares },
      { new: true }
    );
    res.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ message: 'Failed to update company' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ username: 1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Update share price
router.put('/companies/:id/price', async (req, res) => {
  try {
    const { currentPrice } = req.body;

    // Validate price
    if (!currentPrice || currentPrice < 0) {
      return res.status(400).json({ message: 'Valid price is required' });
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { currentPrice },
      { new: true }
    );
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    res.json(company);
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ message: 'Failed to update price' });
  }
});

// Get current round
router.get('/rounds/current', async (req, res) => {
  try {
    const currentRound = await Round.findOne({ isActive: true });
    res.json(currentRound);
  } catch (error) {
    console.error('Error fetching current round:', error);
    res.status(500).json({ message: 'Failed to fetch current round' });
  }
});

// Start new round
router.post('/rounds/start', async (req, res) => {
  try {
    const { duration } = req.body;
    const io = getIO();

    // Check if there's already an active round
    const activeRound = await Round.findOne({ isActive: true });
    if (activeRound) {
      return res.status(400).json({ message: 'There is already an active round' });
    }

    // Get the last round number
    const lastRound = await Round.findOne().sort({ roundNumber: -1 });
    const roundNumber = lastRound ? lastRound.roundNumber + 1 : 1;

    // Create new round
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000); // Convert minutes to milliseconds

    const round = new Round({
      startTime,
      endTime,
      isActive: true,
      roundNumber,
      tradeEnabled: true
    });

    await round.save();

    // Set up automatic round ending
    const timeUntilEnd = endTime - startTime;
    setTimeout(async () => {
      const currentRound = await Round.findOne({ _id: round._id, isActive: true });
      if (currentRound) {
        // Get all companies and users for calculations
        const [companies, users] = await Promise.all([
          Company.find(),
          User.find()
        ]);

        // Calculate metrics for each user
        const userMetrics = users.map(user => {
          const metrics = calculatePortfolioMetrics(user, companies, users);
          
          return User.findByIdAndUpdate(
            user._id,
            {
              portfolioValue: metrics.portfolioValue,
              avgESGScore: metrics.avgESGScore,
              normalizedValue: metrics.normalizedValue,
              sectorScore: metrics.sectorScore,
              finalScore: metrics.finalScore,
              sectorDistribution: metrics.sectorDistribution
            },
            { new: true }
          );
        });

        await Promise.all(userMetrics);

        // End the round and disable trading
        currentRound.isActive = false;
        currentRound.tradeEnabled = false;
        await currentRound.save();

        // Notify all clients about the round end and new metrics
        io.emit('roundUpdate', {
          type: 'end',
          round: currentRound,
          metrics: users.map(user => ({
            userId: user._id,
            portfolioValue: user.portfolioValue,
            avgESGScore: user.avgESGScore,
            normalizedValue: user.normalizedValue,
            sectorScore: user.sectorScore,
            finalScore: user.finalScore,
            sectorDistribution: user.sectorDistribution
          }))
        });
      }
    }, timeUntilEnd);

    // Notify all clients about the new round
    io.emit('roundUpdate', {
      type: 'start',
      round: round
    });

    res.status(201).json(round);
  } catch (error) {
    console.error('Error starting round:', error);
    res.status(500).json({ message: 'Failed to start round' });
  }
});

// End current round
router.post('/rounds/end', async (req, res) => {
  try {
    const io = getIO();
    const currentRound = await Round.findOne({ isActive: true });

    if (!currentRound) {
      return res.status(400).json({ message: 'No active round found' });
    }

    // Get all companies and users for calculations
    const [companies, users] = await Promise.all([
      Company.find(),
      User.find()
    ]);

    // Calculate metrics for each user
    const userMetrics = users.map(user => {
      const metrics = calculatePortfolioMetrics(user, companies, users);
      
      return User.findByIdAndUpdate(
        user._id,
        {
          portfolioValue: metrics.portfolioValue,
          avgESGScore: metrics.avgESGScore,
          normalizedValue: metrics.normalizedValue,
          sectorScore: metrics.sectorScore,
          finalScore: metrics.finalScore,
          sectorDistribution: metrics.sectorDistribution
        },
        { new: true }
      );
    });

    await Promise.all(userMetrics);

    // End the round and disable trading
    currentRound.isActive = false;
    currentRound.tradeEnabled = false;
    await currentRound.save();

    // Notify all clients about the round end and new metrics
    io.emit('roundUpdate', {
      type: 'end',
      round: currentRound,
      metrics: users.map(user => ({
        userId: user._id,
        portfolioValue: user.portfolioValue,
        avgESGScore: user.avgESGScore,
        normalizedValue: user.normalizedValue,
        sectorScore: user.sectorScore,
        finalScore: user.finalScore,
        sectorDistribution: user.sectorDistribution
      }))
    });

    res.json({
      round: currentRound,
      metrics: users.map(user => ({
        userId: user._id,
        portfolioValue: user.portfolioValue,
        avgESGScore: user.avgESGScore,
        normalizedValue: user.normalizedValue,
        sectorScore: user.sectorScore,
        finalScore: user.finalScore,
        sectorDistribution: user.sectorDistribution
      }))
    });
  } catch (error) {
    console.error('Error ending round:', error);
    res.status(500).json({ message: 'Failed to end round' });
  }
});

// Get current round status
router.get('/rounds/status', async (req, res) => {
  try {
    const currentRound = await Round.findOne({ isActive: true });
    res.json({
      isActive: !!currentRound,
      tradeEnabled: currentRound?.tradeEnabled || false,
      round: currentRound
    });
  } catch (error) {
    console.error('Error fetching round status:', error);
    res.status(500).json({ message: 'Failed to fetch round status' });
  }
});

// Get top 10 users by final score
router.get('/leaderboard', async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ finalScore: -1 })
      .limit(10)
      .select('name finalScore'); // Select only name and finalScore

    res.json(topUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
});

module.exports = router; 