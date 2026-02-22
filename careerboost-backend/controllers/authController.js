// Authentication controller using Mock Data (No Database required)
const { users } = require('../utils/mockData');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory OTP store for signup flow
const pendingUsers = new Map();

const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Generate 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Start Registration - Creates user immediately (No OTP)
exports.register = async (req, res) => {
    try {
        const { email, username, password, confirmPassword, name, location } = req.body;

        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ success: false, error: 'Passwords do not match' });
        }

        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ success: false, error: 'Valid email is required' });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
        }

        const finalUsername = username || email.split('@')[0];
        const finalName = name || finalUsername;

        // Check if user already exists in mock data
        const existingUser = users.find(u => u.email === email || u.username === username);

        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the actual user immediately
        const newUser = {
            id: `user_${Date.now()}`,
            email,
            username: finalUsername,
            password: hashedPassword,
            name: finalName,
            location: location || 'Mumbai, India',
            bio: '',
            createdAt: new Date()
        };

        // Add to in-memory mock users
        users.push(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            id: newUser.id,
            userId: newUser.id,
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: 'Failed to create user' });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    const { otp, email } = req.body;

    // In production, verify against stored OTP (e.g., in Redis or DB)
    // For now, removing the insecure '123456' bypass

    if (otp === '999999') {
        return res.status(400).json({ success: false, message: 'OTP has expired' });
    }
    res.status(400).json({ success: false, message: 'Invalid OTP' });
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        // Find user in mock data
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Login failed' });
    }
};

// Verify token
exports.verify = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, valid: false, error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = users.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(401).json({ success: false, valid: false, error: 'Invalid token' });
        }

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            valid: true,
            userId: user.id,
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(401).json({ success: false, valid: false, error: 'Invalid token' });
    }
};
