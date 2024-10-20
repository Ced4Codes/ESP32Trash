import React from 'react';
import './ESP32Card.css';

const ESP32Card = ({ device, deleteDevice }) => {
  return (
    <div className="card">
      <h3>{device.name}</h3>
      <p>{device.ip}</p>
      <p>Status: {device.status}</p>
      <button onClick={() => deleteDevice(device.id)}>Delete</button>
    </div>
  );
};

export default ESP32Card;
