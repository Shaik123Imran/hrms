
import { useEffect, useState } from 'react';

/**
 * Drop-in replacement for the inline stat-card markup already used across
 * the dashboard. Reuses the existing .stat-card / .stat-icon / .stat-label
 * / .stat-value classes from the global stylesheet, so it looks identical —
 * it just adds an animated count-up and a staggered entrance.
 */
export default function StatCard({ icon: Icon, iconTone = 'indigo', label, value, suffix = '', delayMs = 0 }) {
  const isNumeric = typeof value === 'number';
  const [display, setDisplay] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric) {
      setDisplay(value);
      return undefined;
    }
    let frame;
    const duration = 700;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(progress * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, isNumeric]);

  return (
    <div className="stat-card stat-card-animated" style={{ animationDelay: `${delayMs}ms` }}>
      <div className={`stat-icon ${iconTone}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">
          {display}
          {suffix}
        </div>
      </div>
    </div>
  );
}