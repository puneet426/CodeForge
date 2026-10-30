import React, { useCallback, useEffect } from 'react';

// Full-screen image viewer with ← → / Esc keyboard support.
const Lightbox = ({ items, index, setIndex }) => {
  const close = useCallback(() => setIndex(null), [setIndex]);
  const go = useCallback((d) => setIndex((i) => (i + d + items.length) % items.length), [items.length, setIndex]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [close, go]);
  const it = items[index];
  return (
    <div className="fixed inset-0 z-[70] bg-black/95 flex flex-col items-center justify-center p-4" onClick={close} role="dialog" aria-modal="true">
      <img src={it.src} alt={it.caption} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
      <p className="mt-4 font-mono text-sm text-gray-300">{it.caption} <span className="text-gray-600">· {index + 1}/{items.length}</span></p>
      <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); go(-1); }}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-forge-yellow hover:text-black text-white text-xl">‹</button>
      <button aria-label="Next" onClick={(e) => { e.stopPropagation(); go(1); }}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-forge-yellow hover:text-black text-white text-xl">›</button>
      <button aria-label="Close" onClick={close} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-forge-yellow text-black font-black">✕</button>
    </div>
  );
};

export default Lightbox;
