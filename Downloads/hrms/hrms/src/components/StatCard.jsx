
import { useEffect, useState } from 'react';


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