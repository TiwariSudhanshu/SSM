import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

const AdminLeaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetch all users, including their finalScore
      const response = await api.get('/admin/users'); 
      // Sort users by finalScore in descending order
      const sortedUsers = response.data.sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));
      setUsers(sortedUsers);
      setError('');
    } catch (err) {
      console.error('Error fetching users for leaderboard:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#2d5016', fontWeight: 'bold' }}>
        Admin Leaderboard
      </Typography>

      {users.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fdf8' }}>
                <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }} align="right">Final Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell align="right">{user.finalScore?.toFixed(2) || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No user data available yet.</Typography>
      )}
    </Box>
  );
};

export default AdminLeaderboard; 