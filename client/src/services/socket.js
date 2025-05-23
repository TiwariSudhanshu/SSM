import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
        this.roundUpdateCallbacks = new Set();
        this.isConnecting = false;
    }

    connect() {
        if (this.socket?.connected || this.isConnecting) {
            return this.socket;
        }

        this.isConnecting = true;
        this.socket = io(SOCKET_URL, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
            this.isConnecting = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.isConnecting = false;
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        // Set up round update listener
        this.socket.on('roundUpdate', (data) => {
            this.roundUpdateCallbacks.forEach(callback => callback(data));
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    onTradeUpdate(callback) {
        if (this.socket) {
            this.socket.on('tradeUpdate', callback);
        }
    }

    onCompanyUpdate(callback) {
        if (this.socket) {
            this.socket.on('companyUpdate', callback);
        }
    }

    onRoundUpdate(callback) {
        if (this.socket) {
            this.roundUpdateCallbacks.add(callback);
        }
    }

    offTradeUpdate(callback) {
        if (this.socket) {
            this.socket.off('tradeUpdate', callback);
        }
    }

    offCompanyUpdate(callback) {
        if (this.socket) {
            this.socket.off('companyUpdate', callback);
        }
    }

    offRoundUpdate(callback) {
        if (this.socket) {
            this.roundUpdateCallbacks.delete(callback);
        }
    }
}

export default new SocketService(); 