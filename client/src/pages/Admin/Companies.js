import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    description: '',
    stockPrice: '',
    esgScore: '',
    availableShares: '',
  });

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/admin/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddEdit = (company = null) => {
    setEditingCompany(company);
    if (company) {
      setFormData({
        name: company.name || '',
        sector: company.sector || '',
        description: company.description || '',
        stockPrice: company.stockPrice || '',
        esgScore: company.esgScore || '',
        availableShares: company.availableShares || '',
      });
    } else {
      setFormData({
        name: '',
        sector: '',
        description: '',
        stockPrice: '',
        esgScore: '',
        availableShares: '',
      });
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await api.put(`/admin/companies/${editingCompany._id}`, formData);
      } else {
        await api.post('/admin/companies', formData);
      }
      setIsModalVisible(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error submitting company:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        Company Management
      </Typography>

      <Card sx={{ mb: 3, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
        <CardContent>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAddEdit()}
            startIcon={<EditIcon />}
          >
            Add New Company
          </Button>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fdf8' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Company Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Sector</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Stock Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>ESG Score</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Available Shares</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#2d5016' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company) => (
                <TableRow key={company._id} hover>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.sector}</TableCell>
                  <TableCell align="right">₹{(company.stockPrice || 0).toFixed(2)}</TableCell>
                  <TableCell align="right">{company.esgScore || 0}</TableCell>
                  <TableCell align="right">{company.availableShares || 0}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleAddEdit(company)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={companies.length}
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
        <DialogTitle>
          {editingCompany ? 'Edit Company' : 'Add New Company'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                name="name"
                label="Company Name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="sector"
                label="Sector"
                value={formData.sector}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                name="stockPrice"
                label="Stock Price"
                type="number"
                value={formData.stockPrice}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                name="esgScore"
                label="ESG Score"
                type="number"
                value={formData.esgScore}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ min: 1, max: 10, step: 0.1 }}
              />
              <TextField
                name="availableShares"
                label="Available Shares"
                type="number"
                value={formData.availableShares}
                onChange={handleChange}
                required
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingCompany ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Companies; 