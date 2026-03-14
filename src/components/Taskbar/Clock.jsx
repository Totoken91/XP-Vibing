/**
 * Clock – Live clock in system tray.
 */

import React, { useState, useEffect } from 'react';

function pad(n) { return String(n).padStart(2, '0'); }

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const dateStr = time.toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div className="clock" title={`${dateStr} ${h}:${m}`}>
      <div className="clock-time">{h}:{m}</div>
      <div className="clock-date">{dateStr}</div>
    </div>
  );
}
