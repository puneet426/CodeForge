import React, { useEffect, useState } from 'react';

const pad = (n) => String(n).padStart(2, "0");

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    done: ms === 0,
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms / 3600000) % 24),
    m: Math.floor((ms / 60000) % 60),
    s: Math.floor((ms / 1000) % 60),
  };
}

// Live countdown. `compact` renders a one-line pill version.
const Countdown = ({ target, compact = false }) => {
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t.done) {
    return <span className="font-mono text-forge-yellow font-bold">{compact ? "Happening now" : "It's happening — see you there!"}</span>;
  }
  if (compact) {
    return (
      <span className="font-mono tabular-nums">
        {t.d}d {pad(t.h)}h {pad(t.m)}m {pad(t.s)}s
      </span>
    );
  }
  const cells = [["Days", t.d], ["Hours", t.h], ["Minutes", t.m], ["Seconds", t.s]];
  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3" aria-live="off">
      {cells.map(([label, v]) => (
        <div key={label} className="rounded-lg border border-forge-yellow/30 bg-black/50 py-3 text-center">
          <div className="text-2xl md:text-4xl font-black text-white tabular-nums font-mono">{pad(v)}</div>
          <div className="text-[10px] md:text-xs uppercase tracking-widest text-gray-400 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
