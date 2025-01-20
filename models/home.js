const mongoose = require('mongoose');

// Homeimg Schema
const homeimgSchema = new mongoose.Schema({
  image_title: { type: String, required: true },
  image_url: { type: String, required: false, },
  public_id: { type: String, required: false, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// VisionMission Schema
const visionMissionSchema = new mongoose.Schema({
  image_title: { type: String, required: true },
  image_url: { type: String, required: false, },
  public_id: { type: String, required: false, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Environment Schema
const environmentSchema = new mongoose.Schema({
  image_title: { type: String, required: true },
  image_url: { type: String, required: false, },
  public_id: { type: String, required: false, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  image_title: { type: String, required: true },
  image_url: { type: String, required: false, },
  public_id: { type: String, required: false, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Program Schema
const programSchema = new mongoose.Schema({
  image_title: { type: String, required: true },
  image_url: { type: String, required: false, },
  public_id: { type: String, required: false, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stars: { type: Number, required: true },
  review: { type: String, required: true },
  image_title: { type: String, required: true },
  image_url: { type: String, required: false, },
  public_id: { type: String, required: false, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create Models
const Homeimg = mongoose.model('Homeimg', homeimgSchema);
const VisionMission = mongoose.model('VisionMission', visionMissionSchema);
const Environment = mongoose.model('Environment', environmentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Program = mongoose.model('Program', programSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { Homeimg, VisionMission, Environment, Teacher, Program, Review };
