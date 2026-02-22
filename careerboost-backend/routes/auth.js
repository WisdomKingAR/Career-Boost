// Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');

// Validation Schemas
const registerSchema = {
    email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, maxLength: 254 },
    password: { type: 'string', required: true, minLength: 8, maxLength: 128 },
    username: { type: 'string', required: true, minLength: 3, maxLength: 50, pattern: /^[a-zA-Z0-9_]+$/ },
    name: { type: 'string', maxLength: 100 },
    confirmPassword: { type: 'string', required: true },
    location: { type: 'string', maxLength: 100 }
};

const loginSchema = {
    email: { type: 'string', required: true },
    password: { type: 'string', required: true }
};

const verifyOtpSchema = {
    email: { type: 'string', required: true },
    otp: { type: 'string', required: true, minLength: 6, maxLength: 6 }
};

// Register new user
router.post('/register', validate(registerSchema), authController.register);

// Login user
router.post('/login', validate(loginSchema), authController.login);

// Verify token
router.get('/verify', authController.verify);

// Verify OTP
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOTP);

module.exports = router;
