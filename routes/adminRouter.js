const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const homeController = require('../controllers/homeController');


router.get('/users', homeController.getAllUsersData);

// Homeimg Routes
router.get('/', homeController.getAllHomeData);
router.post('/home', upload.single('image'), homeController.createHomeImage); // Create home image
router.put('/home/:id', upload.single('image'), homeController.updateHomeImage); // Update home image
router.delete('/home/:id', homeController.deleteHomeImage); // Delete home image

// VisionMission Routes
router.post('/vision', upload.single('image'), homeController.createVisionMission); // Create vision mission
router.put('/vision/:id', upload.single('image'), homeController.updateVisionMission); // Update vision mission
router.delete('/vision/:id', homeController.deleteVisionMission); // Delete vision mission

// Environment Routes
router.post('/environment', upload.single('image'), homeController.createEnvironment); // Create environment item
router.put('/environment/:id', upload.single('image'), homeController.updateEnvironment); // Update environment item
router.delete('/environment/:id', homeController.deleteEnvironment); // Delete environment item

// Teacher Routes
router.post('/teacher', upload.single('image'), homeController.createTeacher); // Create teacher
router.put('/teacher/:id', upload.single('image'), homeController.updateTeacher); // Update teacher
router.delete('/teacher/:id', homeController.deleteTeacher); // Delete teacher

// Program Routes
router.post('/program', upload.single('image'), homeController.createProgram); // Create program
router.put('/program/:id', upload.single('image'), homeController.updateProgram); // Update program
router.delete('/program/:id', homeController.deleteProgram); // Delete program

// Review Routes
router.post('/review', upload.single('image'), homeController.createReview); // Create review
router.put('/review/:id', upload.single('image'), homeController.updateReview); // Update review
router.delete('/review/:id', homeController.deleteReview); // Delete review

module.exports = router;
