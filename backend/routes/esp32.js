const express = require('express');
const router = express.Router();
const Esp32 = require('../models/esp32');

// Get all ESP32 devices
router.get('/', async (req, res) => {
  try {
    const devices = await Esp32.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, ip, timesFull } = req.body;
  
  try {
    // Find the device and update, or create if not found
    const updatedDevice = await Esp32.findOneAndUpdate(
      { ip },
      { name, timesFull, lastUpdated: Date.now() },  // Update lastUpdated
      { new: true, upsert: true }
    );
    
    res.status(201).json(updatedDevice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete an ESP32 device
router.delete('/:id', async (req, res) => {
  try {
    const device = await Esp32.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });

    await device.remove();
    res.json({ message: 'Device deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
