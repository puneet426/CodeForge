import React, { useEffect, useRef, useState } from 'react';

// Terminal-style section heading, matching the site's "@codeforgeniamt _section" look.
export const SectionHeading = ({ cmd, title, subtitle, align = "left" }) => (
  <div className={`mb-10 md:mb-14 ${align === "center" ? "text-center" : ""}`}>
    <p className="font-mono text-xs md:text-sm text-forge-yellow mb-3 tracking-wide">
      <span className="text-gray-500">@codeforge</span>niamt <span className="text-white/70">~$</span> {cmd}
      <span className="animate-pulse">_</span>
    </p>
    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{title}</h2>
    {subtitle && <p className={`mt-4 text-gray-400 max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>{subtitle}</p>}
  </div>
);

// Fades/slides children in when they scroll into view.
export const Reveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => typeof window === "undefined" || !("IntersectionObserver" in window));
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
      {children}
    </div>
  );
};

// Event poster with a branded fallback when there is no image (or it fails to load).
export const Poster = ({ src, title, className = "", imgClassName = "", contain = false }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-[#1a0f08] via-[#0f0f0f] to-[#22110a] bg-dot-pattern ${className}`}>
        <div className="text-center px-6">
          <p className="font-mono text-forge-yellow text-sm mb-2">&lt;Code/Forge&gt;</p>
          <p className="text-white font-black text-xl md:text-2xl leading-tight">{title}</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {contain && <img src={src} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110" />}
      <img src={src} alt={title} loading="lazy" onError={() => setFailed(true)}
        className={`relative w-full h-full ${contain ? "object-contain" : "object-cover"} ${imgClassName}`} />
    </div>
  );
};

export const CategoryPill = ({ children }) => (
  <span className="inline-block px-2.5 py-0.5 rounded-full border border-forge-yellow/40 bg-forge-yellow/10 text-forge-yellow text-[11px] font-mono uppercase tracking-wider">
    {children}
  </span>
);

// Generic modal shell: closes on Esc / backdrop click, locks page scroll.
export const Modal = ({ onClose, children, maxW = "max-w-4xl", label = "Dialog" }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={label}
      className="fixed inset-0 z-[60] flex items-start justify-center p-3 md:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}>
      <div className={`relative w-full ${maxW} my-8 md:my-14`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close"
          className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10 w-10 h-10 rounded-full bg-forge-yellow text-black font-black text-lg shadow-lg hover:scale-105 transition-transform">
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};
