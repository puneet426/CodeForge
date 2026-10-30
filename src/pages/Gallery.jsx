import React, { useState } from 'react';
import Lightbox from '../components/Lightbox';
import { Reveal } from '../components/ui';
import { GALLERY, LINKS } from '../data/site';

const Gallery = () => {
  const [index, setIndex] = useState(null);
  return (
    <div className="min-h-screen bg-forge-dark bg-dot-pattern pt-28 pb-20 px-4 md:px-12 font-mono text-white">
      {index !== null && <Lightbox items={GALLERY} index={index} setIndex={setIndex} />}
      <div className="max-w-4xl mx-auto text-center mb-14">
        <div className="inline-block px-3 py-1 mb-4 border border-forge-yellow rounded-full bg-forge-yellow/10 text-forge-yellow text-xs md:text-sm font-bold tracking-widest">
          MOMENTS FROM THE FORGE
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white">&lt;Gallery/&gt;</h1>
        <p className="text-gray-400 mt-4 font-sans text-lg">
          Sessions, contests, teams and full houses. More on{" "}
          <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-forge-yellow hover:underline">@codeforgeniamt</a>.
        </p>
      </div>
      <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {GALLERY.map((g, i) => (
          <Reveal key={g.src} delay={(i % 3) * 60} className="mb-4 break-inside-avoid">
            <button onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 hover:border-forge-yellow/60 transition-colors">
              <img src={g.src} alt={g.caption} loading="lazy" className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 p-3 text-left text-xs md:text-sm bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                {g.caption}
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
