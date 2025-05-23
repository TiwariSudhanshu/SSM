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
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
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