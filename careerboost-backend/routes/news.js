// News routes
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/', newsController.getLatestNews);
router.get('/category/:category', newsController.getNewsByCategory);
router.get('/search', newsController.searchNews);

module.exports = router;
