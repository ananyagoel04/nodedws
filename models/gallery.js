const mongoose = require('mongoose');

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  image_title: {
    type: String,
    required: true
  },
  imagefilter: {
    type: String,
    default: 'Nature',
  },
  image_url: { type: String, required: false, },
  public_id: { type: String, required: false, },
}, { timestamps: true });

// Maingallery Schema
const maingallerySchema = new mongoose.Schema({
  image_title: {
    type: String,
    required: true
  },
  imagefilter: {
    type: String,
    default: 'Nature',
  },
  image_url: { type: String, required: false, },
  public_id: { type: String, required: false, },
}, { timestamps: true });

// Create Models for Gallery and Maingallery
const Gallery = mongoose.model('Gallery', gallerySchema);
const Maingallery = mongoose.model('Maingallery', maingallerySchema);

// Export both models
module.exports = { Gallery, Maingallery };
