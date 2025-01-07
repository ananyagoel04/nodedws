const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');
const mongoURI = 'mongodb+srv://ananyagoelps:Goel%402004@vehicle.l6zrk.mongodb.net/DWSWEB?retryWrites=true&w=majority&appName=VEHICLE';

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
