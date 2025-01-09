const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');
require('dotenv').config();
const mongoURI = process.env.DATA_BASE;


// Reuse existing connection
mongoose.connection.on('connected', () => {
  dbgr('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  dbgr('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  dbgr('Mongoose connection lost. Attempting to reconnect...');
});

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000, 
  serverSelectionTimeoutMS: 5000,
}).catch((err) => {
  dbgr('Error connecting to MongoDB', err);
});

module.exports = mongoose.connection;
