import { io } from 'socket.io-client';

const SOCKET_URL = 'https://stock-market-simulator-xlyy.onrender.com';

class SocketService {
    constructor() {
        this.socket = null;
        this.roundUpdateCallbacks = new Set();
        this.isConnecting = false;
        this.connectionPromise = null;
        console.log('[SocketService] Initialized');
    }

    async connect() {
        console.log('[SocketService] connect() called');
        
        // If already connected, return existing socket
        if (this.socket?.connected) {
            console.log('[SocketService] Already connected');
            return this.socket;
        }

        // If connection is in progress, return the promise
        if (this.isConnecting) {
            console.log('[SocketService] Connection attempt already in progress');
            return this.connectionPromise;
        }

        this.isConnecting = true;
        console.log('[SocketService] Attempting to connect to', SOCKET_URL);

        this.connectionPromise = new Promise((resolve, reject) => {
            try {
                this.socket = io(SOCKET_URL, {
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 10000,
                    transports: ['websocket', 'polling'],
                    withCredentials: true,
                    forceNew: true
                });

                this.socket.on('connect', () => {
                    console.log('[SocketService] Connected to socket server with id:', this.socket.id);
                    this.isConnecting = false;
                    resolve(this.socket);
                });

                this.socket.on('connect_error', (error) => {
                    console.error('[SocketService] Socket connection error:', error);
                    this.isConnecting = false;
                    reject(error);
                });

                this.socket.on('disconnect', (reason) => {
                    console.log('[SocketService] Disconnected from socket server, reason:', reason);
                    this.isConnecting = false;
                });

                this.socket.on('error', (error) => {
                    console.error('[SocketService] Socket error:', error);
                });

                this.socket.on('roundUpdate', (data) => {
                    console.log('[SocketService] Received roundUpdate event:', data);
                    this.roundUpdateCallbacks.forEach(callback => {
                        try {
                            callback(data);
                        } catch (callbackErr) {
                            console.error('[SocketService] Error in roundUpdate callback:', callbackErr);
                        }
                    });
                });
            } catch (err) {
                console.error('[SocketService] Error creating socket:', err);
                this.isConnecting = false;
                reject(err);
            }
        });

        return this.connectionPromise;
    }

    async disconnect() {
        console.log('[SocketService] disconnect() called');
        if (this.socket) {
            console.log('[SocketService] Disconnecting socket with id:', this.socket.id);
            this.socket.disconnect();
            this.socket = null;
            this.isConnecting = false;
            this.connectionPromise = null;
            console.log('[SocketService] Socket disconnected and cleaned up');
        } else {
            console.log('[SocketService] No socket to disconnect');
        }
    }

    async onTradeUpdate(callback) {
        console.log('[SocketService] Registering tradeUpdate callback');
        try {
            const socket = await this.connect();
            socket.on('tradeUpdate', (data) => {
                try {
                    callback(data);
                } catch (err) {
                    console.error('[SocketService] Error in tradeUpdate callback:', err);
                }
            });
        } catch (err) {
            console.error('[SocketService] Failed to register tradeUpdate callback:', err);
        }
    }

    async onCompanyUpdate(callback) {
        console.log('[SocketService] Registering companyUpdate callback');
        try {
            const socket = await this.connect();
            socket.on('companyUpdate', (data) => {
                try {
                    callback(data);
                } catch (err) {
                    console.error('[SocketService] Error in companyUpdate callback:', err);
                }
            });
        } catch (err) {
            console.error('[SocketService] Failed to register companyUpdate callback:', err);
        }
    }

    onRoundUpdate(callback) {
        console.log('[SocketService] Adding roundUpdate callback');
        this.roundUpdateCallbacks.add(callback);
    }

    offTradeUpdate(callback) {
        console.log('[SocketService] Removing tradeUpdate callback');
        if (this.socket) {
            this.socket.off('tradeUpdate', callback);
        }
    }

    offCompanyUpdate(callback) {
        console.log('[SocketService] Removing companyUpdate callback');
        if (this.socket) {
            this.socket.off('companyUpdate', callback);
        }
    }

    offRoundUpdate(callback) {
        console.log('[SocketService] Removing roundUpdate callback');
        this.roundUpdateCallbacks.delete(callback);
    }
}

export default new SocketService();
