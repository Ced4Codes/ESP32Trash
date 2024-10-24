const express = require('express');
const router = express.Router();
const Device = require('../models/Device'); // Adjust the path if necessary

// GET /api/devices - Fetch all devices
router.get('/', async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
});

// POST /api/devices - Create or update a device
router.post('/', async (req, res) => {
  const { name, ip, trashBins } = req.body;

  try {
    const updatedDevice = await Device.findOneAndUpdate(
      { ip },
      { name, trashBins, lastUpdated: Date.now() },
      { new: true, upsert: true }
    );
    res.status(201).json(updatedDevice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/devices/:id - Update a device by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
});

// DELETE /api/devices/:id - Delete a device by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findByIdAndDelete(id);
    if (!device) {
      return res.status(404).send({ message: 'Device not found' });
    }
    res.status(200).send({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
