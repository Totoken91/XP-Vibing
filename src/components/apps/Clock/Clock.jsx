/**
 * Clock – Analog + digital clock with calendar.
 */

import React, { useState, useEffect } from 'react';
import './Clock.css';

const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

export default function ClockApp() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  // Clock hands angles
  const secAngle = s * 6;
  const minAngle = m * 6 + s * 0.1;
  const hourAngle = (h % 12) * 30 + m * 0.5;

  // Calendar
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="clock-app">
      {/* Analog Clock */}
      <div className="clock-analog-wrap">
        <div className="clock-face">
          {/* Hour markers */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="clock-mark" style={{ transform: `rotate(${i * 30}deg)` }}>
              <div className="clock-mark-inner" />
            </div>
          ))}
          {/* Hands */}
          <div className="hand hand-hour" style={{ transform: `rotate(${hourAngle}deg)` }} />
          <div className="hand hand-minute" style={{ transform: `rotate(${minAngle}deg)` }} />
          <div className="hand hand-second" style={{ transform: `rotate(${secAngle}deg)` }} />
          <div className="clock-center" />
        </div>
      </div>

      {/* Digital time */}
      <div className="clock-digital">
        <span className="clock-digi-time">{pad(h)}:{pad(m)}:{pad(s)}</span>
        <span className="clock-digi-date">
          {DAYS[now.getDay()]} {today} {MONTHS[month]} {year}
        </span>
      </div>

      <div className="clock-sep" />

      {/* Calendar */}
      <div className="clock-calendar">
        <div className="cal-header">
          <span className="cal-title">{MONTHS[month]} {year}</span>
        </div>
        <div className="cal-grid">
          {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => (
            <div key={i} className={`cal-day ${i + 1 === today ? 'cal-today' : ''}`}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
