/**
 * DesktopIcon – Absolutely positioned desktop icon with double-click to open.
 */

import React, { useState, useRef, useCallback } from 'react';
import './Desktop.css';

export default function DesktopIcon({ id, label, icon, position, onOpen, onMouseDown }) {
  const [selected, setSelected] = useState(false);
  const clickCount  = useRef(0);
  const clickTimer  = useRef(null);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    setSelected(true);
    clickCount.current += 1;

    if (clickCount.current === 1) {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current >= 2) {
      clearTimeout(clickTimer.current);
      clickCount.current = 0;
      onOpen();
    }
  }, [onOpen]);

  const handleMouseDown = useCallback((e) => {
    onMouseDown?.(e);
  }, [onMouseDown]);

  const handleBlur = useCallback(() => setSelected(false), []);

  return (
    <div
      className={`desktop-icon${selected ? ' selected' : ''}`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onBlur={handleBlur}
      tabIndex={0}
      role="button"
      aria-label={`Ouvrir ${label}`}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
    >
      <div className="icon-image">{icon}</div>
      <div className="icon-label">{label}</div>
    </div>
  );
}
