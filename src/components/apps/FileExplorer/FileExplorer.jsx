/**
 * FileExplorer – Fictional XP-style file explorer.
 */

import React, { useState } from 'react';
import './FileExplorer.css';

const FS = {
  'C:': {
    type: 'folder',
    children: {
      'Windows': {
        type: 'folder',
        children: {
          'System32': { type: 'folder', children: {
            'notepad.exe': { type: 'file', size: '69 Ko', ext: 'exe', icon: '⚙️' },
            'calc.exe':    { type: 'file', size: '114 Ko', ext: 'exe', icon: '⚙️' },
          }},
          'Media': { type: 'folder', children: {
            'Windows XP Startup.wav': { type: 'file', size: '424 Ko', ext: 'wav', icon: '🎵' },
            'chimes.wav': { type: 'file', size: '68 Ko', ext: 'wav', icon: '🎵' },
          }},
          'winxp.log': { type: 'file', size: '1 Ko', ext: 'log', icon: '📄' },
        }
      },
      'Program Files': {
        type: 'folder',
        children: {
          'XP Vibing': { type: 'folder', children: {
            'XPVibing.exe': { type: 'file', size: '2,048 Ko', ext: 'exe', icon: '⊞' },
            'readme.txt': { type: 'file', size: '4 Ko', ext: 'txt', icon: '📄' },
          }},
          'Internet Explorador 6': { type: 'folder', children: {
            'ie6.exe': { type: 'file', size: '1,200 Ko', ext: 'exe', icon: '🌐' },
          }},
        }
      },
      'Mes documents': {
        type: 'folder',
        children: {
          'Ma musique': { type: 'folder', children: {
            'README.txt': { type: 'file', size: '1 Ko', ext: 'txt', icon: '📄' },
          }},
          'Mes images': { type: 'folder', children: {
            'bureau.jpg': { type: 'file', size: '1,024 Ko', ext: 'jpg', icon: '🖼️' },
          }},
          'notes.txt': { type: 'file', size: '2 Ko', ext: 'txt', icon: '📄' },
          'TODO.txt': { type: 'file', size: '1 Ko', ext: 'txt', icon: '📄' },
        }
      },
      'pagefile.sys': { type: 'file', size: '512,000 Ko', ext: 'sys', icon: '💾' },
    }
  }
};

function getNode(path) {
  let node = FS;
  for (const seg of path) {
    node = node[seg]?.children || node[seg];
    if (!node) return null;
  }
  return node;
}

export default function FileExplorer() {
  const [path, setPath] = useState(['C:']);
  const [selected, setSelected] = useState(null);

  const current = getNode(path);
  const entries = current?.children
    ? Object.entries(current.children).sort((a, b) => {
        if (a[1].type !== b[1].type) return a[1].type === 'folder' ? -1 : 1;
        return a[0].localeCompare(b[0]);
      })
    : [];

  const navigate = (name, node) => {
    if (node.type === 'folder') {
      setPath([...path, name]);
      setSelected(null);
    } else {
      setSelected(name);
    }
  };

  const goUp = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
      setSelected(null);
    }
  };

  const pathStr = path.join('\\') + '\\';

  return (
    <div className="file-explorer">
      {/* Toolbar */}
      <div className="fe-toolbar">
        <button className="xp-btn fe-nav-btn" onClick={goUp} disabled={path.length <= 1}>
          ← Précédent
        </button>
        <div className="fe-address-bar">
          <span className="fe-addr-label">Adresse</span>
          <input className="xp-input fe-addr-input" value={pathStr} readOnly />
        </div>
      </div>

      <div className="fe-body">
        {/* Sidebar */}
        <div className="fe-sidebar">
          <div className="fe-sidebar-section">
            <div className="fe-sidebar-title">Tâches du fichier</div>
            <div className="fe-sidebar-item">📁 Nouveau dossier</div>
            <div className="fe-sidebar-item">📋 Publier en ligne</div>
          </div>
          <div className="fe-sidebar-section">
            <div className="fe-sidebar-title">Autres emplacements</div>
            <div className="fe-sidebar-item" onClick={() => setPath(['C:'])}>💻 Poste de travail</div>
            <div className="fe-sidebar-item" onClick={() => setPath(['C:', 'Mes documents'])}>📁 Mes documents</div>
            <div className="fe-sidebar-item" onClick={() => setPath(['C:', 'Program Files'])}>📁 Programmes</div>
          </div>
        </div>

        {/* File list */}
        <div className="fe-main">
          {entries.map(([name, node]) => (
            <div
              key={name}
              className={`fe-item ${selected === name ? 'fe-selected' : ''}`}
              onDoubleClick={() => navigate(name, node)}
              onClick={() => setSelected(name)}
            >
              <div className="fe-item-icon">
                {node.type === 'folder' ? '📁' : node.icon || '📄'}
              </div>
              <div className="fe-item-name">{name}</div>
              {node.type === 'file' && (
                <div className="fe-item-size">{node.size}</div>
              )}
            </div>
          ))}
          {entries.length === 0 && (
            <div className="fe-empty">Ce dossier est vide.</div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="fe-statusbar">
        {selected
          ? `1 objet(s) sélectionné(s)`
          : `${entries.length} objet(s)`
        }
        {selected && entries.find(([n]) => n === selected)?.[1].type === 'file' && (
          <span> · {entries.find(([n]) => n === selected)[1].size}</span>
        )}
      </div>
    </div>
  );
}
