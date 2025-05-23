const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User');

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
    if (esgScore < 0 || esgScore > 100) {
      return res.status(400).json({ message: 'ESG score must be between 0 and 100' });
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
    if (esgScore < 0 || esgScore > 100) {
      return res.status(400).json({ message: 'ESG score must be between 0 and 100' });
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

module.exports = router; 