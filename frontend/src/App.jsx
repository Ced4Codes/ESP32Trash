import React, { useState, useEffect } from 'react';
import DeviceCard from './components/DeviceCard';
import AddESP32Modal from './components/AddESP32Form';
import NotificationList from './components/NotificationList';
import EditDeviceModal from './components/EditDeviceModal';
import { Bell } from 'lucide-react';
import './App.css';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState('offline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editDevice, setEditDevice] = useState(null);

  useEffect(() => {
    // Fetch devices and server status on mount
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
      setDevices(data);
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

  const addNotification = (message) => {
    const id = Date.now();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id, message },
    ]);
  };

  const addDevice = async (device) => {
    try {
      const response = await fetch('http://localhost:5001/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(device)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newDevice = await response.json();
      setDevices([...devices, newDevice]);
    } catch (error) {
      setError('Failed to add device');
    }
  };

  const deleteDevice = async (deviceId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/devices/${deviceId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setDevices(devices.filter(device => device._id !== deviceId));
    } catch (error) {
      setError('Failed to delete device');
    }
  };

  const confirmDelete = () => {
    if (deviceToDelete) {
      deleteDevice(deviceToDelete);
      setShowConfirmation(false);
      setDeviceToDelete(null);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedDevices = devices.map(device =>
        device._id === updatedDevice._id ? updatedDevice : device
      );
      setDevices(updatedDevices);
    } catch (error) {
      setError('Failed to update device');
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="app">
      <h1 className="title">EcoCycle</h1>
      <h2 className="subtitle">ESP32 Monitoring System</h2>
      <div className="main-content">
        <div className="content-header">
          <button onClick={() => setIsModalOpen(true)} className="add-device-btn">Add ESP32</button>
          <div className={`server-status ${serverStatus}`}>
            Server Status
            <span className="status-indicator"></span>
          </div>
          <button onClick={() => setShowNotifications(!showNotifications)} className="notification-btn">
            <Bell size={24} />
            {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
          </button>
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
        <AddESP32Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={addDevice} 
        />
        {showConfirmation && (
          <div className="confirmation-modal show">
            <p>Are you sure you want to remove this device?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setShowConfirmation(false)}>No</button>
          </div>
        )}
        {editDevice && (
          <EditDeviceModal
            device={editDevice}
            onClose={() => setEditDevice(null)}
            onSave={editDeviceInfo}
          />
        )}
      </div>
      {showNotifications && (
        <NotificationList 
          notifications={notifications} 
          onClose={() => setShowNotifications(false)}
          onClear={handleClearNotifications}
        />
      )}
    </div>
  );
}
