const mongoose = require('mongoose');

// Homeimg Schema
const homeimgSchema = new mongoose.Schema({
  image_title: { type: String, required: true },
  image: { type: Buffer, required: true }
});

// VisionMission Schema
const visionMissionSchema = new mongoose.Schema({
  image_title: { type: String, required: true },
  image: { type: Buffer, required: true }
});

// Environment Schema
const environmentSchema = new mongoose.Schema({
  image_title: { type: String, required: true },
  image: { type: Buffer, required: true }
});

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  image_title: { type: String, required: true },
  image: { type: Buffer, required: true }
});

// Program Schema
const programSchema = new mongoose.Schema({
  image_title: { type: String, required: true },
  image: { type: Buffer, required: true }
});

// Review Schema
const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stars: { type: Number, required: true },
  review: { type: String, required: true },
  image_title: { type: String, required: true },
  image: { type: Buffer, required: true }
});

// Create Models
const Homeimg = mongoose.model('Homeimg', homeimgSchema);
const VisionMission = mongoose.model('VisionMission', visionMissionSchema);
const Environment = mongoose.model('Environment', environmentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Program = mongoose.model('Program', programSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { Homeimg, VisionMission, Environment, Teacher, Program, Review };
