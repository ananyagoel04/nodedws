const express = require('express');
const upload = require('../config/multer'); 
const adController = require('../controllers/adController');

const router = express.Router();

// Get all Ads
router.get('/', adController.getAllAds);

// Create a new Ad (upload image)
router.post('/upload', upload.single('image'), adController.createAd);

// Get Ad by ID (retrieve image)
router.get('/image/:id', adController.getAdById);

// Update an Ad by ID (upload new image if needed)
router.put('/update/:id', upload.single('image'), adController.updateAd);

// Delete an Ad by ID
router.delete('/delete/:id', adController.deleteAd);

module.exports = router;
