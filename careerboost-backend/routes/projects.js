// Projects routes
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation Schemas
const generateSchema = {
    prompt: { type: 'string', required: true, maxLength: 1000 }
};

router.get('/', projectController.getAllProjects);
router.post('/generate', validate(generateSchema), projectController.generateProjectIdeas);
router.get('/:id', projectController.getProjectById);
router.post('/:id/start', authMiddleware, projectController.startProject);

module.exports = router;
