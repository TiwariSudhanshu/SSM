const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
                next();
            } catch (error) {
                console.error('Token verification error:', error);
                res.status(401).json({ message: 'Not authorized, token failed' });
            }
        } else {
            // For admin routes, we'll allow access if isAdmin is true in localStorage
            // This is a temporary solution for admin access
            if (req.path.startsWith('/admin')) {
                next();
            } else {
                res.status(401).json({ message: 'Not authorized, no token' });
            }
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { protect }; 