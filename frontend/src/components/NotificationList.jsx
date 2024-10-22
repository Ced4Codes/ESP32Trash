import React from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import './NotificationList.css';

const NotificationList = ({ notifications, onClose, onClear }) => {
  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal">
        <div className="notification-header">
          <h3>Notifications</h3>
          <button onClick={onClose} className="close-btn">
            <FaTimes />
          </button>
        </div>
        <div className="notification-content">
          {notifications.length > 0 ? (
            <>
              <ul>
                {notifications.map(notification => (
                  <li key={notification.id}>{notification.message}</li>
                ))}
              </ul>
              <button onClick={onClear} className="clear-btn">
                <FaTrash /> Clear All
              </button>
            </>
          ) : (
            <p>No notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;