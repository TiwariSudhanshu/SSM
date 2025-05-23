import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        this.socket = io(SOCKET_URL);

        this.socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
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
}

export default new SocketService(); 