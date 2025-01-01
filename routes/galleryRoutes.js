const express = require('express');
const multer = require('multer');
const galleryController = require('../controllers/galleryController');  // Import controller

const router = express.Router();

// Configure multer to store files in memory (as buffers)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Create Gallery or Maingallery Item
router.post('/upload', upload.single('image'), galleryController.createGalleryItem);

// Get Gallery or Maingallery Item by ID
router.get('/image/:galleryType/:id', galleryController.getGalleryItemById);

// Update Gallery or Maingallery Item
router.put('/update/:galleryType/:id', upload.single('image'), galleryController.updateGalleryItem);

// Delete Gallery or Maingallery Item
router.delete('/delete/:galleryType/:id', galleryController.deleteGalleryItem);

module.exports = router;
