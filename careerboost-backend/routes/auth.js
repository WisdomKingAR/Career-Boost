// Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Verify token
router.get('/verify', authController.verify);

// Verify OTP
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;
