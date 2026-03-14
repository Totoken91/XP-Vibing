/**
 * useDrag – Hook for draggable windows.
 * Attaches to the titlebar to move the window.
 */

import { useCallback, useRef } from 'react';

export function useDrag({ onMove, onFocus }) {
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e, currentPos) => {
    // Only drag on left click
    if (e.button !== 0) return;
    // Don't drag when clicking buttons in titlebar
    if (e.target.closest('.win-controls')) return;

    e.preventDefault();
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { x: currentPos.x, y: currentPos.y };

    onFocus?.();

    const onMove_ = (e2) => {
      if (!dragging.current) return;
      const dx = e2.clientX - startMouse.current.x;
      const dy = e2.clientY - startMouse.current.y;
      const newX = Math.max(0, startPos.current.x + dx);
      const newY = Math.max(0, startPos.current.y + dy);
      onMove({ x: newX, y: newY });
    };

    const onUp = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMove_);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove_);
    document.addEventListener('mouseup', onUp);
  }, [onMove, onFocus]);

  return { onMouseDown };
}
