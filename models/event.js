const mongoose = require('mongoose');

// Define the Event schema
const eventSchema = new mongoose.Schema({
    image: { type: Buffer, required: false }, // Store image as Buffer in memory
    date: { type: Date, required: true },
    heading: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
