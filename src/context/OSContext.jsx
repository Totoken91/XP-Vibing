/**
 * OSContext – Central state manager for the XP Vibing web OS.
 * Manages windows, wallpaper, start menu, notifications.
 */

import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';

// ── App registry ──────────────────────────────────────────────
export const APP_REGISTRY = {
  musicPlayer:     { title: 'XP Vibing Music', icon: '🎵', width: 420, height: 500 },
  notepad:         { title: 'Bloc-notes', icon: '📝', width: 500, height: 400 },
  fileExplorer:    { title: 'Explorateur', icon: '📁', width: 560, height: 420 },
  fakeBrowser:     { title: 'Internet Explorador 6.0', icon: '🌐', width: 640, height: 480 },
  about:           { title: 'À propos de XP Vibing', icon: '💻', width: 400, height: 350 },
  wallpaperGallery:{ title: 'Arrière-plans', icon: '🖼️', width: 500, height: 380 },
  snake:           { title: 'Serpent XP', icon: '🐍', width: 420, height: 480 },
  minesweeper:     { title: 'Démineur', icon: '💣', width: 320, height: 380 },
  clock:           { title: 'Horloge & Calendrier', icon: '🕐', width: 300, height: 300 },
};

// ── Wallpapers ────────────────────────────────────────────────
export const WALLPAPERS = [
  { id: 'bliss',    label: 'Bliss XP',       type: 'gradient', value: 'bliss' },
  { id: 'y2k',      label: 'Y2K Dreams',     type: 'gradient', value: 'y2k' },
  { id: 'space',    label: 'Cosmos 2001',    type: 'gradient', value: 'space' },
  { id: 'matrix',   label: 'Code Rain',      type: 'gradient', value: 'matrix' },
  { id: 'sunset',   label: 'Coucher Rétro',  type: 'gradient', value: 'sunset' },
  { id: 'teal',     label: 'Teal Classic',   type: 'solid',    value: '#008080' },
];

export const WALLPAPER_STYLES = {
  bliss: `url('/bliss.jpeg')`,
  y2k: `
    radial-gradient(circle at 70% 30%, rgba(0,200,255,0.4) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(100,0,255,0.3) 0%, transparent 40%),
    linear-gradient(135deg, #0a0a2e 0%, #0d1b4b 30%, #0a2a5e 60%, #0d3a7a 100%)
  `,
  space: `
    radial-gradient(ellipse at 30% 50%, rgba(100,50,200,0.5) 0%, transparent 40%),
    radial-gradient(circle at 70% 20%, rgba(200,150,50,0.3) 0%, transparent 30%),
    linear-gradient(180deg, #000005 0%, #050015 40%, #0a0020 100%)
  `,
  matrix: `
    linear-gradient(180deg, #001400 0%, #002800 100%)
  `,
  sunset: `
    radial-gradient(ellipse at 50% 60%, rgba(255,140,0,0.5) 0%, transparent 60%),
    linear-gradient(180deg, #0a0020 0%, #2d0050 20%, #8b0057 45%, #ff4500 65%, #ff8c00 80%, #ffd700 100%)
  `,
};

// ── Initial State ─────────────────────────────────────────────
const INIT_STATE = {
  windows: [],
  topZ: 100,
  bootDone: false,
  startMenuOpen: false,
  wallpaper: localStorage.getItem('xp-wallpaper') || 'bliss',
  notifications: [],
  notifId: 0,
};

// ── Reducer ───────────────────────────────────────────────────
function osReducer(state, action) {
  switch (action.type) {

    case 'BOOT_DONE':
      return { ...state, bootDone: true };

    case 'OPEN_WINDOW': {
      // If already open, focus it
      const existing = state.windows.find(w => w.appId === action.appId);
      if (existing) {
        return {
          ...state,
          topZ: state.topZ + 1,
          windows: state.windows.map(w =>
            w.id === existing.id
              ? { ...w, minimized: false, zIndex: state.topZ + 1 }
              : w
          ),
          startMenuOpen: false,
        };
      }
      const meta = APP_REGISTRY[action.appId] || { title: action.appId, icon: '🪟', width: 400, height: 300 };
      const newWindow = {
        id: `${action.appId}-${Date.now()}`,
        appId: action.appId,
        title: meta.title,
        icon: meta.icon,
        position: {
          x: 80 + (state.windows.length % 6) * 30,
          y: 40 + (state.windows.length % 6) * 25,
        },
        size: { w: meta.width, h: meta.height },
        minimized: false,
        zIndex: state.topZ + 1,
        props: action.props || {},
      };
      return {
        ...state,
        topZ: state.topZ + 1,
        windows: [...state.windows, newWindow],
        startMenuOpen: false,
      };
    }

    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: state.windows.filter(w => w.id !== action.id),
      };

    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, minimized: true } : w
        ),
      };

    case 'RESTORE_WINDOW':
      return {
        ...state,
        topZ: state.topZ + 1,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, minimized: false, zIndex: state.topZ + 1 } : w
        ),
      };

    case 'FOCUS_WINDOW':
      return {
        ...state,
        topZ: state.topZ + 1,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, zIndex: state.topZ + 1 } : w
        ),
      };

    case 'MOVE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, position: action.position } : w
        ),
      };

    case 'RESIZE_WINDOW':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, size: action.size } : w
        ),
      };

    case 'TOGGLE_START_MENU':
      return { ...state, startMenuOpen: !state.startMenuOpen };

    case 'CLOSE_START_MENU':
      return { ...state, startMenuOpen: false };

    case 'SET_WALLPAPER': {
      localStorage.setItem('xp-wallpaper', action.wallpaper);
      return { ...state, wallpaper: action.wallpaper };
    }

    case 'ADD_NOTIFICATION': {
      const id = action.id ?? state.notifId + 1;
      return {
        ...state,
        notifId: id,
        notifications: [...state.notifications, { id, message: action.message, icon: action.icon || '💬' }],
      };
    }

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      };

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────
const OSContext = createContext(null);

