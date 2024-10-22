const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: String,
  ip: String,
  trashBins: {
    Bio: Number,
    Plastic: Number,
    Metal: Number,
    Others: Number
  }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
