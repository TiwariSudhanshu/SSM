import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { TrendingUp, BarChart3, PieChart, Trophy } from "lucide-react"

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleStartSimulation = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FAF7F0 0%, #F5F5DC 100%)',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            mb: 6,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: '#2d5016',
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Welcome to Imprenditore
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: '#4a6741',
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Experience the thrill of stock market simulation with our innovative platform.
            Learn, practice, and master trading strategies in a risk-free environment.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleStartSimulation}
            startIcon={<PlayArrow />}
            sx={{
              backgroundColor: '#6B8E23',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '12px 32px',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: '#556B2F',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(107, 142, 35, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Simulation
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
