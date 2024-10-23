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

// Get all devices
app.get('/api/devices', async (req, res) => {
  try {
    const devices = await Device.find().sort({ name: 1 });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
});

// Add or update device
app.post('/api/devices', async (req, res) => {
  try {
    const { ip, trashBins } = req.body;

    // Check if a device with the same IP exists
    const existingDevice = await Device.findOne({ ip });

    if (existingDevice) {
      // If the device exists, update the trash bins based on the addTrash and full flags
      for (let bin in trashBins) {
        const binData = trashBins[bin];

        if (binData.addTrash) {
          existingDevice.trashBins[bin].count += 1;  // Increment the count
        }

        existingDevice.trashBins[bin].full = binData.full;  // Update the full status
        existingDevice.trashBins[bin].addTrash = false;  // Reset the addTrash flag
      }
      await existingDevice.save();
      return res.status(200).json({ message: 'Device updated successfully', device: existingDevice });
    }

    // If no device exists, create a new one
    const newDevice = new Device({ ip, trashBins });
    await newDevice.save();
    res.status(201).json(newDevice);

  } catch (error) {
    res.status(400).json({ message: 'Error adding or updating device', error: error.message });
  }
});

// Update device by IP
app.put('/api/devices', async (req, res) => {
  try {
    const { ip, trashBins } = req.body;

    // Find the existing device by IP address
    const existingDevice = await Device.findOne({ ip });

    if (!existingDevice) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Update the trash bins based on the addTrash and full flags
    for (let bin in trashBins) {
      if (existingDevice.trashBins.hasOwnProperty(bin)) {
        const binData = trashBins[bin];

        if (binData.addTrash) {
          existingDevice.trashBins[bin].count += 1;  // Increment the count
        }

        existingDevice.trashBins[bin].full = binData.full;  // Update the full status
        existingDevice.trashBins[bin].addTrash = false;  // Reset the addTrash flag
      } else {
        console.warn(`Bin ${bin} does not exist in the existing device. Skipping update for this bin.`);
      }
    }

    await existingDevice.save();
    res.status(200).json({ message: 'Device updated successfully', device: existingDevice });

  } catch (error) {
    res.status(400).json({ message: 'Error updating device', error: error.message });
  }
});


// Delete device by ID
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

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'online' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
