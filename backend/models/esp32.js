const mongoose = require('mongoose');

const esp32Schema = new mongoose.Schema({
  name: String,
  ip: { type: String, unique: true },
  timesFull: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Esp32', esp32Schema);
