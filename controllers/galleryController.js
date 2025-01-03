const { Gallery, Maingallery } = require('../models/gallery');


const getAllGalleryItem = async (req, res) => {
  try {
    const galleryItems = await Gallery.find();
    const maingalleryItems = await Maingallery.find();

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
    const imageBuffer = req.file.buffer;

    let newItem;

    // Check if it's a gallery or maingallery
    if (galleryType === 'Gallery') {
      newItem = new Gallery({
        image_title,
        imagefilter,
        image: imageBuffer  // Store image as Buffer
      });
    } else {
      newItem = new Maingallery({
        image_title1: image_title,
        imagefilter1: imagefilter,
        image1: imageBuffer  // Store image as Buffer
      });
    }

    await newItem.save();  // Save the new item in the database
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

    // Set appropriate headers for image content type
    res.set('Content-Type', 'image/jpeg'); // Assuming JPEG format (you can handle other formats similarly)
    res.send(item.image || item.image1);  // Send the image Buffer as the response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving image');
  }
};

// Update a Gallery or Maingallery item by ID
const updateGalleryItem = async (req, res) => {
  const { galleryType, id } = req.params;
  const { image_title, imagefilter } = req.body;

  try {
    let itemToUpdate;

    if (galleryType === 'Gallery') {
      itemToUpdate = await Gallery.findById(id);
    } else if (galleryType === 'Maingallery') {
      itemToUpdate = await Maingallery.findById(id);
    }

    if (!itemToUpdate) {
      return res.status(404).send('Item not found');
    }
    // Update fields
    if (galleryType === 'Gallery') {
      itemToUpdate.image_title = image_title || itemToUpdate.image_title;
      itemToUpdate.imagefilter = imagefilter || itemToUpdate.imagefilter;
    } else if (galleryType === 'Maingallery') {
      itemToUpdate.image_title1 = image_title || itemToUpdate.image_title;
      itemToUpdate.imagefilter1 = imagefilter || itemToUpdate.imagefilter;
    }
    // If there's a new file uploaded, update the image
    if (req.file) {
      const imageBuffer = req.file.buffer;
      itemToUpdate.image = imageBuffer || itemToUpdate.image;  // Update the image if new one provided
      itemToUpdate.image1 = imageBuffer || itemToUpdate.image1;
    }

    await itemToUpdate.save();
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
