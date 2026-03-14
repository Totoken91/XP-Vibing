/**
 * FakeBrowser – Fake Internet Explorer 6 with nostalgic "websites".
 */

import React, { useState } from 'react';
import './FakeBrowser.css';

const SITES = {
  'msn.fr': {
    title: 'MSN France - Le meilleur du web',
    content: (
      <div className="fb-site fb-msn">
        <div className="fb-site-header" style={{ background: 'linear-gradient(90deg, #005a9c, #0078d7)' }}>
          <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', padding: '8px 16px', display: 'block' }}>
            msn.
          </span>
        </div>
        <div className="fb-msn-body">
          <div className="fb-msn-news">
            <h3>📰 Actualités du jour</h3>
            <ul>
              <li><a href="#">Windows XP est le meilleur OS jamais créé</a></li>
              <li><a href="#">Kazaa bat tous les records de téléchargement</a></li>
              <li><a href="#">Le Minitel bientôt remplacé par Internet ?</a></li>
              <li><a href="#">MSN Messenger : 100 millions d'utilisateurs</a></li>
            </ul>
          </div>
          <div className="fb-msn-hotmail">
            <h4>🔑 Hotmail</h4>
            <input className="fb-input" placeholder="Identifiant" />
            <input className="fb-input" type="password" placeholder="Mot de passe" />
            <button className="fb-btn">Se connecter</button>
          </div>
        </div>
      </div>
    )
  },
  'google.com': {
    title: 'Google',
    content: (
      <div className="fb-site fb-google">
        <div className="fb-google-logo">
          <span style={{ color: '#4285f4' }}>G</span>
          <span style={{ color: '#ea4335' }}>o</span>
          <span style={{ color: '#fbbc05' }}>o</span>
          <span style={{ color: '#4285f4' }}>g</span>
          <span style={{ color: '#34a853' }}>l</span>
          <span style={{ color: '#ea4335' }}>e</span>
        </div>
        <div className="fb-google-search">
          <input className="fb-search-input" placeholder="Rechercher..." />
          <button className="fb-btn">Recherche Google</button>
          <button className="fb-btn">J'ai de la chance</button>
        </div>
        <div style={{ fontSize: '10px', color: '#666', marginTop: '20px' }}>
          Google version 2001 · Web · Images · Groupes · Répertoire · Actualités
        </div>
      </div>
    )
  },
  'geocities.com/xpvibing': {
    title: 'BIENVENUE SUR MA PAGE !!!',
    content: (
      <div className="fb-site fb-geocities">
        <div className="fb-geo-header">
          <span className="fb-geo-title">★ BIENVENUE SUR MA PAGE PERSO ★</span>
          <div className="fb-geo-visitor">Vous êtes le visiteur n°: <strong>000042</strong></div>
        </div>
        <div className="fb-geo-body">
          <div className="fb-geo-marquee">
            <span>🎵 MUSIQUE EN COURS : Linkin Park - In The End 🎵 · · · xXx MA PAGE xXx · · ·</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '40%', verticalAlign: 'top', padding: '4px' }}>
                  <div className="fb-geo-section">
                    <h4>💬 À propos de moi</h4>
                    <p>Salut c moi ! J'ai 16 ans et j'adore la musique et les ordis !!!</p>
                    <p>MSN : xXx_cool_2k4@hotmail.com</p>
                    <img alt="under construction" style={{ width: '80px' }} />
                    <p>🚧 Page en construction 🚧</p>
                  </div>
                </td>
                <td style={{ verticalAlign: 'top', padding: '4px' }}>
                  <div className="fb-geo-section">
                    <h4>🎵 Mes groupes préférés</h4>
                    <ul>
                      <li>Linkin Park 🤘</li>
                      <li>Evanescence</li>
                      <li>Eminem</li>
                      <li>50 Cent</li>
                    </ul>
                    <h4>🎮 Jeux</h4>
                    <ul>
                      <li>Counter-Strike</li>
                      <li>GTA Vice City</li>
                      <li>The Sims</li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="fb-geo-guestbook">
            <h4>📖 Livre d'or</h4>
            <div className="fb-geo-msg">
              <strong>CooLkID2003</strong> dit : trop bien ta page lol mdr xD
            </div>
            <div className="fb-geo-msg">
              <strong>princesse_rose</strong> dit : coucou !!!! bizous ♥♥♥
            </div>
          </div>
        </div>
      </div>
    )
  },
  'xpvibing.local': {
    title: 'XP Vibing - Accueil',
    content: (
      <div className="fb-site fb-xpvibing">
        <div className="fb-xp-header">
          <span className="fb-xp-logo">⊞ XP Vibing</span>
          <nav className="fb-xp-nav">
            <span>Accueil</span>
            <span>À propos</span>
            <span>Contact</span>
          </nav>
        </div>
        <div className="fb-xp-hero">
          <h1>Bienvenue sur XP Vibing !</h1>
          <p>L'expérience qui se renouvelle — directement dans votre navigateur.</p>
          <p>🎵 Lecteur audio · 🐍 Jeux rétro · 📁 Explorateur · 📝 Bloc-notes</p>
        </div>
        <div className="fb-xp-features">
          <div className="fb-xp-card">🎵 Music Player<br/><small>Winamp-style</small></div>
          <div className="fb-xp-card">🐍 Snake XP<br/><small>Classique</small></div>
          <div className="fb-xp-card">💣 Démineur<br/><small>Full features</small></div>
        </div>
      </div>
    )
  }
};

