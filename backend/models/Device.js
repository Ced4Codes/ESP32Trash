const mongoose = require('mongoose');

const trashBinSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0
  },
  full: {
    type: Boolean,
    default: false
  },
  addTrash: {
    type: Boolean,
    default: false
  }
});

const deviceSchema = new mongoose.Schema({
  name: String,
  ip: { type: String, unique: true },
  trashBins: {
    Bio: trashBinSchema,
    Plastic: trashBinSchema,
    Metal: trashBinSchema,
    Others: trashBinSchema
  }
});

module.exports = mongoose.model('Device', deviceSchema);
