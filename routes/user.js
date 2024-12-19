const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullname: String,
    contact: Number,
    picture: String,
    email: String,
    password: String,
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    orders: {
        type: [{ type: mongoose.Schema.Types.Mixed }],
        default: []
    },

});
module.exports = mongoose.model('User', userSchema)