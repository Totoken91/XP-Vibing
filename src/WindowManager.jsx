/**
 * WindowManager – Renders all open windows using the app registry.
 * Maps appId → component and wraps each in a Window frame.
 */

import React from 'react';
import { useOS } from './context/OSContext';
import Window from './components/Window/Window';

// App components
import MusicPlayer from './components/apps/MusicPlayer/MusicPlayer';
import Notepad from './components/apps/Notepad/Notepad';
import FileExplorer from './components/apps/FileExplorer/FileExplorer';
import FakeBrowser from './components/apps/FakeBrowser/FakeBrowser';
import About from './components/apps/About/About';
import WallpaperGallery from './components/apps/WallpaperGallery/WallpaperGallery';
import Snake from './components/apps/games/Snake/Snake';
import Minesweeper from './components/apps/games/Minesweeper/Minesweeper';
import ClockApp from './components/apps/Clock/Clock';

const APP_COMPONENTS = {
  musicPlayer:     MusicPlayer,
  notepad:         Notepad,
  fileExplorer:    FileExplorer,
  fakeBrowser:     FakeBrowser,
  about:           About,
  wallpaperGallery: WallpaperGallery,
  snake:           Snake,
  minesweeper:     Minesweeper,
  clock:           ClockApp,
};

export default function WindowManager() {
  const { state } = useOS();
  const { windows } = state;

  return (
    <>
      {windows.map(win => {
        const AppComponent = APP_COMPONENTS[win.appId];
        if (!AppComponent) return null;

        return (
          <Window key={win.id} windowData={win}>
            <AppComponent {...win.props} />
          </Window>
        );
      })}
    </>
  );
}
