const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');

// Routes for getting only image by ID
router.get('/homeimg/:id', homeController.getHomeImageById);
router.get('/aboutimg/:id', aboutController.getAboutImageById);

module.exports = router;