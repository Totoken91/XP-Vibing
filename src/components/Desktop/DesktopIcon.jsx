/**
 * DesktopIcon – A single desktop icon with double-click to open.
 */

import React, { useState, useRef, useCallback } from 'react';
import './Desktop.css';

export default function DesktopIcon({ id, label, icon, onOpen }) {
  const [selected, setSelected] = useState(false);
  const clickTimeout = useRef(null);
  const clickCount = useRef(0);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    clickCount.current += 1;
    setSelected(true);

    if (clickCount.current === 1) {
      clickTimeout.current = setTimeout(() => {
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current >= 2) {
      clearTimeout(clickTimeout.current);
      clickCount.current = 0;
      onOpen();
    }
  }, [onOpen]);

  const handleBlur = useCallback(() => {
    setSelected(false);
  }, []);

  return (
    <div
      className={`desktop-icon ${selected ? 'selected' : ''}`}
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
