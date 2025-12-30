// Users routes
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// All user routes require authentication
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/skills', userController.addSkill);
router.delete('/skills/:skillId', userController.removeSkill);
router.get('/saved', userController.getSavedItems);
router.get('/applications', userController.getApplications);

module.exports = router;
