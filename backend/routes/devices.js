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

// DELETE /api/devices/:id - Delete a device by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete device with id: ${id}`);
    const device = await Device.findByIdAndDelete(id);
    if (!device) {
      console.log(`Device with id: ${id} not found`);
      return res.status(404).send({ message: 'Device not found' });
    }
    console.log(`Device with id: ${id} deleted successfully`);
    res.status(200).send({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = router;
