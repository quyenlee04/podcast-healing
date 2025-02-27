const express = require('express');
const router = express.Router();
const podcastController = require('../controllers/podcastController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware.protect, podcastController.createPodcast);

// Fix: Pass the controller function directly as the callback
router.get('/', authMiddleware.protect, podcastController.getPodcasts);


module.exports = router;