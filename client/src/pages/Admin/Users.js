import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  IconButton,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#2d5016', fontWeight: 'bold' }}>
        User Management
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fdf8' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Balance</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role ? user.role.toUpperCase() : 'USER'}
                      color={user.role === 'admin' ? 'error' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>₹{(user.balance || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewDetails(user)}
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Name:</strong> {selectedUser.name || 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Email:</strong> {selectedUser.email || 'N/A'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Role:</strong> {selectedUser.role || 'USER'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Balance:</strong> ₹{(selectedUser.balance || 0).toFixed(2)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Created At:</strong>{' '}
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleDateString()
                  : 'N/A'}
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Portfolio Holdings:
              </Typography>
              {selectedUser.portfolio && selectedUser.portfolio.length > 0 ? (
                <Box component="ul" sx={{ pl: 2 }}>
                  {selectedUser.portfolio.map((holding) => (
                    <Typography component="li" key={holding.companyId} sx={{ mb: 1 }}>
                      {holding.companyName || 'Unknown Company'}: {holding.shares || 0} shares
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography>No holdings</Typography>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Users; 