/**
 * Desktop – Main desktop area with wallpaper, draggable icons.
 */

import React, { useCallback, useRef, useState } from 'react';
import { useOS, WALLPAPER_STYLES } from '../../context/OSContext';
import DesktopIcon from './DesktopIcon';
import './Desktop.css';

const ICON_STEP = 84;
const ICON_STORAGE_KEY = 'xp-icon-positions';

const DESKTOP_ICONS = [
  { id: 'musicPlayer',     label: 'XP Music',     icon: '🎵' },
  { id: 'notepad',         label: 'Bloc-notes',    icon: '📝' },
  { id: 'fileExplorer',    label: 'Mes documents', icon: '📁' },
  { id: 'fakeBrowser',     label: 'IE Explorador', icon: '🌐' },
  { id: 'snake',           label: 'Serpent XP',    icon: '🐍' },
  { id: 'minesweeper',     label: 'Démineur',      icon: '💣' },
  { id: 'wallpaperGallery',label: 'Arrière-plans', icon: '🖼️' },
  { id: 'clock',           label: 'Horloge',       icon: '🕐' },
  { id: 'about',           label: 'À propos',      icon: '💻' },
  { id: 'paint',           label: 'Paint',         icon: '🎨' },
];

function defaultPositions() {
  const cols = [0, 1];
  const pos = {};
  DESKTOP_ICONS.forEach((icon, i) => {
    const col = i >= 6 ? 1 : 0;
    const row = i >= 6 ? i - 6 : i;
    pos[icon.id] = { x: 8 + col * ICON_STEP, y: 8 + row * ICON_STEP };
  });
  return pos;
}

function loadPositions() {
  try {
    const saved = localStorage.getItem(ICON_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults so new icons get a position
      return { ...defaultPositions(), ...parsed };
    }
  } catch {}
  return defaultPositions();
}

export default function Desktop() {
  const { state, openApp, closeStartMenu } = useOS();
  const { wallpaper } = state;

  const [positions, setPositions] = useState(loadPositions);
  const dragRef = useRef(null); // { id, offsetX, offsetY, moved }

  const wallpaperValue = wallpaper.startsWith('#') ? wallpaper : WALLPAPER_STYLES[wallpaper];
  const wallpaperStyle = wallpaperValue?.startsWith('url(')
    ? { backgroundImage: wallpaperValue }
    : { background: wallpaperValue };

  const handleIconMouseDown = useCallback((e, id) => {
    if (e.button !== 0) return;
    const pos = positions[id] || { x: 0, y: 0 };
    dragRef.current = {
      id,
      offsetX: e.clientX - pos.x,
      offsetY: e.clientY - pos.y,
      moved: false,
    };
  }, [positions]);

  const handleMouseMove = useCallback((e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const newX = e.clientX - drag.offsetX;
    const newY = e.clientY - drag.offsetY;
    // Mark as moved if cursor moved more than 4px
    if (!drag.moved) {
      const dx = Math.abs(newX - (positions[drag.id]?.x || 0));
      const dy = Math.abs(newY - (positions[drag.id]?.y || 0));
      if (dx > 4 || dy > 4) drag.moved = true;
    }
    if (drag.moved) {
      setPositions(prev => ({ ...prev, [drag.id]: { x: newX, y: newY } }));
    }
  }, [positions]);

  const handleMouseUp = useCallback(() => {
    if (dragRef.current?.moved) {
      setPositions(prev => {
        localStorage.setItem(ICON_STORAGE_KEY, JSON.stringify(prev));
        return prev;
      });
    }
    dragRef.current = null;
  }, []);

  const handleDesktopClick = useCallback(() => {
    closeStartMenu();
  }, [closeStartMenu]);

  const handleTryOpen = useCallback((id) => {
    // Don't open if we just finished a drag
    if (dragRef.current?.moved) return;
    openApp(id);
  }, [openApp]);

  return (
    <div
      className="desktop"
      style={wallpaperStyle}
      onClick={handleDesktopClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {wallpaper === 'bliss' && <div className="bliss-clouds" />}
      {wallpaper === 'matrix' && <MatrixRain />}
      {wallpaper === 'space' && <SpaceStars />}

      {DESKTOP_ICONS.map(icon => (
        <DesktopIcon
          key={icon.id}
          {...icon}
          position={positions[icon.id] || { x: 0, y: 0 }}
          onOpen={() => handleTryOpen(icon.id)}
          onMouseDown={(e) => handleIconMouseDown(e, icon.id)}
        />
      ))}
    </div>
  );
}

/* ── Wallpaper decorations ──────────────────────────── */

function MatrixRain() {
  return (
    <div className="matrix-overlay" aria-hidden>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="matrix-col" style={{
          left: `${i * 5 + Math.random() * 2}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
          fontSize: `${10 + Math.random() * 8}px`,
        }}>
          {Array.from({ length: 15 }).map((_, j) => (
            <span key={j} style={{ opacity: Math.random() }}>
              {String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function SpaceStars() {
  return (
    <div className="space-stars" aria-hidden>
      {Array.from({ length: 80 }).map((_, i) => (
        <div key={i} className="star" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }} />
      ))}
    </div>
  );
}
