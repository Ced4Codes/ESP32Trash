import React, { useState } from 'react';
import './EditDeviceModal.css';

const EditDeviceModal = ({ device, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(device.name);
  const [ip, setIp] = useState(device.ip);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await onSave({
        _id: device._id,
        name,
        ip,
        trashBins: device.trashBins
      });
      if (response.ok) {
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Error updating device:', errorData.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const handleDelete = async () => {
    await onDelete(device._id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="edit-device-modal">
        <h2>Edit Device</h2>
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
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="button" onClick={handleDelete} className="delete-button">Delete</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeviceModal;
