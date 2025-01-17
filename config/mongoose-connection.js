const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');
require('dotenv').config();
const mongoURI = process.env.DATA_BASE;

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection lost. Attempting to reconnect...');
});

mongoose.connect(mongoURI, {
  connectTimeoutMS: 120000,
  socketTimeoutMS: 45000, 
  serverSelectionTimeoutMS: 5000,
}).catch((err) => {
  console.log('Error connecting to MongoDB', err);
});

module.exports = mongoose.connection;
