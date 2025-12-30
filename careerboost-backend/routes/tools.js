// Tools routes
const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

router.get('/', toolController.getAllTools);
router.get('/recommendations', toolController.getRecommendations);
router.get('/category/:category', toolController.getToolsByCategory);

module.exports = router;
