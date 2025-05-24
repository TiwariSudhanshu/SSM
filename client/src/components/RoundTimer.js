import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import SocketService from '../services/socket';
import api from '../services/api';

const RoundTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRoundActive, setIsRoundActive] = useState(false);

  useEffect(() => {
    // Fetch initial round status
    const fetchRoundStatus = async () => {
      try {
        const response = await api.get('/admin/rounds/status');
        if (response.data.isActive && response.data.round) {
          setIsRoundActive(true);
          const endTime = new Date(response.data.round.endTime).getTime();
          updateTimer(endTime);
        }
      } catch (error) {
        console.error('Error fetching round status:', error);
      }
    };

    fetchRoundStatus();

    const handleRoundUpdate = (data) => {
      if (data.type === 'start') {
        setIsRoundActive(true);
        const endTime = new Date(data.round.endTime).getTime();
        updateTimer(endTime);
      } else if (data.type === 'end') {
        setIsRoundActive(false);
        setTimeLeft(null);
      }
    };

    SocketService.onRoundUpdate(handleRoundUpdate);

    return () => {
      SocketService.offRoundUpdate(handleRoundUpdate);
    };
  }, []);

  const updateTimer = (endTime) => {
    // Clear any existing timer
    if (window.timerInterval) {
      clearInterval(window.timerInterval);
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft(null);
        setIsRoundActive(false);
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ minutes, seconds });
    }, 1000);

    // Store timer reference globally to prevent memory leaks
    window.timerInterval = timer;

    return () => clearInterval(timer);
  };

  if (!isRoundActive || !timeLeft) {
    return null;
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 2,
        textAlign: 'center'
      }}
    >
      <Typography variant="h5" gutterBottom>
        Current Round
      </Typography>
      <Typography variant="h4">
        Time Remaining: {timeLeft.minutes.toString().padStart(2, '0')}:
        {timeLeft.seconds.toString().padStart(2, '0')}
      </Typography>
    </Paper>
  );
};

export default RoundTimer; 