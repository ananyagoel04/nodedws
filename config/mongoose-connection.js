const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');

const mongoURI = 'mongodb+srv://ananyagoelps:Goel%402004@vehicle.l6zrk.mongodb.net/DWSWEB?retryWrites=true&w=majority&appName=VEHICLE';

mongoose
  .connect(mongoURI)
  .then(function() {
    dbgr("connected");
  })
  .catch(function(err) {
    dbgr(err);
  });

module.exports = mongoose.connection;
