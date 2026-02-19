// Users routes
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation Schemas
const updateProfileSchema = {
    name: { type: 'string', maxLength: 100 },
    location: { type: 'string', maxLength: 100 },
    bio: { type: 'string', maxLength: 500 },
    email: { type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, maxLength: 254 }
};

const addSkillSchema = {
    name: { type: 'string', required: true, maxLength: 50 },
    level: { type: 'string', maxLength: 20 }
};

// All user routes require authentication
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/skills', validate(addSkillSchema), userController.addSkill);
router.delete('/skills/:skillId', validate({}), userController.removeSkill);
router.get('/saved', userController.getSavedItems);
router.get('/applications', userController.getApplications);

module.exports = router;
