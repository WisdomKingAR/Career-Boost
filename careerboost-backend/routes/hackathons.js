// Hackathons routes
const express = require('express');
const router = express.Router();
const hackathonController = require('../controllers/hackathonController');
const authMiddleware = require('../middleware/auth');

router.get('/', hackathonController.getAllHackathons);
router.get('/upcoming', hackathonController.getUpcomingHackathons);
router.get('/:id', hackathonController.getHackathonById);
router.post('/:id/save', authMiddleware, hackathonController.saveHackathon);

module.exports = router;
