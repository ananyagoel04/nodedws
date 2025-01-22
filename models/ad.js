const mongoose = require('mongoose');

// Define the schema for the Ad model
const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  image_url: {
    type: String,
    required: false,
  },
  public_id: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create and export the model
const Ad = mongoose.model('Ad', adSchema);
module.exports = Ad;
