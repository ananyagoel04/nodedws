const express = require('express');
const upload = require('../config/multer');
const newsEventController = require('../controllers/parentController');


const router = express.Router();

// Route to get all events
router.get('/', newsEventController.getAllParentItem);

// Event routes
router.post('/event/create', upload.single('image'), newsEventController.createEvent);
router.put('/event/update/:id', upload.single('image'), newsEventController.updateEvent);
router.delete('/event/delete/:id', newsEventController.deleteEvent);

// News routes
router.post('/news/create', newsEventController.createNews);
router.put('/news/update/:id', newsEventController.updateNews);
router.delete('/news/delete/:id', newsEventController.deleteNews);

module.exports = router;