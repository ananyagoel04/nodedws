const mongoose = require('mongoose');
// require('dotenv').config();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoURI = process.env.DATA_BASE;
const dev = process.env.NODE_ENV;

const db = () => {
  return mongoose
    .connect(mongoURI) 
    .then(function () {
      if (dev === "dev") {
        console.log("Connected to MongoDB successfully");
      }
    })
    .catch(function (err) {
      if (dev === "dev") {
        console.error("MongoDB connection error:", err);
      }
      throw err;
    });
};
module.exports = db;
