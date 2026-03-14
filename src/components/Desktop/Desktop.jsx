/**
 * Desktop – Main desktop area with wallpaper and icons.
 */

import React, { useCallback } from 'react';
import { useOS, WALLPAPER_STYLES } from '../../context/OSContext';
import DesktopIcon from './DesktopIcon';
import './Desktop.css';

const DESKTOP_ICONS = [
  { id: 'musicPlayer',     label: 'XP Music',        icon: '🎵', row: 0, col: 0 },
  { id: 'notepad',         label: 'Bloc-notes',       icon: '📝', row: 1, col: 0 },
  { id: 'fileExplorer',    label: 'Mes documents',    icon: '📁', row: 2, col: 0 },
  { id: 'fakeBrowser',     label: 'IE Explorador',    icon: '🌐', row: 3, col: 0 },
  { id: 'snake',           label: 'Serpent XP',       icon: '🐍', row: 4, col: 0 },
  { id: 'minesweeper',     label: 'Démineur',         icon: '💣', row: 5, col: 0 },
  { id: 'wallpaperGallery',label: 'Arrière-plans',    icon: '🖼️', row: 0, col: 1 },
  { id: 'clock',           label: 'Horloge',          icon: '🕐', row: 1, col: 1 },
  { id: 'about',           label: 'À propos',         icon: '💻', row: 2, col: 1 },
];

export default function Desktop() {
  const { state, openApp, closeStartMenu } = useOS();
  const { wallpaper } = state;

  const handleDesktopClick = useCallback(() => {
    closeStartMenu();
  }, [closeStartMenu]);

  const wallpaperValue = wallpaper.startsWith('#') ? wallpaper : WALLPAPER_STYLES[wallpaper];
  const wallpaperStyle = wallpaperValue?.startsWith('url(')
    ? { backgroundImage: wallpaperValue }
    : { background: wallpaperValue };

  return (
    <div
      className="desktop"
      style={wallpaperStyle}
      onClick={handleDesktopClick}
    >
      {/* Wallpaper decorations for 'bliss' */}
      {wallpaper === 'bliss' && <div className="bliss-clouds" />}
      {wallpaper === 'matrix' && <MatrixRain />}
      {wallpaper === 'space' && <SpaceStars />}

      {/* Desktop Icons */}
      <div className="desktop-icons">
        {DESKTOP_ICONS.map(icon => (
          <DesktopIcon
            key={icon.id}
            {...icon}
            onOpen={() => openApp(icon.id)}
          />
        ))}
      </div>
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
