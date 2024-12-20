const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const aboutController = require('../controllers/aboutController');

// ---------------------- About Image Routes ----------------------

// Get all About images
router.get('/', aboutController.getAllAboutData);

// Create About image
router.post('/', upload.single('image'), aboutController.createAboutImage);

// Update About image
router.put('/:id', upload.single('image'), aboutController.updateAboutImage);

// Delete About image
router.delete('/:id', aboutController.deleteAboutImage);

// ---------------------- Message Routes ----------------------

// Get all Messages
router.get('/messages', aboutController.getAllMessages);

// Create new Message
router.post('/messages', upload.single('image'), aboutController.createMessage); // Optional image

// Update Message
router.put('/messages/:id', upload.single('image'), aboutController.updateMessage); // Optional image

// Delete Message
router.delete('/messages/:id', aboutController.deleteMessage);

// ---------------------- Export the Router ----------------------
module.exports = router;
