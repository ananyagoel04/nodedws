const Ad = require('../models/ad');

// Get all Ads
const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find();
    res.render('Admin/adadmin', { ads });
  } catch (err) {
    console.error('Error loading ads:', err);
    res.status(500).send('Error loading ads');
  }
};

// Create a new Ad
const createAd = async (req, res) => {
  const { title, isActive } = req.body;

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const imageBuffer = req.file.buffer; 

    const newAd = new Ad({
      title,
      isActive: isActive === 'on' ? true : false, 
      image: imageBuffer
    });

    await newAd.save();
    res.status(201).redirect("/admin/ads");
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).send('Error creating ad');
  }
};

// Get a specific Ad by ID (and display the image)
const getAdById = async (req, res) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findById(id);

    if (!ad) {
      return res.status(404).send('Ad not found');
    }

    // Set headers and send image as response (assuming JPEG for simplicity)
    res.set('Content-Type', 'image/jpeg');
    res.send(ad.image);
  } catch (error) {
    console.error('Error retrieving ad:', error);
    res.status(500).send('Error retrieving ad');
  }
};

// Update an existing Ad
const updateAd = async (req, res) => {
  const { id } = req.params;
  const { title, isActive } = req.body;

  try {
    const adToUpdate = await Ad.findById(id);

    if (!adToUpdate) {
      return res.status(404).send('Ad not found');
    }

    // Update fields
    adToUpdate.title = title || adToUpdate.title;
    adToUpdate.isActive = isActive === 'on' ? true : false;

    // If there's a new file uploaded, update the image
    if (req.file) {
      const imageBuffer = req.file.buffer;
      adToUpdate.image = imageBuffer;  // Update the image buffer if a new file is uploaded
    }

    adToUpdate.updatedAt = Date.now();  // Update the timestamp

    await adToUpdate.save();
    res.status(200).redirect("/admin/ads"); // Redirect back to the ads list
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(500).send('Error updating ad');
  }
};

// Delete an Ad by ID
const deleteAd = async (req, res) => {
  const { id } = req.params;

  try {
    const adToDelete = await Ad.findById(id);

    if (!adToDelete) {
      return res.status(404).send('Ad not found');
    }

    await adToDelete.deleteOne();  // Delete the ad
    res.status(200).redirect("/admin/ads");  // Redirect back to ads list
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).send('Error deleting ad');
  }
};

// Export all the controller methods
module.exports = {
  getAllAds,
  createAd,
  getAdById,
  updateAd,
  deleteAd
};
