const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: { type: String, required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