const FAVORITES = [
  { label: 'XP Vibing', url: 'xpvibing.local' },
  { label: 'MSN France', url: 'msn.fr' },
  { label: 'Google', url: 'google.com' },
  { label: 'Geocities - Ma page', url: 'geocities.com/xpvibing' },
];

export default function FakeBrowser() {
  const [addressBar, setAddressBar] = useState('xpvibing.local');
  const [currentUrl, setCurrentUrl] = useState('xpvibing.local');
  const [history, setHistory] = useState(['xpvibing.local']);
  const [histIdx, setHistIdx] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);

  const site = SITES[currentUrl];

  const navigate = (url) => {
    const clean = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    setAddressBar(clean);
    setCurrentUrl(clean);
    const newHist = history.slice(0, histIdx + 1);
    setHistory([...newHist, clean]);
    setHistIdx(newHist.length);
    setShowFavorites(false);
  };

  const goBack = () => {
    if (histIdx > 0) {
      const newIdx = histIdx - 1;
      setHistIdx(newIdx);
      setCurrentUrl(history[newIdx]);
      setAddressBar(history[newIdx]);
    }
  };

  const goForward = () => {
    if (histIdx < history.length - 1) {
      const newIdx = histIdx + 1;
      setHistIdx(newIdx);
      setCurrentUrl(history[newIdx]);
      setAddressBar(history[newIdx]);
    }
  };

  return (
    <div className="fake-browser">
      {/* IE Toolbar */}
      <div className="fb-toolbar">
        <button className="fb-nav-btn" onClick={goBack} disabled={histIdx <= 0}>◄</button>
        <button className="fb-nav-btn" onClick={goForward} disabled={histIdx >= history.length - 1}>►</button>
        <button className="fb-nav-btn" title="Arrêter">■</button>
        <button className="fb-nav-btn" title="Actualiser">↻</button>
        <button className="fb-nav-btn" title="Accueil" onClick={() => navigate('xpvibing.local')}>🏠</button>
      </div>

      {/* Address bar */}
      <div className="fb-address-row">
        <span className="fb-addr-label">Adresse</span>
        <div className="fb-addr-input-wrap">
          <input
            className="fb-addr-input"
            value={addressBar}
            onChange={e => setAddressBar(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && navigate(addressBar)}
          />
          <div className="fb-addr-icon">🌐</div>
        </div>
        <button className="fb-go-btn" onClick={() => navigate(addressBar)}>▶</button>
        <div style={{ position: 'relative' }}>
          <button className="fb-nav-btn" onClick={() => setShowFavorites(f => !f)}>⭐ Favoris</button>
          {showFavorites && (
            <div className="fb-favorites-dropdown">
              {FAVORITES.map(f => (
                <div key={f.url} className="fb-fav-item" onClick={() => navigate(f.url)}>
                  🌐 {f.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Security bar */}
      <div className="fb-secbar">
        🔒 https://{currentUrl}/ · Zone : Internet · {site ? site.title : '—'}
      </div>

      {/* Content */}
      <div className="fb-content">
        {site
          ? site.content
          : (
            <div className="fb-404">
              <div className="fb-404-code">404</div>
              <h2>Cette page ne peut pas être affichée</h2>
              <p>L'adresse <strong>{currentUrl}</strong> est introuvable.</p>
              <p>Essayez : <span className="fb-link" onClick={() => navigate('xpvibing.local')}>xpvibing.local</span>, <span className="fb-link" onClick={() => navigate('msn.fr')}>msn.fr</span>, <span className="fb-link" onClick={() => navigate('google.com')}>google.com</span></p>
            </div>
          )
        }
      </div>

      {/* Status bar */}
      <div className="fb-statusbar">
        ✓ Terminé · 🔒 Internet · 100%
      </div>
    </div>
  );
}
