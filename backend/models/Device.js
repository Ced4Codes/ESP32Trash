const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  ip: { type: String, unique: true },
  trashBins: {
    Bio: Number,
    Plastic: Number,
    Metal: Number,
    Others: Number
  }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;

