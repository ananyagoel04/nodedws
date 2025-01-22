const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: false,
    },
    public_id: {
        type: String,
        required: false,
    },
    date: { type: Date, required: true },
    heading: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
