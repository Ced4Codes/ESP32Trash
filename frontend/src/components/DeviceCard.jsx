import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './DeviceCard.css';

const DeviceCard = ({ device, onDelete, onEdit, addNotification }) => {
  const { _id, name, ip, trashBins = {} } = device;
  const [isOnline, setIsOnline] = useState(true);
  const [showFullModal, setShowFullModal] = useState(false);

  const checkDeviceStatus = useCallback(async () => {
    try {
      const response = await fetch(`http://${ip}/status`);
      const isDeviceOnline = response.ok;
      if (!isDeviceOnline && isOnline) {
        addNotification(`Device ${name || _id} is offline.`);
      }
      setIsOnline(isDeviceOnline);
    } catch (error) {
      if (isOnline) {
        addNotification(`Device ${name || _id} is offline.`);
      }
      setIsOnline(false);
    }
  }, [ip, isOnline, name, _id, addNotification]);

  useEffect(() => {
    const interval = setInterval(checkDeviceStatus, 10000);
    return () => clearInterval(interval);
  }, [checkDeviceStatus]);

  const defaultBins = useMemo(() => ({
    Bio: 0,
    Plastic: 0,
    Metal: 0,
    Others: 0,
  }), []);

  const bins = useMemo(() => ({ ...defaultBins, ...trashBins }), [defaultBins, trashBins]);

  const isBinFull = useCallback((value) => value === 'FULL' || value >= 100, []);

  useEffect(() => {
    const fullBins = Object.values(bins).filter(isBinFull);
    setShowFullModal(fullBins.length > 0);
  }, [bins, isBinFull]);

  return (
    <div className={`device-card ${!isOnline ? 'offline' : ''}`}>
      <div className="device-header">
        <h2>{name || 'Unnamed Device'}</h2>
        <div className="device-actions">
          <button onClick={() => onEdit(device)} className="edit-icon" aria-label="Edit device">
            <FaEdit />
          </button>
        </div>
      </div>
      <p>{ip || 'No IP Address'}</p>
      <div className="trash-bins">
        <h3>Trash Bins</h3>
        <div className="bin-buttons">
          {Object.entries(bins).map(([type, value]) => (
            <span
              key={type}
              className={`bin-button ${type.toLowerCase()} ${isBinFull(value) ? 'full' : ''}`}
            >
              {type} | {isBinFull(value) ? <span className="flashing">FULL</span> : value}
            </span>
          ))}
        </div>
      </div>
      {!isOnline && (
        <div className="offline-overlay">
          <p>ESP32 Down</p>
        </div>
      )}
      {showFullModal && (
        <div className="full-modal">
          <p>One or more bins are full!</p>
          <button onClick={() => setShowFullModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default DeviceCard;
