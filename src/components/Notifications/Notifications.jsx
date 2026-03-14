/**
 * Notifications – Retro XP-style toast notifications from system tray.
 */

import React from 'react';
import { useOS } from '../../context/OSContext';
import './Notifications.css';

export default function Notifications() {
  const { state, removeNotification } = useOS();
  const { notifications } = state;

  if (!notifications.length) return null;

  return (
    <div className="notifications-container">
      {notifications.map(notif => (
        <div key={notif.id} className="xp-notification anim-notif-in">
          <div className="notif-icon">{notif.icon}</div>
          <div className="notif-content">
            <div className="notif-title">XP Vibing</div>
            <div className="notif-message">{notif.message}</div>
          </div>
          <div className="notif-close" onClick={() => removeNotification(notif.id)}>✕</div>
        </div>
      ))}
    </div>
  );
}
