/**
 * Window – Reusable draggable window component.
 * Features: drag, minimize, close, focus management, XP styling.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { useDrag } from '../../hooks/useDrag';
import './Window.css';

export default function Window({ windowData, children }) {
  const { closeWindow, minimizeWindow, focusWindow, moveWindow } = useOS();
  const { id, title, icon, position, size, minimized, zIndex } = windowData;
  const [isVisible, setIsVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleMove = (pos) => moveWindow(id, pos);
  const handleFocus = () => focusWindow(id);

  const { onMouseDown } = useDrag({
    onMove: handleMove,
    onFocus: handleFocus,
  });

  const handleClose = (e) => {
    e.stopPropagation();
    setClosing(true);
    setTimeout(() => closeWindow(id), 180);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    minimizeWindow(id);
  };

  if (minimized) return null;

  return (
    <div
      className={`window ${isVisible ? 'window-visible' : ''} ${closing ? 'window-closing' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.w,
        height: size.h,
        zIndex,
      }}
      onMouseDown={handleFocus}
    >
      {/* Title Bar */}
      <div
        className="win-titlebar"
        onMouseDown={(e) => onMouseDown(e, position)}
      >
        <div className="win-icon">{icon}</div>
        <div className="win-title">{title}</div>
        <div className="win-controls">
          <button
            className="win-btn win-btn-minimize"
            onClick={handleMinimize}
            title="Réduire"
            aria-label="Réduire"
          >
            <span className="win-btn-icon">
              <svg width="8" height="8" viewBox="0 0 8 8">
                <rect x="0" y="6" width="8" height="2" fill="currentColor"/>
              </svg>
            </span>
          </button>
          <button
            className="win-btn win-btn-maximize"
            title="Agrandir"
            aria-label="Agrandir"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="win-btn-icon">
              <svg width="8" height="8" viewBox="0 0 8 8">
                <rect x="0" y="0" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="0" y="0" width="8" height="2" fill="currentColor"/>
              </svg>
            </span>
          </button>
          <button
            className="win-btn win-btn-close"
            onClick={handleClose}
            title="Fermer"
            aria-label="Fermer"
          >
            <span className="win-btn-icon">
              <svg width="8" height="8" viewBox="0 0 8 8">
                <line x1="0" y1="0" x2="8" y2="8" stroke="currentColor" strokeWidth="1.8"/>
                <line x1="8" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Menu bar (optional, slot via children) */}
      <div className="win-body">
        {children}
      </div>

      {/* Resize handle */}
      <div className="win-resize-handle" />
    </div>
  );
}
