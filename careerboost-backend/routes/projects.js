// Projects routes
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

router.get('/', projectController.getAllProjects);
router.post('/generate', projectController.generateProjectIdeas);
router.get('/:id', projectController.getProjectById);
router.post('/:id/start', authMiddleware, projectController.startProject);

module.exports = router;
