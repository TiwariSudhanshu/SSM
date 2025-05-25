import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import api from '../../services/api';

const Rounds = () => {
  const [currentRound, setCurrentRound] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [duration, setDuration] = useState('');

  const fetchCurrentRound = async () => {
    try {
      const response = await api.get('/admin/rounds/current');
      setCurrentRound(response.data);
    } catch (error) {
      console.error('Error fetching current round:', error);
    }
  };

  useEffect(() => {
    fetchCurrentRound();
  }, []);

  const handleStartRound = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/rounds/start', { duration: parseInt(duration) });
      setIsModalVisible(false);
      setDuration('');
      fetchCurrentRound();
    } catch (error) {
      console.error('Error starting round:', error);
    }
  };

  const handleEndRound = async () => {
    try {
      await api.post('/admin/rounds/end');
      fetchCurrentRound();
    } catch (error) {
      console.error('Error ending round:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#2d5016', fontWeight: 'bold' }}>
        Round Management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, color: '#2d5016' }}>
                Current Round Status
              </Typography>

              {currentRound ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Paper sx={{ p: 2, bgcolor: '#f8fdf8' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TimerIcon color="primary" />
                      <Typography variant="h6">Round {currentRound.roundNumber}</Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: currentRound.isActive ? '#52c41a' : '#ff4d4f',
                        fontWeight: 'bold',
                      }}
                    >
                      Status: {currentRound.isActive ? 'Active' : 'Ended'}
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: '#f8fdf8' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Start Time
                    </Typography>
                    <Typography>
                      {new Date(currentRound.startTime).toLocaleString()}
                    </Typography>
                  </Paper>

                  <Paper sx={{ p: 2, bgcolor: '#f8fdf8' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      End Time
                    </Typography>
                    <Typography>
                      {new Date(currentRound.endTime).toLocaleString()}
                    </Typography>
                  </Paper>

                  {currentRound.isActive && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<StopIcon />}
                      onClick={handleEndRound}
                      fullWidth
                    >
                      End Round
                    </Button>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography color="text.secondary">No active round</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => setIsModalVisible(true)}
                    fullWidth
                  >
                    Start New Round
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Start New Round</DialogTitle>
        <form onSubmit={handleStartRound}>
          <DialogContent>
            <TextField
              label="Round Duration (minutes)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Start Round
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Rounds; 