import React from 'react';
import './Loader.css';

const Loader = () => (
  <div className="loader-container">
    <div className="loader">
      <p>loading</p>
      <div className="words">
        <span className="word">Frontend</span>
        <span className="word">Backend</span>
        <span className="word">Server</span>
        <span className="word">ESP32</span>
      </div>
    </div>
    <p className="status-message">Establishing connection to ESP32 network...</p>
  </div>
);

export default Loader;
