import React, { useState, useEffect } from 'react';
import ESP32Card from './components/ESP32Card';
import Loader from './components/Loader';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDevice, setNewDevice] = useState({ name: '', ip: '' });

  useEffect(() => {
    // Simulate initial loading time
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDevice((prev) => ({ ...prev, [name]: value }));
  };

  const addDevice = () => {
    setLoading(true);
    setTimeout(() => {
      setDevices([...devices, { ...newDevice, id: Date.now(), status: 'Unknown' }]);
      setNewDevice({ name: '', ip: '' });
      setLoading(false);
    }, 1000);
  };

  const deleteDevice = (id) => {
    setDevices(devices.filter((device) => device.id !== id));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="App">
      <NavBar />
      <div className="input-container">
        <input
          type="text"
          name="name"
          value={newDevice.name}
          onChange={handleInputChange}
          placeholder="ESP32 Name"
        />
        <input
          type="text"
          name="ip"
          value={newDevice.ip}
          onChange={handleInputChange}
          placeholder="ESP32 IP Address"
        />
        <button onClick={addDevice}>Add Device</button>
      </div>
      <div className="card-container">
        {devices.map((device) => (
          <ESP32Card key={device.id} device={device} deleteDevice={deleteDevice} />
        ))}
      </div>
    </div>
  );
}

export default App;
