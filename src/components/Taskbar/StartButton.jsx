/**
 * StartButton – The XP "Start" button with glossy green gradient.
 */

import React from 'react';
import { useOS } from '../../context/OSContext';

export default function StartButton() {
  const { toggleStartMenu, state } = useOS();

  return (
    <button
      className={`start-btn ${state.startMenuOpen ? 'active' : ''}`}
      onClick={toggleStartMenu}
      aria-haspopup="menu"
      aria-expanded={state.startMenuOpen}
    >
      <span className="start-logo">⊞</span>
      <span className="start-text">Démarrer</span>
    </button>
  );
}
