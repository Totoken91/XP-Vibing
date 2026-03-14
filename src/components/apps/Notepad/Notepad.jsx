/**
 * Notepad – Simple text editor with localStorage persistence.
 */

import React, { useState, useEffect, useCallback } from 'react';
import './Notepad.css';

const STORAGE_KEY = 'xp-notepad';

export default function Notepad() {
  const [text, setText] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [saved, setSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(wc);
    setCharCount(text.length);
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);
    setSaved(false);
  };

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, text);
    setSaved(true);
  }, [text]);

  const handleClear = () => {
    if (window.confirm('Voulez-vous effacer tout le contenu ?')) {
      setText('');
      localStorage.removeItem(STORAGE_KEY);
      setSaved(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
  };

  // Ctrl+S to save
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  return (
    <div className="notepad">
      {/* Menu bar */}
      <div className="np-menubar">
        <button className="np-menu-btn" onClick={handleSave} title="Ctrl+S">💾 Enregistrer</button>
        <button className="np-menu-btn" onClick={handleCopy}>📋 Copier tout</button>
        <button className="np-menu-btn" onClick={handleClear}>🗑️ Effacer</button>
        {!saved && <span className="np-unsaved">● non enregistré</span>}
      </div>

      {/* Text area */}
      <textarea
        className="np-textarea"
        value={text}
        onChange={handleChange}
        placeholder="Commencez à taper ici...

Bienvenue dans Bloc-notes XP !
• Ctrl+S pour enregistrer
• Votre texte est sauvegardé localement"
        spellCheck={false}
      />

      {/* Status bar */}
      <div className="np-statusbar">
        <span>{charCount} caractères</span>
        <span>·</span>
        <span>{wordCount} mots</span>
        <span>·</span>
        <span>{text.split('\n').length} lignes</span>
        <div className="np-saved-state">
          {saved ? '✓ Enregistré' : '● Modifications non enregistrées'}
        </div>
      </div>
    </div>
  );
}
