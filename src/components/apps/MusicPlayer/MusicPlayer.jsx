/**
 * MusicPlayer – Winamp/WMP-inspired retro audio player.
 * Features: file upload, playlist, play/pause/skip, seek, volume, canvas visualizer.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './MusicPlayer.css';

export default function MusicPlayer() {
  const [playlist, setPlaylist] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentTrack = playlist[currentIdx] || null;

  // Setup Web Audio analyser for visualizer
  const setupAnalyser = useCallback((audio) => {
    if (analyserRef.current) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    analyserRef.current = analyser;
    const source = ctx.createMediaElementSource(audio);
    sourceRef.current = source;
    source.connect(analyser);
    analyser.connect(ctx.destination);
  }, []);

  // Visualizer draw loop
  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#000a1a';
    ctx.fillRect(0, 0, w, h);

    const barW = (w / bufferLength) * 1.8;
    const gap = 2;
    let x = 4;

    for (let i = 0; i < bufferLength; i++) {
      const barH = (dataArray[i] / 255) * (h - 8);
      const hue = 180 + (dataArray[i] / 255) * 80;
      const sat = 80 + (dataArray[i] / 255) * 20;
      const lum = 35 + (dataArray[i] / 255) * 30;

      // Bar
      const gradient = ctx.createLinearGradient(0, h, 0, h - barH);
      gradient.addColorStop(0, `hsl(${hue}, ${sat}%, ${lum - 10}%)`);
      gradient.addColorStop(0.5, `hsl(${hue}, ${sat}%, ${lum + 20}%)`);
      gradient.addColorStop(1, `hsl(${hue - 20}, 100%, 75%)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, h - barH - 4, barW - gap, barH);

      // Glow effect on taller bars
      if (barH > h * 0.6) {
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.shadowBlur = 8;
        ctx.fillRect(x, h - barH - 4, barW - gap, 2);
        ctx.shadowBlur = 0;
      }

      x += barW;
    }

    // Green scanlines overlay
    for (let y = 0; y < h; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, y, w, 1);
    }

    animRef.current = requestAnimationFrame(drawVisualizer);
  }, []);

  // Idle visualizer (static waveform)
  const drawIdle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = '#000a1a';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#00ffaa44';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * 0.08 + Date.now() * 0.002) * 6;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    for (let y = 0; y < h; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, y, w, 1);
    }

    animRef.current = requestAnimationFrame(drawIdle);
  }, []);

  useEffect(() => {
    if (isPlaying && analyserRef.current) {
      cancelAnimationFrame(animRef.current);
      drawVisualizer();
    } else {
      cancelAnimationFrame(animRef.current);
      drawIdle();
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, drawVisualizer, drawIdle]);

  // Load track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.url;
    audio.volume = volume;
    setCurrentTime(0);
    setDuration(0);
    if (isPlaying) {
      audio.play().catch(() => {});
    }
  }, [currentIdx, currentTrack]);

  // File upload handler
  const handleFiles = useCallback((files) => {
    const audioFiles = Array.from(files).filter(f => f.type.startsWith('audio/'));
    const newTracks = audioFiles.map(f => ({
      name: f.name.replace(/\.[^.]+$/, ''),
      file: f,
      url: URL.createObjectURL(f),
    }));
    setPlaylist(prev => [...prev, ...newTracks]);
  }, []);

  const handleFileInput = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    handleFiles(e.dataTransfer.files);
  };

  // Controls
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (!audioCtxRef.current) setupAnalyser(audio);
    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    setCurrentIdx(i => Math.max(0, i - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentIdx(i => Math.min(playlist.length - 1, i + 1));
    setIsPlaying(true);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const pct = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
    audio.currentTime = pct * audio.duration;
  };

  const handleVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`music-player ${isDraggingOver ? 'drag-over' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
    >
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onDurationChange={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={handleNext}
      />

      {/* Visualizer */}
      <div className="mp-visualizer-wrap">
        <canvas ref={canvasRef} className="mp-canvas" width={380} height={80} />
        <div className="mp-vis-overlay">
          {!currentTrack && (
            <div className="mp-vis-hint">
              Déposez des fichiers audio ici<br/>
              <span>ou cliquez sur "Ouvrir"</span>
            </div>
          )}
        </div>
      </div>

      {/* Track info */}
      <div className="mp-trackinfo">
        <div className="mp-track-name">
          {currentTrack ? currentTrack.name : '— Aucun morceau —'}
        </div>
        <div className="mp-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mp-progress-track" onClick={handleSeek}>
        <div className="mp-progress-fill" style={{ width: `${progressPct}%` }}>
          <div className="mp-progress-thumb" />
        </div>
      </div>

      {/* Controls */}
      <div className="mp-controls">
        <button className="mp-btn" onClick={handlePrev} title="Précédent" disabled={!currentTrack}>⏮</button>
        <button className="mp-btn mp-btn-play" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Lecture'} disabled={!currentTrack}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button className="mp-btn" onClick={handleNext} title="Suivant" disabled={!currentTrack}>⏭</button>
        <button className="mp-btn" onClick={() => { if(audioRef.current) { audioRef.current.currentTime = 0; } }} title="Retour au début">⏹</button>
      </div>

      {/* Volume */}
      <div className="mp-volume-row">
        <span className="mp-vol-icon">{volume === 0 ? '🔇' : volume < 0.4 ? '🔈' : '🔊'}</span>
        <input
          type="range"
          className="mp-volume-slider"
          min={0} max={1} step={0.01}
          value={volume}
          onChange={handleVolume}
        />
        <span className="mp-vol-pct">{Math.round(volume * 100)}%</span>
      </div>

      {/* Playlist */}
      <div className="mp-playlist-header">
        <span>Playlist ({playlist.length})</span>
        <button className="mp-open-btn" onClick={() => fileInputRef.current?.click()}>
          + Ouvrir
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
      </div>
      <div className="mp-playlist">
        {playlist.length === 0 ? (
          <div className="mp-playlist-empty">
            Glissez-déposez vos fichiers MP3 ici
          </div>
        ) : (
          playlist.map((track, i) => (
            <div
              key={i}
              className={`mp-playlist-item ${i === currentIdx ? 'active' : ''}`}
              onClick={() => { setCurrentIdx(i); setIsPlaying(true); }}
            >
              <span className="mp-track-num">{i + 1}.</span>
              {i === currentIdx && isPlaying
                ? <span className="mp-playing-indicator">♪</span>
                : null
              }
              <span className="mp-track-name-list">{track.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
