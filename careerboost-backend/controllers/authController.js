// Authentication controller using Prisma with OTP flow
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../services/emailService');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Start Registration - Sends OTP
exports.register = async (req, res) => {
    try {
        const { email, username, password, name, location } = req.body;

        // Validation
        if (!email || !username || !password || !name) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate 6-digit OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiry

        // Store in PendingUser (upsert if same email)
        await prisma.pendingUser.upsert({
            where: { email },
            update: {
                username,
                password: hashedPassword,
                name,
                location: location || 'Mumbai, India',
                otp,
                expiresAt
            },
            create: {
                email,
                username,
                password: hashedPassword,
                name,
                location: location || 'Mumbai, India',
                otp,
                expiresAt
            }
        });

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email. Please verify to complete registration.',
            email
        });
    } catch (error) {
        console.error('Registration/OTP error:', error);
        res.status(500).json({ success: false, error: 'Failed to initiate registration' });
    }
};

// Verify OTP and complete registration
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, error: 'Email and OTP are required' });
        }

        // Find pending user
        const pendingUser = await prisma.pendingUser.findUnique({
            where: { email }
        });

        if (!pendingUser) {
            return res.status(400).json({ success: false, error: 'Verification record not found. Please register again.' });
        }

        // Check expiry
        if (new Date() > pendingUser.expiresAt) {
            return res.status(400).json({ success: false, error: 'OTP has expired. Please register again.' });
        }

        // Check OTP
        if (pendingUser.otp !== otp) {
            return res.status(400).json({ success: false, error: 'Invalid OTP' });
        }

        // Create the actual user
        const newUser = await prisma.user.create({
            data: {
                email: pendingUser.email,
                username: pendingUser.username,
                password: pendingUser.password,
                name: pendingUser.name,
                location: pendingUser.location
            }
        });

        // Delete pending record
        await prisma.pendingUser.delete({
            where: { email }
        });

        // Generate JWT token
        if (!JWT_SECRET) {
            return res.status(500).json({ success: false, error: 'Server misconfigured: missing JWT secret' });
        }
        const token = jwt.sign(
            { userId: newUser.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        const { password: _, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            message: 'Email verified and account created successfully!',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('OTP Verification error:', error);
        res.status(500).json({ success: false, error: 'Verification failed' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({ success: false, error: 'Server misconfigured: missing JWT secret' });
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
            return res.status(401).json({ success: false, error: 'No token provided' });
        }

        if (!JWT_SECRET) {
            return res.status(500).json({ success: false, error: 'Server misconfigured: missing JWT secret' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }

        const { password: _, ...userWithoutPassword } = user;

        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};
