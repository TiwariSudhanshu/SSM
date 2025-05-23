import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
} from '@mui/material';
import { getPortfolio, getCompanies } from '../services/api';
import socketService from '../services/socket';

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioData, companiesData] = await Promise.all([
          getPortfolio(),
          getCompanies(),
        ]);
        setPortfolio(portfolioData);
        setCompanies(companiesData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Socket.IO listeners
    socketService.connect();
    socketService.onTradeUpdate((data) => {
      if (data.userId === portfolio?._id) {
        fetchData();
      }
    });
    socketService.onCompanyUpdate(() => {
      fetchData();
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Portfolio Summary */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Portfolio Summary
          </Typography>
          <Typography>
            Total Value: ${portfolio?.portfolioValue?.toFixed(2)}
          </Typography>
          <Typography>
            ESG Score: {portfolio?.esgScore}
          </Typography>
          <Typography>
            Average ESG Score: {portfolio?.avgESGScore?.toFixed(2)}
          </Typography>
          <Typography>
            Normalized Value: {portfolio?.normalizedValue?.toFixed(2)}
          </Typography>
          <Typography>
            Sector Score: {portfolio?.sectorScore?.toFixed(2)}
          </Typography>
          <Typography>
            Final Score: {portfolio?.finalScore?.toFixed(2)}
          </Typography>
          {portfolio?.sectorDistribution && (
            <Box mt={2}>
              <Typography variant="subtitle1">Sector Distribution:</Typography>
              <ul>
                {Object.entries(portfolio.sectorDistribution).map(([sector, shares]) => (
                  <li key={sector}>{sector}: {shares} shares</li>
                ))}
              </ul>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Holdings */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Holdings
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Shares</TableCell>
                  <TableCell align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolio?.holdings.map((holding) => (
                  <TableRow key={holding.company._id}>
                    <TableCell>{holding.company.name}</TableCell>
                    <TableCell align="right">{holding.shares}</TableCell>
                    <TableCell align="right">
                      ${(holding.shares * holding.company.stockPrice).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>

      {/* Available Companies */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Available Companies
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Sector</TableCell>
                  <TableCell align="right">Stock Price</TableCell>
                  <TableCell align="right">Available Shares</TableCell>
                  <TableCell align="right">ESG Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company._id}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.sector}</TableCell>
                    <TableCell align="right">${company.stockPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">{company.availableShares}</TableCell>
                    <TableCell align="right">{company.esgScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 