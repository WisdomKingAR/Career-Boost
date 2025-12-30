// Certificates routes
const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', certificateController.getAllCertificates);
router.get('/search', certificateController.searchCertificates);
router.get('/:id', certificateController.getCertificateById);

// Protected routes (require authentication)
router.post('/:id/save', authMiddleware, certificateController.saveCertificate);
router.delete('/:id/save', authMiddleware, certificateController.unsaveCertificate);

module.exports = router;
