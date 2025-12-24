import React, { useState, useEffect } from 'react';
import About from '../pages/About';
import Communities from '../pages/Communities';
import EventsSection from '../pages/EventsSection';
import ContactSection from '../pages/ContactSection';

const phrases = ["/career with", "/skills with", "/potential with"];

const Typewriter = ({ phrases }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (index >= phrases.length) {
      setIndex(0);
      return;
    }

    const currentPhrase = phrases[index];

    if (subIndex === currentPhrase.length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000); 
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prevSubIndex) => prevSubIndex + (reverse ? -1 : 1));
    }, reverse ? 100 : 150);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases]);

  return (
    // RESPONSIVE FIX: Reduced min-width to 200px for mobile, 300px for desktop
    // Added break-words to prevent overflow if text gets too long
    <span className="text-forge-yellow inline-block min-w-[200px] md:min-w-[300px] text-left break-words">
      {phrases[index].substring(0, subIndex)}
    </span>
  );
};

const HeroSection = () => {
  return (
    // RESPONSIVE FIX: Changed pt-32 to pt-24 for mobile to save vertical space
    <div className="relative bg-forge-dark bg-dot-pattern pt-24 md:pt-32 pb-12 overflow-x-hidden">
      
      {/* ================= HERO PART ================= */}
      {/* min-h-[90vh] ensures this takes up the full first view */}
      <div className="min-h-[85vh] md:min-h-[90vh] flex flex-col items-center justify-between px-4">
        
        {/* 1. Main Text Content */}
        <main className="flex-grow flex flex-col items-center justify-center text-center z-10">
          {/* RESPONSIVE FIX: Scaled text from 4xl (mobile) to 8xl (desktop) */}
          <h1 className="text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-white leading-tight">
            Develop your <br />
            <Typewriter phrases={phrases} />
          </h1>
        </main>

        {/* 2. Big Background Logo Text */}
        <div className="select-none mb-8 w-full text-center">
            {/* RESPONSIVE FIX: 
                - text-4xl on mobile (prevents horizontal scroll)
                - md:text-8xl on tablet
                - lg:text-[10rem] on desktop 
                - break-all allows it to wrap if screen is extremely tiny
            */}
           <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black font-mono text-white tracking-tighter opacity-100 break-all md:break-normal">
              &lt;Code/Forge&gt;
           </h1>
        </div>

        {/* 3. NEW: Animated Scroll Down Indicator */}
        <div className="mb-12 animate-bounce">
          <svg className="w-8 h-8 text-forge-yellow" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      {/* ================= TRANSITION DIVIDER ================= */}
      {/* This separates the sections with a "Command Line" look */}
      <div className="w-full max-w-7xl mx-auto my-16">
        <div className="border-t border-gray-800 relative flex items-center justify-center">
            {/* The Badge in the center of the line */}
            <div className="absolute bg-forge-dark px-4 font-mono text-sm text-forge-yellow border border-gray-800 py-1 rounded shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                <span className="text-gray-500">@codeforge</span>niamt  <span className="animate-pulse">_about</span>
            </div>
        </div>
      </div>

      {/* ================= ABOUT SECTION ================= */}
      <div id="about">
        <About />
      </div>
      {/* ================= TRANSITION DIVIDER ================= */}
      {/* This separates the sections with a "Command Line" look */}
      <div className="w-full max-w-7xl mx-auto my-16">
        <div className="border-t border-gray-800 relative flex items-center justify-center">
            {/* The Badge in the center of the line */}
            <div className="absolute bg-forge-dark px-4 font-mono text-sm text-forge-yellow border border-gray-800 py-1 rounded shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                <span className="text-gray-500">@codeforge</span>niamt  <span className="animate-pulse">_communities</span>
            </div>
        </div>
      </div>

      {/* ================= communities SECTION ================= */}
      <div id="communities">
        <Communities />
      </div>
      {/* ================= TRANSITION DIVIDER ================= */}
      {/* This separates the sections with a "Command Line" look */}
      <div className="w-full max-w-7xl mx-auto my-16">
        <div className="border-t border-gray-800 relative flex items-center justify-center">
            {/* The Badge in the center of the line */}
            <div className="absolute bg-forge-dark px-4 font-mono text-sm text-forge-yellow border border-gray-800 py-1 rounded shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                <span className="text-gray-500">@codeforge</span>niamt  <span className="animate-pulse">_events</span>
            </div>
        </div>
      </div>

      {/* ================= communities SECTION ================= */}
      <div id="events">
        <EventsSection />
      </div>
      {/* ================= TRANSITION DIVIDER ================= */}
      {/* This separates the sections with a "Command Line" look */}
      <div className="w-full max-w-7xl mx-auto my-16">
        <div className="border-t border-gray-800 relative flex items-center justify-center">
            {/* The Badge in the center of the line */}
            <div className="absolute bg-forge-dark px-4 font-mono text-sm text-forge-yellow border border-gray-800 py-1 rounded shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                <span className="text-gray-500">@codeforge</span>niamt  <span className="animate-pulse">_contactus</span>
            </div>
        </div>
      </div>

      {/* ================= communities SECTION ================= */}
      <div id="events">
        <ContactSection />
      </div>
      
    </div>
  );
};

export default HeroSection;