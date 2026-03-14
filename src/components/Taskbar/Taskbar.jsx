/**
 * Taskbar – Bottom bar with Start button, window buttons, system tray.
 */

import React from 'react';
import { useOS } from '../../context/OSContext';
import StartButton from './StartButton';
import TaskbarItem from './TaskbarItem';
import Clock from './Clock';
import './Taskbar.css';

export default function Taskbar() {
  const { state } = useOS();
  const { windows } = state;

  return (
    <div className="taskbar">
      <StartButton />

      <div className="taskbar-divider" />

      {/* Quick Launch */}
      <div className="quick-launch">
        <button className="ql-btn" title="Bureau" onClick={() => {}}>🖥️</button>
      </div>

      <div className="taskbar-divider" />

      {/* Window buttons */}
      <div className="taskbar-windows">
        {windows.map(win => (
          <TaskbarItem key={win.id} windowData={win} />
        ))}
      </div>

      {/* System Tray */}
      <div className="system-tray">
        <div className="tray-icons">
          <span title="Volume">🔊</span>
          <span title="Réseau">🌐</span>
        </div>
        <div className="tray-divider" />
        <Clock />
      </div>
    </div>
  );
}
