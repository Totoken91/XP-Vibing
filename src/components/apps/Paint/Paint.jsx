/**
 * Paint – Windows XP Paint clone with canvas drawing tools.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Paint.css';

const TOOLS = [
  { id: 'select',      symbol: '⬚',  label: 'Sélection' },
  { id: 'pencil',      symbol: '✏',  label: 'Crayon' },
  { id: 'brush',       symbol: '🖌',  label: 'Pinceau' },
  { id: 'eraser',      symbol: '▭',  label: 'Gomme' },
  { id: 'fill',        symbol: '🪣',  label: 'Remplir' },
  { id: 'picker',      symbol: '⊕',  label: 'Pipette' },
  { id: 'line',        symbol: '╱',  label: 'Ligne' },
  { id: 'rect',        symbol: '□',  label: 'Rectangle' },
  { id: 'rectfill',    symbol: '■',  label: 'Rectangle plein' },
  { id: 'ellipse',     symbol: '○',  label: 'Ellipse' },
  { id: 'ellipsefill', symbol: '●',  label: 'Ellipse pleine' },
  { id: 'text',        symbol: 'A',  label: 'Texte' },
];

const PALETTE = [
  '#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080',
  '#c0c0c0','#ffffff','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff',
  '#ff8040','#804000','#80ff00','#004040','#0080ff','#8000ff','#ff0080','#804080',
  '#ff8080','#ffc080','#ffff80','#80ff80','#80ffff','#8080ff','#ff80ff','#404040',
];

const BRUSH_SIZES = [1, 2, 3, 5, 8, 12];
const CANVAS_W = 560;
const CANVAS_H = 380;

const TOOL_LABELS = {
  select: 'Sélection', pencil: 'Crayon', brush: 'Pinceau', eraser: 'Gomme',
  fill: 'Remplissage', picker: 'Pipette', line: 'Ligne', rect: 'Rectangle',
  rectfill: 'Rectangle plein', ellipse: 'Ellipse', ellipsefill: 'Ellipse pleine', text: 'Texte',
};

export default function Paint() {
  const canvasRef  = useRef(null);
  const overlayRef = useRef(null);

  const [tool, setTool]           = useState('pencil');
  const [fgColor, setFgColor]     = useState('#000000');
  const [bgColor, setBgColor]     = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(2);
  const [drawing, setDrawing]     = useState(false);
  const [startPos, setStartPos]   = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [undoStack, setUndoStack] = useState([]);

  // Init white canvas
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    setUndoStack([canvasRef.current.toDataURL()]);
  }, []);

  const getPos = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    };
  }, []);

  const saveUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-19), canvasRef.current.toDataURL()]);
  }, []);

  const undo = useCallback(() => {
    setUndoStack(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.drawImage(img, 0, 0);
      };
      img.src = next[next.length - 1];
      return next;
    });
  }, []);

  const floodFill = useCallback((ctx, x, y, fillHex) => {
    const imageData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
    const data = imageData.data;
    const idx = (y * CANVAS_W + x) * 4;
    const tR = data[idx], tG = data[idx+1], tB = data[idx+2];
    const fR = parseInt(fillHex.slice(1,3),16);
    const fG = parseInt(fillHex.slice(3,5),16);
    const fB = parseInt(fillHex.slice(5,7),16);
    if (tR===fR && tG===fG && tB===fB) return;
    const stack = [[x, y]];
    const matches = (i) => data[i]===tR && data[i+1]===tG && data[i+2]===tB && data[i+3]===255;
    while (stack.length) {
      const [cx, cy] = stack.pop();
      if (cx<0||cy<0||cx>=CANVAS_W||cy>=CANVAS_H) continue;
      const i = (cy*CANVAS_W+cx)*4;
      if (!matches(i)) continue;
      data[i]=fR; data[i+1]=fG; data[i+2]=fB; data[i+3]=255;
      stack.push([cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]);
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const applyShape = useCallback((ctx, t, x0, y0, x1, y1, color, sz) => {
    ctx.strokeStyle = color;
    ctx.fillStyle   = color;
    ctx.lineWidth   = sz;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    if (t === 'line') {
      ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
    } else if (t === 'rect') {
      ctx.strokeRect(x0, y0, x1-x0, y1-y0);
    } else if (t === 'rectfill') {
      ctx.fillRect(x0, y0, x1-x0, y1-y0);
    } else if (t === 'ellipse') {
      ctx.beginPath();
      ctx.ellipse((x0+x1)/2,(y0+y1)/2,Math.abs(x1-x0)/2,Math.abs(y1-y0)/2,0,0,Math.PI*2);
      ctx.stroke();
    } else if (t === 'ellipsefill') {
      ctx.beginPath();
      ctx.ellipse((x0+x1)/2,(y0+y1)/2,Math.abs(x1-x0)/2,Math.abs(y1-y0)/2,0,0,Math.PI*2);
      ctx.fill();
    }
  }, []);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    const pos = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    const color = e.button === 2 ? bgColor : fgColor;

    if (tool === 'fill') {
      saveUndo(); floodFill(ctx, pos.x, pos.y, color); return;
    }
    if (tool === 'picker') {
      const d = ctx.getImageData(pos.x, pos.y, 1, 1).data;
      const hex = '#' + [d[0],d[1],d[2]].map(v=>v.toString(16).padStart(2,'0')).join('');
      if (e.button === 2) setBgColor(hex); else setFgColor(hex);
      return;
    }

    saveUndo();
    setDrawing(true);
    setStartPos(pos);

    if (['pencil','brush','eraser'].includes(tool)) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'eraser' ? bgColor : color;
      ctx.lineWidth   = tool === 'brush' ? brushSize*3 : tool==='eraser' ? brushSize*5 : brushSize;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
    }
  }, [tool, fgColor, bgColor, brushSize, getPos, saveUndo, floodFill]);

  const onMouseMove = useCallback((e) => {
    const pos = getPos(e);
    setCursorPos(pos);
    if (!drawing) return;

    const ctx  = canvasRef.current.getContext('2d');
    const octx = overlayRef.current.getContext('2d');

    if (['pencil','brush','eraser'].includes(tool)) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (['line','rect','rectfill','ellipse','ellipsefill'].includes(tool)) {
      octx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      applyShape(octx, tool, startPos.x, startPos.y, pos.x, pos.y, fgColor, brushSize);
    }
  }, [drawing, tool, startPos, fgColor, brushSize, getPos, applyShape]);

  const onMouseUp = useCallback((e) => {
    if (!drawing) return;
    const pos = getPos(e);
    const ctx  = canvasRef.current.getContext('2d');
    const octx = overlayRef.current.getContext('2d');
    const color = e.button === 2 ? bgColor : fgColor;

    if (['line','rect','rectfill','ellipse','ellipsefill'].includes(tool)) {
      octx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      applyShape(ctx, tool, startPos.x, startPos.y, pos.x, pos.y, color, brushSize);
    }
    setDrawing(false);
  }, [drawing, tool, startPos, fgColor, bgColor, brushSize, getPos, applyShape]);

  const clearCanvas = useCallback(() => {
    saveUndo();
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }, [saveUndo, bgColor]);

  const saveImage = useCallback(() => {
    const a = document.createElement('a');
    a.download = 'peinture-xp.png';
    a.href = canvasRef.current.toDataURL();
    a.click();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo]);

  return (
    <div className="paint">

      {/* Menu bar */}
      <div className="paint-menubar">
        {['Fichier', 'Édition', 'Affichage', 'Image', 'Couleurs', '?'].map(m => (
          <button key={m} className="paint-menu-btn">{m}</button>
        ))}
      </div>

      <div className="paint-body">

        {/* Left toolbar */}
        <div className="paint-toolbar">
          <div className="paint-tools-grid">
            {TOOLS.map(t => (
              <button
                key={t.id}
                className={`paint-tool-btn${tool === t.id ? ' active' : ''}`}
                onClick={() => setTool(t.id)}
                title={t.label}
              >
                {t.symbol}
              </button>
            ))}
          </div>

          <div className="paint-toolbar-divider" />

          {/* Brush size picker */}
          <div className="paint-sizes">
            {BRUSH_SIZES.map(s => (
              <button
                key={s}
                className={`paint-size-btn${brushSize === s ? ' active' : ''}`}
                onClick={() => setBrushSize(s)}
                title={`Taille ${s}`}
              >
                <span className="paint-size-dot" style={{ width: Math.min(s*2,14), height: Math.min(s*2,14) }} />
              </button>
            ))}
          </div>

          <div className="paint-toolbar-divider" />

          {/* Active color preview */}
          <div className="paint-active-colors">
            <div
              className="paint-color-bg"
              style={{ background: bgColor }}
              title={`Couleur d'arrière-plan : ${bgColor}`}
              onClick={() => {}}
            />
            <div
              className="paint-color-fg"
              style={{ background: fgColor }}
              title={`Couleur de premier plan : ${fgColor}`}
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Canvas area */}
        <div className="paint-canvas-area">
          <div className="paint-canvas-scroll">
            <div className="paint-canvas-wrapper">
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="paint-canvas"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={() => setDrawing(false)}
                onContextMenu={e => e.preventDefault()}
                style={{ cursor: tool === 'eraser' ? 'cell' : tool === 'fill' ? 'crosshair' : tool === 'picker' ? 'crosshair' : tool === 'text' ? 'text' : 'crosshair' }}
              />
              <canvas
                ref={overlayRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="paint-canvas paint-overlay"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="paint-bottom">
        <div className="paint-palette-row">

          {/* Palette */}
          <div className="paint-palette">
            {PALETTE.map(c => (
              <div
                key={c}
                className="paint-swatch"
                style={{ background: c }}
                onClick={() => setFgColor(c)}
                onContextMenu={e => { e.preventDefault(); setBgColor(c); }}
                title={c}
              />
            ))}
          </div>

          {/* Quick actions */}
          <div className="paint-quick-actions">
            <button className="paint-action-btn" onClick={undo} title="Annuler (Ctrl+Z)">↩</button>
            <button className="paint-action-btn" onClick={clearCanvas} title="Effacer">🗑</button>
            <button className="paint-action-btn" onClick={saveImage} title="Enregistrer PNG">💾</button>
          </div>
        </div>

        {/* Status bar */}
        <div className="paint-statusbar">
          <span className="paint-status-item">{TOOL_LABELS[tool]}</span>
          <div className="paint-status-sep" />
          <span className="paint-status-item">{cursorPos.x}, {cursorPos.y} px</span>
          <div className="paint-status-sep" />
          <span className="paint-status-item">{CANVAS_W} × {CANVAS_H}</span>
        </div>
      </div>
    </div>
  );
}
