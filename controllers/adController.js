const cloudinary = require('../config/cloudinaryConfig');
const https = require('https');
const path = require('path');
const Ad = require('../models/ad');


async function uploadImageToCloudinary(file, public_id, folder = 'ads_images') {
  const streamifier = require('streamifier');
  const bufferStream = streamifier.createReadStream(file.buffer);
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: public_id,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
    bufferStream.pipe(uploadStream);
  });
}

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
    const uploadResult = await uploadImageToCloudinary(req.file, title);
    const newAd = new Ad({
      title,
      isActive: isActive === 'off' ? false : true,
      image_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });

    await newAd.save();
    res.status(201).redirect("/admin/ads");
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).send('Error creating ad');
  }
};

const getAdById = async (req, res) => {
  const { id } = req.params;

  try {
    const ad = await Ad.findById(id);

    if (!ad) {
      return res.status(404).send('Ad not found');
    }

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
  console.log( isActive);

  try {
    const adToUpdate = await Ad.findById(id);

    if (!adToUpdate) {
      return res.status(404).send('Ad not found');
    }

    adToUpdate.title = title || adToUpdate.title;
    adToUpdate.isActive = isActive === 'off' ? false : true;

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file, title);
      adToUpdate.image_url = uploadResult.secure_url;
      adToUpdate.public_id = uploadResult.public_id;
    }
    adToUpdate.updatedAt = Date.now();
    await adToUpdate.save();

    res.status(200).redirect("/admin/ads");
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(500).send('Error updating ad');
  }
};

const deleteAd = async (req, res) => {
  const { id } = req.params;

  try {
    const adToDelete = await Ad.findById(id);

    if (!adToDelete) {
      return res.status(404).send('Ad not found');
    }
    await cloudinary.uploader.destroy(adToDelete.public_id);
    await adToDelete.deleteOne();
    res.status(200).redirect("/admin/ads");
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).send('Error deleting ad');
  }
};

module.exports = {
  getAllAds,
  createAd,
  getAdById,
  updateAd,
  deleteAd
};
