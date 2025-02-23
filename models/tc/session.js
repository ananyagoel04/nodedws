const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  year: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
