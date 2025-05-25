import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet /> {/* This is where nested routes will render */}
      </Container>
    </Box>
  );
};

export default MainLayout; 