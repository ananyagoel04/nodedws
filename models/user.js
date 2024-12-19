const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullname: String,
    contact: Number,
    email: String,
    password: String,
});
module.exports = mongoose.model('User', userSchema)