/**
 * Minesweeper – Classic Démineur with XP styling.
 * Left-click to reveal, right-click to flag.
 */

import React, { useState, useCallback, useEffect } from 'react';
import './Minesweeper.css';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

function createBoard() {
  const board = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({
      r, c,
      mine: false,
      revealed: false,
      flagged: false,
      count: 0,
    }))
  );
  return board;
}

function placeMines(board, firstR, firstC) {
  const flat = board.flat();
  const safe = flat.filter(c => Math.abs(c.r - firstR) > 1 || Math.abs(c.c - firstC) > 1);
  const shuffled = [...safe].sort(() => Math.random() - 0.5);
  const mineSet = new Set(shuffled.slice(0, MINES).map(c => `${c.r}-${c.c}`));

  const newBoard = board.map(row =>
    row.map(cell => ({
      ...cell,
      mine: mineSet.has(`${cell.r}-${cell.c}`),
    }))
  );

  // Count neighbors
  return newBoard.map(row =>
    row.map(cell => ({
      ...cell,
      count: cell.mine ? 0 : getNeighbors(newBoard, cell.r, cell.c).filter(n => n.mine).length,
    }))
  );
}

function getNeighbors(board, r, c) {
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        neighbors.push(board[nr][nc]);
      }
    }
  }
  return neighbors;
}

function revealFlood(board, r, c) {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const queue = [[r, c]];
  while (queue.length) {
    const [cr, cc] = queue.pop();
    const cell = newBoard[cr][cc];
    if (cell.revealed || cell.flagged || cell.mine) continue;
    cell.revealed = true;
    if (cell.count === 0) {
      getNeighbors(newBoard, cr, cc).forEach(n => {
        if (!n.revealed && !n.flagged) queue.push([n.r, n.c]);
      });
    }
  }
  return newBoard;
}

const COUNT_COLORS = ['', '#0000ff', '#007b00', '#ff0000', '#00007b', '#7b0000', '#007b7b', '#000', '#7b7b7b'];

export default function Minesweeper() {
  const [board, setBoard] = useState(createBoard);
  const [status, setStatus] = useState('idle'); // idle | playing | won | dead
  const [flags, setFlags] = useState(0);
  const [time, setTime] = useState(0);
  const [smiley, setSmiley] = useState('😊');
  const [firstClick, setFirstClick] = useState(true);

  // Timer
  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => setTime(t => Math.min(t + 1, 999)), 1000);
    return () => clearInterval(id);
  }, [status]);

  const resetGame = useCallback(() => {
    setBoard(createBoard());
    setStatus('idle');
    setFlags(0);
    setTime(0);
    setSmiley('😊');
    setFirstClick(true);
  }, []);

  const handleReveal = useCallback((r, c) => {
    setBoard(prev => {
      let b = prev;
      if (firstClick) {
        b = placeMines(b, r, c);
        setFirstClick(false);
        setStatus('playing');
      }
      const cell = b[r][c];
      if (cell.revealed || cell.flagged || status === 'dead' || status === 'won') return prev;

      if (cell.mine) {
        // Reveal all mines
        const dead = b.map(row =>
          row.map(c2 => c2.mine ? { ...c2, revealed: true } : c2)
        );
        dead[r][c] = { ...dead[r][c], exploded: true };
        setSmiley('😵');
        setStatus('dead');
        return dead;
      }

      const newB = revealFlood(b, r, c);

      // Check win
      const unrevealed = newB.flat().filter(c2 => !c2.revealed && !c2.mine).length;
      if (unrevealed === 0) {
        setSmiley('😎');
        setStatus('won');
      }

      return newB;
    });
  }, [firstClick, status]);

  const handleFlag = useCallback((e, r, c) => {
    e.preventDefault();
    setBoard(prev => {
      const cell = prev[r][c];
      if (cell.revealed) return prev;
      const newBoard = prev.map(row => row.map(c2 =>
        c2.r === r && c2.c === c ? { ...c2, flagged: !c2.flagged } : c2
      ));
      setFlags(newBoard.flat().filter(c2 => c2.flagged).length);
      return newBoard;
    });
  }, []);

  const flagsLeft = MINES - flags;
  const timeStr = String(time).padStart(3, '0');
  const flagsStr = String(Math.max(0, flagsLeft)).padStart(3, '0');

  return (
    <div className="minesweeper">
      {/* Header */}
      <div className="ms-header">
        <div className="ms-counter ms-counter-flags">
          {flagsStr.split('').map((d, i) => <span key={i} className="ms-digit">{d}</span>)}
        </div>
        <button className="ms-smiley-btn" onClick={resetGame} title="Nouvelle partie">
          {status === 'dead' ? '😵' : status === 'won' ? '😎' : smiley}
        </button>
        <div className="ms-counter ms-counter-time">
          {timeStr.split('').map((d, i) => <span key={i} className="ms-digit">{d}</span>)}
        </div>
      </div>

      {/* Board */}
      <div className="ms-board" onContextMenu={e => e.preventDefault()}>
        {board.map(row =>
          row.map(cell => (
            <MsCell
              key={`${cell.r}-${cell.c}`}
              cell={cell}
              onReveal={() => handleReveal(cell.r, cell.c)}
              onFlag={(e) => handleFlag(e, cell.r, cell.c)}
            />
          ))
        )}
      </div>

      {/* Status bar */}
      <div className="ms-statusbar">
        {status === 'idle' && 'Cliquez pour commencer'}
        {status === 'playing' && `${flagsLeft} mines restantes`}
        {status === 'won' && '🎉 Félicitations ! Vous avez gagné !'}
        {status === 'dead' && '💥 BOOM ! Cliquez sur 😊 pour rejouer'}
      </div>
    </div>
  );
}

function MsCell({ cell, onReveal, onFlag }) {
  const { revealed, flagged, mine, count, exploded } = cell;

  let content = null;
  let className = 'ms-cell';

  if (flagged && !revealed) {
    content = '🚩';
    className += ' ms-cell-flagged';
  } else if (!revealed) {
    className += ' ms-cell-hidden';
  } else if (mine) {
    content = exploded ? '💥' : '💣';
    className += exploded ? ' ms-cell-exploded' : ' ms-cell-mine';
  } else {
    className += ' ms-cell-revealed';
    if (count > 0) {
      content = count;
    }
  }

  return (
    <button
      className={className}
      onClick={onReveal}
      onContextMenu={onFlag}
      style={revealed && count > 0 ? { color: COUNT_COLORS[count] } : {}}
      aria-label={flagged ? 'Drapeau' : revealed ? (mine ? 'Mine' : `${count}`) : 'Caché'}
    >
      {content}
    </button>
  );
}
