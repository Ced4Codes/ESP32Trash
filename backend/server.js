const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Device = require('./models/Device');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/esp32_monitoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/devices', async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
});

app.post('/api/devices', async (req, res) => {
  try {
    const { name, ip, trashBins } = req.body;
    const newDevice = new Device({ name, ip, trashBins });
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    console.error('Error adding device:', error);
    res.status(400).json({ message: 'Error adding device', error: error.message });
  }
});

app.put('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDevice = req.body;
    const device = await Device.findByIdAndUpdate(id, updatedDevice, { new: true });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json(device);
  } catch (error) {
    console.error('Error updating device:', error);
    res.status(400).json({ message: 'Error updating device', error: error.message });
  }
});

app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const device = await Device.findByIdAndDelete(id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    res.status(400).json({ message: 'Error deleting device', error: error.message });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'online' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});