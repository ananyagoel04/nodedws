const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');

// Routes for getting only image by ID
router.get('/homeimg/:id', homeController.getHomeImageById);
router.get('/visionmission/:id', homeController.getVisionMissionById);
router.get('/environment/:id', homeController.getEnvironmentById);
router.get('/teacher/:id', homeController.getTeacherById);
router.get('/program/:id', homeController.getProgramById);
router.get('/review/:id', homeController.getReviewById);
router.get('/aboutimg/:id', aboutController.getAboutImageById);

module.exports = router;