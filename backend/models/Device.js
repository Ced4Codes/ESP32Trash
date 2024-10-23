const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  ip: { type: String, unique: true },
  trashBins: {
    Bio: {
      full: { type: Boolean, default: false },
      addTrash: { type: Boolean, default: false },
      count: { type: Number, default: 0 }
    },
    Plastic: {
      full: { type: Boolean, default: false },
      addTrash: { type: Boolean, default: false },
      count: { type: Number, default: 0 }
    },
    Metal: {
      full: { type: Boolean, default: false },
      addTrash: { type: Boolean, default: false },
      count: { type: Number, default: 0 }
    },
    Others: {
      full: { type: Boolean, default: false },
      addTrash: { type: Boolean, default: false },
      count: { type: Number, default: 0 }
    }
  }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
