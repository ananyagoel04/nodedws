const mongoose = require('mongoose');

// Schema for About Image
const aboutimgSchema = new mongoose.Schema({
    image_title: { type: String, required: true },
    image_url: { type: String, required: false, },
    public_id: { type: String, required: false, },
});

// Schema for Message with Name and Image Buffer
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    image_url: { type: String, required: false, },
    public_id: { type: String, required: false, },
});

// Export both models
module.exports = {
    AboutImage: mongoose.model('AboutImage', aboutimgSchema),
    Message: mongoose.model('Message', messageSchema)
};
