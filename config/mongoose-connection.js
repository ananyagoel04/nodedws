const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.DATA_BASE;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function() {
    console.log("Connected to MongoDB successfully");
  })
  .catch(function(err) {
    console.error("MongoDB connection error:", err);
  });

module.exports = mongoose.connection;