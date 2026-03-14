/**
 * BootScreen – XP-style splash screen shown on load.
 * Fades out after the boot sequence completes.
 */

import React, { useEffect, useState } from 'react';
import { useOS } from '../../context/OSContext';
import './BootScreen.css';

const BOOT_DURATION = 3500; // ms total boot time

export default function BootScreen() {
  const { bootDone, playSound } = useOS();
  const [phase, setPhase] = useState('bios'); // bios → loading → welcome → done
  const [biosLines, setBiosLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  const BIOS_TEXT = [
    'XP Vibing BIOS v2.0  Copyright (C) 2001-2026',
    'CPU: VibePentium 4 @ 2.40 GHz',
    'RAM: 512 MB DDR ... OK',
    'Detecting IDE drives ...',
    '    Primary Master  : VIBEMAX 40GB Ultra-ATA',
    '    Primary Slave   : None',
    'Verifying DMI Pool Data ........',
    'Boot from C:',
  ];

  useEffect(() => {
    // Phase 1: BIOS-style lines
    let lineIdx = 0;
    const biosInterval = setInterval(() => {
      setBiosLines(prev => [...prev, BIOS_TEXT[lineIdx]]);
      lineIdx++;
      if (lineIdx >= BIOS_TEXT.length) {
        clearInterval(biosInterval);
        setTimeout(() => setPhase('loading'), 400);
      }
    }, 160);

    return () => clearInterval(biosInterval);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;
    // Animate progress bar
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setPhase('welcome'), 400);
      }
      setProgress(Math.min(100, p));
    }, 120);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'welcome') return;
    // Play boot jingle
    setTimeout(() => playSound('start'), 300);
    // Transition to desktop
    setTimeout(() => {
      setExiting(true);
      setTimeout(() => bootDone(), 600);
    }, 1800);
  }, [phase, bootDone, playSound]);

  return (
    <div className={`boot-screen ${exiting ? 'boot-exiting' : ''}`}>
      {phase === 'bios' && (
        <div className="boot-bios">
          {biosLines.map((line, i) => (
            <div key={i} className="bios-line">{line}</div>
          ))}
          <div className="bios-cursor">_</div>
        </div>
      )}

      {phase === 'loading' && (
        <div className="boot-loading">
          <div className="boot-logo-wrap">
            <div className="boot-logo">
              <span className="logo-xp">XP</span>
              <span className="logo-vibing">Vibing</span>
            </div>
            <div className="logo-tagline">L'expérience qui se renouvelle</div>
          </div>
          <div className="boot-bar-container">
            <div className="boot-bar-track">
              <div className="boot-bar-fill" style={{ width: `${progress}%` }}>
                <div className="boot-bar-shine" />
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === 'welcome' && (
        <div className="boot-welcome">
          <div className="welcome-user-icon">👤</div>
          <div className="welcome-text">Bienvenue</div>
          <div className="welcome-name">Utilisateur XP</div>
          <div className="welcome-loading">
            <div className="welcome-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
