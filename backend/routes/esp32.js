const express = require('express');
const router = express.Router();
const Esp32 = require('../models/esp32'); // Ensure the model path is correct

// GET /api/esp32 - Fetch all ESP32 devices
router.get('/', async (req, res) => {
  try {
    const devices = await Esp32.find();
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching devices', error: err.message });
  }
});

// POST /api/esp32 - Create or update an ESP32 device by IP
router.post('/', async (req, res) => {
  const { name, ip, timesFull } = req.body;
  
  try {
    const updatedDevice = await Esp32.findOneAndUpdate(
      { ip }, 
      { name, timesFull, lastUpdated: Date.now() }, // Update fields
      { new: true, upsert: true } // Upsert if it doesn't exist
    );
    res.status(201).json(updatedDevice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/esp32/:id - Delete an ESP32 device by ID
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
