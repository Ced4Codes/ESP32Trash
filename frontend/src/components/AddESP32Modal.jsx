import React, { useState } from 'react';
import './AddESP32Modal.css';

const AddESP32Modal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(name, ip);
    setName('');
    setIp('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-esp32-modal">
        <h2>Add New ESP32</h2>
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
};

export default AddESP32Modal;
