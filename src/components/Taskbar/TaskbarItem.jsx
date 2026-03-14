/**
 * TaskbarItem – A single window button in the taskbar.
 */

import React from 'react';
import { useOS } from '../../context/OSContext';

export default function TaskbarItem({ windowData }) {
  const { restoreWindow, minimizeWindow, focusWindow } = useOS();
  const { id, title, icon, minimized, zIndex } = windowData;

  const handleClick = () => {
    if (minimized) {
      restoreWindow(id);
    } else {
      minimizeWindow(id);
    }
  };

  return (
    <button
      className={`taskbar-item ${!minimized ? 'active' : ''}`}
      onClick={handleClick}
      title={title}
    >
      <span className="taskbar-item-icon">{icon}</span>
      <span className="taskbar-item-label">{title}</span>
    </button>
  );
}
