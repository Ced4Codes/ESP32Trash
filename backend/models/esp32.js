// Add a "down" status based on lastUpdated time
const express = require('express');
const router = express.Router();
const Esp32 = require('../models/esp32');

// Time threshold for a device to be considered "down" (e.g., 20 seconds)
const timeThreshold = 10000; // 20 seconds

// Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await Esp32.find();
    const currentTime = Date.now();

    // Check if devices have gone "down"
    const updatedDevices = devices.map(device => {
      const timeSinceLastUpdate = currentTime - new Date(device.lastUpdated).getTime();
      const isDown = timeSinceLastUpdate > timeThreshold;
      return { ...device._doc, status: isDown ? 'down' : 'online' };
    });

    res.json(updatedDevices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

