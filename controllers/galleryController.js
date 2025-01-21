const cloudinary = require('../config/cloudinaryConfig');
const https = require('https');
const path = require('path');
const { Gallery, Maingallery } = require('../models/gallery');


async function uploadImageToCloudinary(file, public_id, folder = 'gallery_images') {
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

const getAllGalleryItem = async (req, res) => {
  try {
    const [galleryItems, maingalleryItems] = await Promise.all([
      Gallery.find(),
      Maingallery.find(),
    ]);

    res.render('Admin/galleryadmin', { galleryItems, maingalleryItems });
  } catch (err) {
    console.error('Error loading About data:', err);
    res.status(500).send('Error loading About data');
  }
};

// Create a new Gallery or Maingallery item
const createGalleryItem = async (req, res) => {
  const { image_title, imagefilter, galleryType } = req.body;

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  if (!['Gallery', 'Maingallery'].includes(galleryType)) {
    return res.status(400).send('Invalid gallery type');
  }

  try {
    const uploadResult = await uploadImageToCloudinary(req.file, image_title);

    let newImage;


    // Check if it's a gallery or maingallery
    if (galleryType === 'Gallery') {
      newImage = new Gallery({
        image_title,
        imagefilter,
        image_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    } else {
      newImage = new Maingallery({
        image_title,
        imagefilter,
        image_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    }

    await newImage.save();
    res.status(201).redirect("/admin/gallery");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file');
  }
};

// Get a Gallery or Maingallery item by ID
const getGalleryItemById = async (req, res) => {
  const { galleryType, id } = req.params;

  try {
    let item;

    if (galleryType === 'Gallery') {
      item = await Gallery.findById(id);
    } else if (galleryType === 'Maingallery') {
      item = await Maingallery.findById(id);
    }

    if (!item) {
      return res.status(404).send('Item not found');
    }

    res.set('Content-Type', 'image/jpeg');
    res.send(item.image || item.image1);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving image');
  }
};

// Update a Gallery or Maingallery item by ID
const updateGalleryItem = async (req, res) => {
  const { galleryType, id } = req.params;
  const { image_title, imagefilter } = req.body;
  const updates = { image_title, imagefilter };

  try {
    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file, image_title);
      updates.image_url = uploadResult.secure_url;
      updates.public_id = uploadResult.public_id;
    }
    // Update fields
    if (galleryType === 'Gallery') {
      await Gallery.findByIdAndUpdate(id, updates, { new: true });
    } else if (galleryType === 'Maingallery') {
      await Maingallery.findByIdAndUpdate(id, updates, { new: true });
    }
    res.status(200).redirect("/admin/gallery");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating item');
  }
};

// Delete a Gallery or Maingallery item by ID
const deleteGalleryItem = async (req, res) => {
  const { galleryType, id } = req.params;

  try {
    let itemToDelete;

    if (galleryType === 'Gallery') {
      itemToDelete = await Gallery.findById(id);
    } else if (galleryType === 'Maingallery') {
      itemToDelete = await Maingallery.findById(id);
    }

    if (!itemToDelete) {
      return res.status(404).send('Item not found');
    }
    await itemToDelete.constructor.deleteOne({ _id: id });
    res.status(200).redirect("/admin/gallery");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting item');
  }
};

// Export all the controller methods
module.exports = {
  getAllGalleryItem,
  createGalleryItem,
  getGalleryItemById,
  updateGalleryItem,
  deleteGalleryItem
};