export function OSProvider({ children }) {
  const [state, dispatch] = useReducer(osReducer, INIT_STATE);
  const audioCtxRef = useRef(null);

  // ── Audio Engine (Web Audio API) ──────────────────────────
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback((type) => {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      switch (type) {
        case 'open':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        case 'close':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(660, now);
          osc.frequency.exponentialRampToValueAtTime(330, now + 0.12);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.start(now);
          osc.stop(now + 0.18);
          break;
        case 'click':
          osc.type = 'square';
          osc.frequency.setValueAtTime(1200, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        case 'error':
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, now);
          osc.frequency.setValueAtTime(180, now + 0.1);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        case 'notify':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(1100, now + 0.1);
          gain.gain.setValueAtTime(0.07, now);
          gain.gain.setValueAtTime(0.07, now + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        case 'minimize':
          osc.type = 'sine';
          osc.frequency.setValueAtTime(550, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        case 'start':
          // Multi-note startup jingle
          [440, 550, 660, 880].forEach((freq, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = 'sine';
            o.frequency.setValueAtTime(freq, now + i * 0.12);
            g.gain.setValueAtTime(0.1, now + i * 0.12);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.2);
            o.start(now + i * 0.12);
            o.stop(now + i * 0.12 + 0.2);
          });
          return;
        default:
          break;
      }
    } catch {
      // Audio not available
    }
  }, [getAudioCtx]);

  // ── Action helpers ────────────────────────────────────────
  const openApp = useCallback((appId, props) => {
    dispatch({ type: 'OPEN_WINDOW', appId, props });
    playSound('open');
  }, [playSound]);

  const closeWindow = useCallback((id) => {
    dispatch({ type: 'CLOSE_WINDOW', id });
    playSound('close');
  }, [playSound]);

  const minimizeWindow = useCallback((id) => {
    dispatch({ type: 'MINIMIZE_WINDOW', id });
    playSound('minimize');
  }, [playSound]);

  const restoreWindow = useCallback((id) => {
    dispatch({ type: 'RESTORE_WINDOW', id });
    playSound('open');
  }, [playSound]);

  const focusWindow = useCallback((id) => {
    dispatch({ type: 'FOCUS_WINDOW', id });
  }, []);

  const moveWindow = useCallback((id, position) => {
    dispatch({ type: 'MOVE_WINDOW', id, position });
  }, []);

  const toggleStartMenu = useCallback(() => {
    dispatch({ type: 'TOGGLE_START_MENU' });
    playSound('click');
  }, [playSound]);

  const closeStartMenu = useCallback(() => {
    dispatch({ type: 'CLOSE_START_MENU' });
  }, []);

  const setWallpaper = useCallback((wallpaper) => {
    dispatch({ type: 'SET_WALLPAPER', wallpaper });
  }, []);

  const addNotification = useCallback((message, icon) => {
    const id = Date.now();
    dispatch({ type: 'ADD_NOTIFICATION', id, message, icon });
    playSound('notify');
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', id }), 5000);
  }, [playSound]);

  const removeNotification = useCallback((id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', id });
  }, []);

  const bootDone = useCallback(() => {
    dispatch({ type: 'BOOT_DONE' });
  }, []);

  return (
    <OSContext.Provider value={{
      state,
      openApp,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      focusWindow,
      moveWindow,
      toggleStartMenu,
      closeStartMenu,
      setWallpaper,
      addNotification,
      removeNotification,
      bootDone,
      playSound,
    }}>
      {children}
    </OSContext.Provider>
  );
}

export const useOS = () => {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS must be used inside OSProvider');
  return ctx;
};
