const mongoose = require('mongoose');

// Define the News schema
const newsSchema = new mongoose.Schema({
    heading: { type: String, required: true, maxlength: 200 },
    newsContent: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
