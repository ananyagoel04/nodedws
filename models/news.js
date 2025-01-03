const mongoose = require('mongoose');

// Define the News schema
const newsSchema = new mongoose.Schema({
    heading: { type: String, required: true, maxlength: 100 },
    newsContent: { type: String, required: true },  // Stores the content (can use rich text)
    createdAt: { type: Date, default: Date.now },
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
