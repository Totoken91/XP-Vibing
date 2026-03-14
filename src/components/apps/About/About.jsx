/**
 * About – Credits + easter eggs + system info.
 */

import React, { useState, useEffect } from 'react';
import './About.css';

export default function About() {
  const [easterEggs, setEasterEggs] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [konami, setKonami] = useState([]);
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

  useEffect(() => {
    const handler = (e) => {
      setKonami(prev => {
        const next = [...prev, e.key].slice(-10);
        if (JSON.stringify(next) === JSON.stringify(KONAMI)) {
          setShowSecret(true);
          setEasterEggs(e => e + 1);
        }
        return next;
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleEgg = () => {
    setEasterEggs(e => e + 1);
    alert('🥚 Easter egg trouvé ! Tu es vraiment curieux(se).\n\nEssaie aussi : ↑↑↓↓←→←→BA');
  };

  return (
    <div className="about-app">
      {/* Logo */}
      <div className="about-logo-section">
        <div className="about-os-logo">
          <span className="about-logo-xp">XP</span>
          <span className="about-logo-v">Vibing</span>
        </div>
        <div className="about-tagline">L'expérience qui se renouvelle</div>
        <div className="about-version">Version 2001.0.1 (Build 2026) · Édition Nostalgique</div>
      </div>

      <div className="about-sep" />

      {/* System info */}
      <div className="about-info-grid">
        <div className="about-info-row">
          <span className="about-info-key">Système</span>
          <span className="about-info-val">XP Vibing Web OS</span>
        </div>
        <div className="about-info-row">
          <span className="about-info-key">Processeur</span>
          <span className="about-info-val">VibePentium 4 @ 2.40 GHz</span>
        </div>
        <div className="about-info-row">
          <span className="about-info-key">RAM</span>
          <span className="about-info-val">512 MB DDR · ∞ virtual</span>
        </div>
        <div className="about-info-row">
          <span className="about-info-key">Affichage</span>
          <span className="about-info-val">{window.innerWidth}×{window.innerHeight} · 32-bit</span>
        </div>
        <div className="about-info-row">
          <span className="about-info-key">Navigateur</span>
          <span className="about-info-val">Internet Explorador 6.0</span>
        </div>
      </div>

      <div className="about-sep" />

      {/* Credits */}
      <div className="about-credits">
        <div className="about-credits-title">Crédits & Remerciements</div>
        <p>🎨 Inspiré par Windows XP, Winamp, Solitaire, et tous les souvenirs de l'informatique familiale des années 2000.</p>
        <p>🎵 Lecteur audio avec visualiseur Web Audio API.</p>
        <p>🎮 Mini-jeux : Serpent XP & Démineur.</p>
        <p>💾 Construit avec React + Vite · CSS pur · Zéro dépendance UI externe.</p>
        <p>🌐 Faux navigateur IE6 avec sites nostalgiques inclus.</p>
      </div>

      <div className="about-sep" />

      {/* Easter eggs counter */}
      <div className="about-eggs-row">
        <span>🥚 Easter eggs trouvés : <strong>{easterEggs}</strong>/5</span>
        <button
          className="about-egg-btn"
          onClick={handleEgg}
          title="Un easter egg se cache ici..."
        >
          🔍 Chercher
        </button>
      </div>

      {showSecret && (
        <div className="about-secret">
          🎉 CODE KONAMI ACTIVÉ !<br />
          Tu as débloqué le mode Nostalgie Ultime ✨<br />
          <small>↑↑↓↓←→←→BA — tu connais le truc !</small>
        </div>
      )}

      <div className="about-footer">
        <button className="xp-btn" onClick={() => window.open('https://github.com', '_blank', 'noopener')}>
          🔗 GitHub
        </button>
        <div className="about-copyright">
          © 2001–2026 XP Vibing Corp. Tous droits réservés.<br />
          Ce produit est sous licence Nostalgie Libre (NL-1.0).
        </div>
      </div>
    </div>
  );
}
