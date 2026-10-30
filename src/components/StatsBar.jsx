import React, { useEffect, useRef, useState } from 'react';

// Counts up from 0 when it first scrolls into view.
const Counter = ({ to, suffix, duration = 1400 }) => {
  const ref = useRef(null);
  const [instant] = useState(() => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window));
  const [val, setVal] = useState(instant ? to : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || instant) return;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration, instant]);
  return <span ref={ref} className="tabular-nums">{instant ? to : val}{suffix}</span>;
};

const StatsBar = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/10 bg-white/10">
    {stats.map((s) => (
      <div key={s.label} className="bg-forge-dark/95 p-6 md:p-8 text-center">
        <div className="text-4xl md:text-5xl font-black text-forge-yellow font-mono"><Counter to={s.count} suffix={s.suffix} /></div>
        <div className="mt-2 text-xs md:text-sm uppercase tracking-widest text-gray-400 font-mono">{s.label}</div>
      </div>
    ))}
  </div>
);

export default StatsBar;
