/**
 * Snake – Classic retro snake game with XP styling.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Snake.css';

const COLS = 20;
const ROWS = 18;
const CELL = 18;
const INIT_SPEED = 130;

const DIR = { UP: [0,-1], DOWN: [0,1], LEFT: [-1,0], RIGHT: [1,0] };

function randFood(snake) {
  let pos;
  do {
    pos = [
      Math.floor(Math.random() * COLS),
      Math.floor(Math.random() * ROWS)
    ];
  } while (snake.some(s => s[0] === pos[0] && s[1] === pos[1]));
  return pos;
}

export default function Snake() {
  const initSnake = [[10, 9], [9, 9], [8, 9]];
  const [snake, setSnake] = useState(initSnake);
  const [food, setFood] = useState([15, 8]);
  const [dir, setDir] = useState(DIR.RIGHT);
  const [nextDir, setNextDir] = useState(DIR.RIGHT);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('xp-snake-hs') || '0'));
  const [status, setStatus] = useState('idle'); // idle | playing | paused | dead

  const canvasRef = useRef(null);
  const gameRef = useRef({ snake: initSnake, food: [15,8], dir: DIR.RIGHT, score: 0, status: 'idle' });
  const loopRef = useRef(null);
  const speedRef = useRef(INIT_SPEED);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { snake, food } = gameRef.current;

    // Background
    ctx.fillStyle = '#1a2c1a';
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // Grid
    ctx.strokeStyle = 'rgba(0,80,0,0.3)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke();
    }

    // Food
    const [fx, fy] = food;
    const cx = fx * CELL + CELL / 2;
    const cy = fy * CELL + CELL / 2;
    ctx.save();
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ff3333';
    ctx.beginPath();
    ctx.arc(cx, cy, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Snake
    snake.forEach(([sx, sy], i) => {
      const isHead = i === 0;
      const ratio = i / snake.length;
      const r = Math.floor(60 + ratio * 40);
      const g = Math.floor(200 - ratio * 80);
      const b = Math.floor(60 + ratio * 20);

      if (isHead) {
        ctx.fillStyle = '#80ff80';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.shadowBlur = 0;
      }

      const pad = isHead ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(sx * CELL + pad, sy * CELL + pad, CELL - pad * 2, CELL - pad * 2, isHead ? 4 : 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Head eyes
      if (isHead) {
        ctx.fillStyle = '#000';
        const d = gameRef.current.dir;
        const ex1 = sx * CELL + CELL / 2 + d[0] * 3 - d[1] * 2;
        const ey1 = sy * CELL + CELL / 2 + d[1] * 3 + d[0] * 2;
        const ex2 = sx * CELL + CELL / 2 + d[0] * 3 + d[1] * 2;
        const ey2 = sy * CELL + CELL / 2 + d[1] * 3 - d[0] * 2;
        ctx.beginPath(); ctx.arc(ex1, ey1, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex2, ey2, 1.5, 0, Math.PI * 2); ctx.fill();
      }
    });
  }, []);

  const tick = useCallback(() => {
    const g = gameRef.current;
    if (g.status !== 'playing') return;

    const newDir = g.nextDir || g.dir;
    g.dir = newDir;
    const head = g.snake[0];
    const newHead = [
      (head[0] + newDir[0] + COLS) % COLS,
      (head[1] + newDir[1] + ROWS) % ROWS,
    ];

    // Self collision
    if (g.snake.some(s => s[0] === newHead[0] && s[1] === newHead[1])) {
      g.status = 'dead';
      setStatus('dead');
      const hs = Math.max(g.score, parseInt(localStorage.getItem('xp-snake-hs') || '0'));
      localStorage.setItem('xp-snake-hs', hs);
      setHighScore(hs);
      draw();
      return;
    }

    let newSnake = [newHead, ...g.snake];
    let newFood = g.food;

    // Eat food
    if (newHead[0] === g.food[0] && newHead[1] === g.food[1]) {
      g.score += 10;
      setScore(g.score);
      newFood = randFood(newSnake);
      // Speed up slightly
      speedRef.current = Math.max(60, speedRef.current - 2);
      restartLoop();
    } else {
      newSnake = newSnake.slice(0, -1);
    }

    g.snake = newSnake;
    g.food = newFood;
    setSnake([...newSnake]);
    draw();
  }, [draw]);

  const restartLoop = useCallback(() => {
    clearInterval(loopRef.current);
    loopRef.current = setInterval(tick, speedRef.current);
  }, [tick]);

  const startGame = useCallback(() => {
    const initSn = [[10,9],[9,9],[8,9]];
    const initFood = randFood(initSn);
    gameRef.current = {
      snake: initSn,
      food: initFood,
      dir: DIR.RIGHT,
      nextDir: DIR.RIGHT,
      score: 0,
      status: 'playing',
    };
    speedRef.current = INIT_SPEED;
    setSnake(initSn);
    setFood(initFood);
    setDir(DIR.RIGHT);
    setScore(0);
    setStatus('playing');
    restartLoop();
    draw();
  }, [restartLoop, draw]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      const g = gameRef.current;
      const KEY_MAP = {
        ArrowUp: DIR.UP, ArrowDown: DIR.DOWN,
        ArrowLeft: DIR.LEFT, ArrowRight: DIR.RIGHT,
        w: DIR.UP, s: DIR.DOWN, a: DIR.LEFT, d: DIR.RIGHT,
      };
      if (e.key === ' ') {
        e.preventDefault();
        if (g.status === 'playing') {
          g.status = 'paused';
          setStatus('paused');
          clearInterval(loopRef.current);
        } else if (g.status === 'paused') {
          g.status = 'playing';
          setStatus('playing');
          restartLoop();
        }
        return;
      }
      if (g.status !== 'playing') return;
      const newDir = KEY_MAP[e.key];
      if (!newDir) return;
      e.preventDefault();
      const cur = g.dir;
      if (newDir[0] !== -cur[0] || newDir[1] !== -cur[1]) {
        g.nextDir = newDir;
        g.dir = newDir;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [restartLoop]);

  // Initial draw
  useEffect(() => { draw(); }, [draw]);

  // Cleanup
  useEffect(() => () => clearInterval(loopRef.current), []);

  return (
    <div className="snake-app">
      <div className="snake-header">
        <div className="snake-score-group">
          <div className="snake-score-label">Score</div>
          <div className="snake-score-value">{score}</div>
        </div>
        <div className="snake-status-center">
          {status === 'idle' && <span>Appuyez sur Jouer</span>}
          {status === 'playing' && <span>🐍 En jeu</span>}
          {status === 'paused' && <span>⏸ Pause</span>}
          {status === 'dead' && <span className="snake-dead">💀 Perdu!</span>}
        </div>
        <div className="snake-score-group" style={{ textAlign: 'right' }}>
          <div className="snake-score-label">Meilleur</div>
          <div className="snake-score-value">{highScore}</div>
        </div>
      </div>

      <div className="snake-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="snake-canvas"
        />
        {status === 'idle' && (
          <div className="snake-overlay">
            <div className="snake-overlay-title">🐍 Serpent XP</div>
            <div className="snake-overlay-hint">Flèches ou WASD pour diriger<br />Espace pour pause</div>
            <button className="snake-play-btn" onClick={startGame}>▶ Jouer</button>
          </div>
        )}
        {status === 'dead' && (
          <div className="snake-overlay">
            <div className="snake-overlay-title">💀 Partie terminée</div>
            <div className="snake-overlay-score">Score : {score}</div>
            <button className="snake-play-btn" onClick={startGame}>🔄 Rejouer</button>
          </div>
        )}
        {status === 'paused' && (
          <div className="snake-overlay snake-overlay-pause">
            <div className="snake-overlay-title">⏸ Pause</div>
            <button className="snake-play-btn" onClick={() => {
              gameRef.current.status = 'playing';
              setStatus('playing');
              restartLoop();
            }}>▶ Continuer</button>
          </div>
        )}
      </div>

      <div className="snake-controls-hint">
        ↑ ↓ ← → ou W A S D · Espace = Pause
      </div>
    </div>
  );
}
