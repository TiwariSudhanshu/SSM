import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getCompanies } from '../services/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError('Failed to fetch companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fefefe 0%, #f8f6f0 50%, #f0f4f0 100%)',
    padding: { xs: 2, sm: 3 },
  };

  const paperStyle = {
    p: { xs: 2.5, sm: 3 },
    backgroundColor: '#ffffff',
    border: '2px solid #e8f5e8',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    mb: 3,
  };

  const headingStyle = {
    color: '#2d5016',
    fontWeight: 'bold',
    mb: 2,
  };

  const tableStyle = {
    '& .MuiTableHead-root': {
      backgroundColor: '#f8fdf8',
    },
    '& .MuiTableCell-head': {
      color: '#2d5016',
      fontWeight: 600,
      fontSize: '0.875rem',
      borderBottom: '2px solid #e8f5e8',
    },
    '& .MuiTableCell-body': {
      color: '#374151',
      fontSize: '0.875rem',
      borderBottom: '1px solid #f3f4f6',
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: '#f8fdf8',
    },
  };

  if (loading) {
    return (
      <Box sx={{ ...containerStyle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#22c55e' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={containerStyle}>
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={containerStyle}>
      <Paper sx={paperStyle}>
        <Typography variant="h3" sx={{ ...headingStyle, fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 1 }}>
          All Companies
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '1.1rem', mb: 3 }}>
          Available companies for trading
        </Typography>

        <TableContainer component={Paper} sx={{ ...tableStyle, mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Sector</TableCell>
                <TableCell align="right">Stock Price</TableCell>
                <TableCell align="right">Available Shares</TableCell>
                <TableCell align="right">ESG Score</TableCell>
                <TableCell align="right">Market Cap</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.sector}</TableCell>
                  <TableCell align="right">${company.stockPrice?.toFixed(2)}</TableCell>
                  <TableCell align="right">{company.availableShares?.toLocaleString()}</TableCell>
                  <TableCell align="right">{company.esgScore?.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    ${(company.stockPrice * company.availableShares)?.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Companies; 