/**
 * StartMenu – XP-style Start menu with user section, app list, and footer.
 */

import React, { useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';
import './StartMenu.css';

const ALL_PROGRAMS = [
  { id: 'musicPlayer',      label: 'XP Music',           icon: '🎵', desc: 'Lecteur audio nostalgique' },
  { id: 'snake',            label: 'Serpent XP',          icon: '🐍', desc: 'Mini-jeu classique' },
  { id: 'minesweeper',      label: 'Démineur',            icon: '💣', desc: 'Mini-jeu de déminage' },
  { id: 'notepad',          label: 'Bloc-notes',          icon: '📝', desc: 'Éditeur de texte simple' },
  { id: 'fileExplorer',     label: 'Explorateur',         icon: '📁', desc: 'Mes documents' },
  { id: 'fakeBrowser',      label: 'IE Explorador',       icon: '🌐', desc: 'Navigateur Internet' },
  { id: 'wallpaperGallery', label: 'Arrière-plans',       icon: '🖼️', desc: 'Changer le fond d\'écran' },
  { id: 'clock',            label: 'Horloge',             icon: '🕐', desc: 'Heure & calendrier' },
  { id: 'about',            label: 'À propos',            icon: '💻', desc: 'XP Vibing v2001' },
  { id: 'paint',            label: 'Paint',               icon: '🎨', desc: 'Dessin et peinture' },
];

const PINNED = ['musicPlayer', 'snake', 'fakeBrowser'];

export default function StartMenu() {
  const { state, openApp, closeStartMenu } = useOS();
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!state.startMenuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        // Don't close if clicking the start button
        if (e.target.closest('.start-btn')) return;
        closeStartMenu();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [state.startMenuOpen, closeStartMenu]);

  if (!state.startMenuOpen) return null;

  const pinnedApps = ALL_PROGRAMS.filter(a => PINNED.includes(a.id));
  const otherApps = ALL_PROGRAMS.filter(a => !PINNED.includes(a.id));

  const handleOpen = (id) => {
    openApp(id);
    closeStartMenu();
  };

  const handleShutdown = () => {
    closeStartMenu();
    // Easter egg
    setTimeout(() => alert('💡 Vous pouvez désormais éteindre votre PC en toute sécurité.\n\n(C\'est une blague, ne fermez rien !)'), 100);
  };

  return (
    <div className="start-menu anim-start-menu" ref={menuRef} role="menu">
      {/* User banner */}
      <div className="sm-header">
        <div className="sm-user-avatar">👤</div>
        <div className="sm-user-name">Utilisateur XP</div>
      </div>

      <div className="sm-body">
        {/* Left: Pinned + all programs */}
        <div className="sm-left">
          <div className="sm-section-label">Épinglés</div>
          {pinnedApps.map(app => (
            <StartMenuItem key={app.id} app={app} onOpen={handleOpen} />
          ))}

          <div className="sm-separator" />
          <div className="sm-section-label">Tous les programmes</div>
          {otherApps.map(app => (
            <StartMenuItem key={app.id} app={app} onOpen={handleOpen} />
          ))}
        </div>

        {/* Right: Places */}
        <div className="sm-right">
          <div className="sm-section-label">Accès rapide</div>
          <PlaceItem icon="📁" label="Mes Documents" onClick={() => handleOpen('fileExplorer')} />
          <PlaceItem icon="🖼️" label="Mes Images" onClick={() => handleOpen('wallpaperGallery')} />
          <PlaceItem icon="🎵" label="Ma Musique" onClick={() => handleOpen('musicPlayer')} />
          <PlaceItem icon="🌐" label="Internet" onClick={() => handleOpen('fakeBrowser')} />
          <div className="sm-separator" />
          <PlaceItem icon="⚙️" label="Panneau de config." onClick={() => handleOpen('about')} />
          <PlaceItem icon="🕐" label="Date et heure" onClick={() => handleOpen('clock')} />
        </div>
      </div>

      {/* Footer */}
      <div className="sm-footer">
        <button className="sm-footer-btn" onClick={handleShutdown}>
          <span>🔴</span> Arrêter
        </button>
        <button className="sm-footer-btn" onClick={() => { closeStartMenu(); window.location.reload(); }}>
          <span>🔄</span> Redémarrer
        </button>
      </div>
    </div>
  );
}

function StartMenuItem({ app, onOpen }) {
  return (
    <button className="sm-item" onClick={() => onOpen(app.id)} role="menuitem">
      <span className="sm-item-icon">{app.icon}</span>
      <div className="sm-item-text">
        <div className="sm-item-name">{app.label}</div>
        <div className="sm-item-desc">{app.desc}</div>
      </div>
    </button>
  );
}

function PlaceItem({ icon, label, onClick }) {
  return (
    <button className="sm-place-item" onClick={onClick} role="menuitem">
      <span className="sm-place-icon">{icon}</span>
      <span className="sm-place-label">{label}</span>
    </button>
  );
}
