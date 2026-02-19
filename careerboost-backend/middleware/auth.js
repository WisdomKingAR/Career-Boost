// Authentication middleware
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET not found in environment');
            return res.status(500).json({ error: 'Server authentication misconfigured' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Add user ID to request
        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
