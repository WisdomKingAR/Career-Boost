// Internships routes
const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');
const authMiddleware = require('../middleware/auth');

router.get('/', internshipController.getAllInternships);
router.get('/search', internshipController.searchInternships);
router.get('/:id', internshipController.getInternshipById);
router.post('/:id/save', authMiddleware, internshipController.saveInternship);
router.post('/:id/apply', authMiddleware, internshipController.applyForInternship);

module.exports = router;
