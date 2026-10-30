import React, { useState } from 'react';

const FAQ = ({ items }) => {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-white/10 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-sm">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 text-left px-5 md:px-7 py-5 font-mono text-white hover:text-forge-yellow transition-colors">
              <span className="font-bold">{it.q}</span>
              <span className={`text-forge-yellow text-xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <p className="overflow-hidden px-5 md:px-7 text-gray-400 font-sans leading-relaxed">
                <span className="block pb-5">{it.a}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQ;
