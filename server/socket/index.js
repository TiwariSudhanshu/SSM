const socketIO = require('socket.io');

let io;

const initializeSocket = (server) => {
    try {
        io = socketIO(server, {
            cors: {
                origin: "https://stocks.ecellrgpv.com/",
                methods: ["GET", "POST"],
                credentials: true
            },
            pingTimeout: 60000,
            pingInterval: 25000
        });

        io.on('connection', (socket) => {
            console.log('New client connected with ID:', socket.id);

            // Handle client errors
            socket.on('error', (error) => {
                console.error('Socket error for client', socket.id, ':', error);
            });

            // Handle disconnection
            socket.on('disconnect', (reason) => {
                console.log('Client disconnected:', socket.id, 'Reason:', reason);
            });

            // Handle reconnection attempts
            socket.on('reconnect_attempt', (attemptNumber) => {
                console.log('Client attempting to reconnect:', socket.id, 'Attempt:', attemptNumber);
            });

            // Handle successful reconnection
            socket.on('reconnect', (attemptNumber) => {
                console.log('Client reconnected:', socket.id, 'After', attemptNumber, 'attempts');
            });

            // Handle reconnection failure
            socket.on('reconnect_failed', () => {
                console.error('Client failed to reconnect:', socket.id);
            });
        });

        console.log('Socket.IO server initialized successfully');
        return io;
    } catch (error) {
        console.error('Error initializing Socket.IO:', error);
        throw error;
    }
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIO
}; 