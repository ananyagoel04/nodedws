const express = require('express');
const upload = require('../config/multer');
const galleryController = require('../controllers/galleryController');  // Import controller

const router = express.Router();

router.get('/', galleryController.getAllGalleryItem);

// Create Gallery or Maingallery Item
router.post('/upload', upload.single('image'), galleryController.createGalleryItem);

// Get Gallery or Maingallery Item by ID
router.get('/image/:galleryType/:id', galleryController.getGalleryItemById);

// Update Gallery or Maingallery Item
router.put('/update/:galleryType/:id', upload.single('image'), galleryController.updateGalleryItem);

// Delete Gallery or Maingallery Item
router.delete('/delete/:galleryType/:id', galleryController.deleteGalleryItem);

module.exports = router;
