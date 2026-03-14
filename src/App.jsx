/**
 * App – Root component. Manages boot → desktop transition.
 * Renders: BootScreen (until boot done), then full Desktop OS.
 */

import React, { useEffect } from 'react';
import { OSProvider, useOS } from './context/OSContext';

import BootScreen from './components/BootScreen/BootScreen';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import StartMenu from './components/StartMenu/StartMenu';
import WindowManager from './WindowManager';
import Notifications from './components/Notifications/Notifications';

import './styles/global.css';
import './styles/animations.css';

function OS() {
  const { state, addNotification } = useOS();

  // Welcome notification after boot
  useEffect(() => {
    if (state.bootDone) {
      setTimeout(() => addNotification('Bienvenue sur XP Vibing ! Double-cliquez sur les icônes pour ouvrir les apps.', '⊞'), 1000);
    }
  }, [state.bootDone]);

  if (!state.bootDone) {
    return <BootScreen />;
  }

  return (
    <div id="os-desktop">
      <Desktop />
      <WindowManager />
      <StartMenu />
      <Taskbar />
      <Notifications />
    </div>
  );
}

export default function App() {
  return (
    <OSProvider>
      <OS />
    </OSProvider>
  );
}
