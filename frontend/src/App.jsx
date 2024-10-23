import React, { useState, useEffect } from 'react';
import DeviceCard from './components/DeviceCard';
import AddESP32Modal from './components/AddESP32Modal';
import EditDeviceModal from './components/EditDeviceModal';
import NotificationList from './components/NotificationList';
import { Bell } from 'lucide-react';
import './App.css';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('offline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);

  useEffect(() => {
    fetchDevices();
    checkServerStatus();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/devices');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const uniqueDevices = data.filter((device, index, self) =>
        index === self.findIndex((d) => d.name === device.name && d.ip === device.ip)
      );
      setDevices(uniqueDevices);
    } catch (error) {
      setError('Failed to fetch devices');
    }
  };

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/status');
      if (response.ok) {
        setServerStatus('online');
      } else {
        setServerStatus('offline');
      }
    } catch (error) {
      setServerStatus('offline');
    }
  };

  const addDevice = async (name, ip) => {
    try {
      const response = await fetch('http://localhost:5001/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, ip, trashBins: { Bio: 0, Plastic: 0, Metal: 0, Others: 0 } })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newDevice = await response.json();
      setDevices((prevDevices) => [...prevDevices, newDevice]);
    } catch (error) {
      setError(error.message || 'Failed to add device. Please try again.');
    }
  };

  const editDeviceInfo = async (updatedDevice) => {
    try {
      const response = await fetch(`http://localhost:5001/api/devices/${updatedDevice._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedDevice)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const updatedDevices = devices.map(device =>
        device._id === updatedDevice._id ? updatedDevice : device
      );
      setDevices(updatedDevices);
    } catch (error) {
      setError(error.message || 'Failed to update device');
    }
  };

  const handleDeleteDevice = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/devices/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setDevices((prevDevices) => prevDevices.filter(device => device._id !== id));
    } catch (error) {
      setError(error.message || 'Failed to delete device. Please try again.');
    }
  };

  const addNotification = (message) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id: Date.now(), message },
    ]);
  };

  return (
    <div className="app">
      <h1 className="title">EcoCycle</h1>
      <h2 className="subtitle">ESP32 Monitoring System</h2>
      <div className="main-content">
        <div className="content-header">
          <button onClick={() => {
            console.log("Opening Modal");
            setIsModalOpen(true);
          }} className="add-device-btn">Add ESP32</button>

          <div className="notification-section">
            <button onClick={() => setShowNotifications(!showNotifications)} className="notification-btn">
              <Bell size={24} />
              {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
            </button>
            <div className={`server-status ${serverStatus}`}>
              Server Status: {serverStatus}
              <span className="status-indicator"></span>
            </div>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="device-container">
          <div className="device-scroll-area">
            <div className="device-grid">
              {devices.length > 0 ? (
                devices.map(device => (
                  <DeviceCard 
                    key={device._id} 
                    device={device} 
                    onDelete={(id) => {
                      setShowConfirmation(true);
                      setDeviceToDelete(id);
                    }}
                    onEdit={() => setEditDevice(device)}
                    addNotification={addNotification}
                  />
                ))
              ) : (
                <p className="no-devices">No devices found. Add a device to get started!</p>
              )}
            </div>
          </div>
        </div>
        {editDevice && (
          <EditDeviceModal
            device={editDevice}
            onClose={() => setEditDevice(null)}
            onSave={editDeviceInfo}
            onDelete={handleDeleteDevice}
          />
        )}
      </div>
      <AddESP32Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addDevice} 
      />
      {showNotifications && (
        <NotificationList 
          notifications={notifications} 
          onClose={() => setShowNotifications(false)}
          onClear={() => setNotifications([])}
        />
      )}
    </div>
  );
}