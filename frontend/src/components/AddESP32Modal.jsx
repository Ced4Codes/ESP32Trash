import React, { useState } from 'react';
import './AddESP32Modal.css';

export default function AddESP32Modal({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onAdd(name, ip);
      setName('');
      setIp('');
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to add device. Please try again.');
      // Do not close the modal here
    }
  };

  const handleErrorAcknowledge = () => {
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-esp32-modal">
        <h2>Add New ESP32</h2>
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button type="button" onClick={handleErrorAcknowledge} className="error-ok-btn">OK</button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ip">IP Address:</label>
            <input
              type="text"
              id="ip"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              required
              pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
              title="Please enter a valid IP address"
            />
          </div>
          <div className="button-group">
            <button type="submit">Add Device</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}