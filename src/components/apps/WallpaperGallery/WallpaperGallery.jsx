/**
 * WallpaperGallery – Change the desktop wallpaper.
 */

import React from 'react';
import { useOS, WALLPAPERS, WALLPAPER_STYLES } from '../../../context/OSContext';
import './WallpaperGallery.css';

export default function WallpaperGallery() {
  const { state, setWallpaper } = useOS();

  return (
    <div className="wallpaper-gallery">
      <div className="wg-header">
        <h3>🖼️ Arrière-plans du bureau</h3>
        <p>Sélectionnez un arrière-plan pour personnaliser votre bureau.</p>
      </div>

      <div className="wg-grid">
        {WALLPAPERS.map(wp => (
          <div
            key={wp.id}
            className={`wg-item ${state.wallpaper === wp.id ? 'wg-selected' : ''}`}
            onClick={() => setWallpaper(wp.id)}
          >
            <div
              className="wg-preview"
              style={wp.type === 'solid'
                ? { background: wp.value }
                : { background: WALLPAPER_STYLES[wp.value] }
              }
            >
              {/* Fake mini desktop */}
              <div className="wg-mini-taskbar" />
              {state.wallpaper === wp.id && (
                <div className="wg-check">✓</div>
              )}
            </div>
            <div className="wg-label">{wp.label}</div>
          </div>
        ))}
      </div>

      <div className="wg-footer">
        <div className="wg-current">
          Arrière-plan actuel : <strong>{WALLPAPERS.find(w => w.id === state.wallpaper)?.label || state.wallpaper}</strong>
        </div>
      </div>
    </div>
  );
}
