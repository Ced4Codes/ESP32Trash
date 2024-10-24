import React, { useState, useEffect } from 'react';
import DeviceCard from './components/DeviceCard';
import AddESP32Modal from './components/AddESP32Modal';
import EditDeviceModal from './components/EditDeviceModal';
import NotificationList from './components/NotificationList';
import ConfirmationModal from './components/ConfirmationModal';
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
    const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/devices');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDevices(data);
      console.log('Fetched devices:', data); // Log the fetched data
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Failed to fetch devices. Please check your server connection.');
      setServerStatus('offline');
    }
  };

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/status');
      if (response.ok) {
        setServerStatus('online');
        setError(null);
      } else {
        throw new Error('Server is not responding correctly');
      }
    } catch (error) {
      console.error('Error checking server status:', error);
      setServerStatus('offline');
      setError('Unable to connect to the server. Please check your connection.');
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
      addNotification(`Device ${name} added successfully`);
    } catch (error) {
      console.error('Error adding device:', error);
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
      addNotification(`Device ${updatedDevice.name} updated successfully`);
    } catch (error) {
      console.error('Error updating device:', error);
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
      addNotification('Device deleted successfully');
    } catch (error) {
      console.error('Error deleting device:', error);
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
        {error && <p className="error-message">{error}</p>}
        <div className="device-grid">
          {devices.map((device) => (
            <DeviceCard
              key={device._id}
              device={device}
              onEdit={() => {
                setEditDevice(device);
              }}
              addNotification={addNotification}
            />
          ))}
        </div>
      </div>
      {showNotifications && (
        <NotificationList
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onClear={() => setNotifications([])}
        />
      )}
      <AddESP32Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addDevice}
      />
      {editDevice && (
        <EditDeviceModal
          device={editDevice}
          onClose={() => setEditDevice(null)}
          onSave={editDeviceInfo}
          onDelete={(id) => {
            setDeviceToDelete(id);
            setShowConfirmation(true);
          }}
        />
      )}
      {showConfirmation && (
        <ConfirmationModal
          message="Are you sure you want to delete this device?"
          onConfirm={() => {
            handleDeleteDevice(deviceToDelete);
            setShowConfirmation(false);
          }}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}