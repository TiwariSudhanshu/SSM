import { useState, useEffect } from 'react';
import api from '../services/api';
import socketService from '../services/socket';

const useRoundStatus = () => {
  const [roundStatus, setRoundStatus] = useState({
    isActive: false,
    tradeEnabled: false,
    round: null
  });

  useEffect(() => {
    const fetchRoundStatus = async () => {
      try {
        const response = await api.get('/admin/rounds/status');
        setRoundStatus(response.data);
      } catch (error) {
        console.error('Error fetching round status:', error);
      }
    };

    const handleRoundUpdate = (data) => {
      if (data.type === 'start') {
        setRoundStatus({
          isActive: true,
          tradeEnabled: true,
          round: data.round
        });
      } else if (data.type === 'end') {
        setRoundStatus({
          isActive: false,
          tradeEnabled: false,
          round: data.round
        });
      }
    };

    // Initial fetch
    fetchRoundStatus();

    // Subscribe to socket updates
    socketService.onRoundUpdate(handleRoundUpdate);

    return () => {
      socketService.offRoundUpdate(handleRoundUpdate);
    };
  }, []);

  return roundStatus;
};

export default useRoundStatus; 