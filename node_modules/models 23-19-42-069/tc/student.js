const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  TC: {
    data: Buffer,
    contentType: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
