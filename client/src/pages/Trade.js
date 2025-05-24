import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { getCompanies, executeTrade } from '../services/api';
import SocketService from '../services/socket';
import useRoundStatus from '../hooks/useRoundStatus';

const Trade = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [shares, setShares] = useState('');
  const [tradeType, setTradeType] = useState('BUY');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isActive, tradeEnabled } = useRoundStatus();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companiesData = await getCompanies();
        
        // Ensure we have valid data
        if (Array.isArray(companiesData)) {
          setCompanies(companiesData);
        } else {
          console.error('Invalid companies data:', companiesData);
          setError('Failed to load companies');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Socket.IO listeners for real-time updates
    SocketService.connect();
    SocketService.onCompanyUpdate(() => {
      fetchData();
    });

    return () => {
      SocketService.disconnect();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await executeTrade({
        companyId: selectedCompany,
        type: tradeType,
        shares: parseInt(shares),
      });
      setSuccess('Trade executed successfully');
      setSelectedCompany('');
      setShares('');
    } catch (err) {
      setError(err.message || 'Failed to execute trade');
    }
  };

  if (!isActive) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="info">
          Trading is currently disabled. Trading will be enabled when a new round starts.
        </Alert>
      </Paper>
    );
  }

  if (!tradeEnabled) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="warning">
          Trading has been disabled for this round.
        </Alert>
      </Paper>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trade
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Execute Trade
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Company</InputLabel>
                <Select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  required
                >
                  {companies.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      {company.name} - ${company.stockPrice}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Trade Type</InputLabel>
                <Select
                  value={tradeType}
                  onChange={(e) => setTradeType(e.target.value)}
                  required
                >
                  <MenuItem value="BUY">Buy</MenuItem>
                  <MenuItem value="SELL">Sell</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Number of Shares"
                type="number"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                margin="normal"
                required
                inputProps={{ min: 1 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Execute Trade
              </Button>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Company Details
            </Typography>
            {selectedCompany && (
              <>
                {companies
                  .filter((company) => company._id === selectedCompany)
                  .map((company) => (
                    <Box key={company._id}>
                      <Typography>
                        <strong>Name:</strong> {company.name}
                      </Typography>
                      <Typography>
                        <strong>Sector:</strong> {company.sector}
                      </Typography>
                      <Typography>
                        <strong>Stock Price:</strong> ${company.stockPrice}
                      </Typography>
                      <Typography>
                        <strong>Available Shares:</strong> {company.availableShares}
                      </Typography>
                      <Typography>
                        <strong>ESG Score:</strong> {company.esgScore}
                      </Typography>
                      <Typography>
                        <strong>Description:</strong> {company.description}
                      </Typography>
                    </Box>
                  ))}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Trade; 