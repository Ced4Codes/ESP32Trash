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
    const devices = await Device.find().sort({ name: 1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
});

app.post('/api/devices', async (req, res) => {
  try {
    const { name, ip, trashBins } = req.body;

    // Check if a device with the same name or IP exists
    const existingDevice = await Device.findOne({ $or: [{ name }, { ip }] });

    if (existingDevice) {
      // If a device exists, update its trashBins data
      existingDevice.trashBins = trashBins;
      await existingDevice.save();
      return res.status(200).json({ message: 'Device updated successfully', device: existingDevice });
    }

    // If no device exists, create a new one
    const newDevice = new Device({ name, ip, trashBins });
    await newDevice.save();
    res.status(201).json(newDevice);

  } catch (error) {
    res.status(400).json({ message: 'Error adding or updating device', error: error.message });
  }
});

app.put('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ip, trashBins } = req.body;

    const existingDevice = await Device.findOne({ $or: [{ name }, { ip }], _id: { $ne: id } });

    if (existingDevice) {
      return res.status(400).json({ message: 'Device with the same name or IP already exists' });
    }

    const updatedDevice = await Device.findByIdAndUpdate(id, { name, ip, trashBins }, { new: true });

    if (!updatedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }

    res.json(updatedDevice);
  } catch (error) {
    res.status(400).json({ message: 'Error updating device', error: error.message });
  }
});

app.delete('/api/devices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDevice = await Device.findByIdAndDelete(id);
    if (!deletedDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device', error: error.message });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'online' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
