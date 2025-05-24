import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trade from './pages/Trade';
import AdminLayout from './pages/Admin/AdminLayout';
import Companies from './pages/Admin/Companies';
import Users from './pages/Admin/Users';
import Rounds from './pages/Admin/Rounds';
import AdminLogin from './pages/Admin/AdminLogin';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fdfdf4', // soft cream background
      paper: '#ffffff',   // white cards
    },
    primary: {
      main: '#4CAF50', // green accent (for buttons, headings)
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#81C784', // lighter green for hover/effects
    },
    text: {
      primary: '#2E7D32', // dark green for headings
      secondary: '#666666', // grey for labels/descriptions
    },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h5: {
      fontWeight: 600,
      color: '#2E7D32',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 10px rgba(76, 175, 80, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #C8E6C9',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused fieldset': {
              borderColor: '#4CAF50',
            },
          },
        },
      },
    },
  },
});


function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route 
                path="/login" 
                element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
              />
              <Route 
                path="/register" 
                element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
              />
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/trade" 
                element={isAuthenticated ? <Trade /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/admin-login" 
                element={!isAdmin ? <AdminLogin /> : <Navigate to="/admin" />} 
              />
              <Route 
                path="/admin" 
                element={isAdmin ? <AdminLayout /> : <Navigate to="/admin-login" />}
              >
                <Route path="companies" element={<Companies />} />
                <Route path="users" element={<Users />} />
                <Route path="rounds" element={<Rounds />} />
                <Route index element={<Navigate to="companies" />} />
              </Route>
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 