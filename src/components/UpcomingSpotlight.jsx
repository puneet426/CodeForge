import React, { useState } from 'react';
import Countdown from './Countdown';
import RegisterModal from '../pages/RegisterModel';
import EventModal from './EventModal';
import {Reveal, CategoryPill, Poster} from './ui';
import Icon from './icons';

// Title like ORIENTATION'26 gets the classic serif treatment with an orange '26.
export const EventTitle = ({ title, className = "" }) => {
  const m = title.match(/^(.*?)('?\d{2})$/);
  if (!m) return <span className={className}>{title}</span>;
  return (
    <span className={`font-display ${className}`}>
      {m[1]}<span className="italic text-forge-yellow">{m[2]}</span>
    </span>
  );
};

// Big featured card for the next event: trailer, countdown, details, register.
const UpcomingSpotlight = ({ event }) => {
  const [register, setRegister] = useState(false);
  const [details, setDetails] = useState(false);
  if (!event) return null;
  return (
    <Reveal>
      {register && <RegisterModal eventName={event.title} onClose={() => setRegister(false)} />}
      {details && <EventModal event={event} onClose={() => setDetails(false)} />}
      <div className="relative rounded-3xl overflow-hidden border border-forge-yellow/30 bg-black/50 backdrop-blur-sm shadow-[0_0_80px_rgba(249,115,22,0.12)]">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-forge-yellow/20 blur-[120px] pointer-events-none" />
        <div className="grid lg:grid-cols-2">
          <div className="relative bg-black aspect-video lg:aspect-auto lg:min-h-[420px]">
            {event.trailer ? (
              <video className="absolute inset-0 w-full h-full object-cover" src={event.trailer} poster={event.banner}
                controls playsInline preload="none" />
            ) : (
              <Poster src={event.banner} title={event.title} contain className="absolute inset-0" />
            )}
          </div>
          <div className="relative p-6 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forge-yellow opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-forge-yellow" />
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-forge-yellow">Next up</span>
              <CategoryPill>{event.category}</CategoryPill>
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
              <EventTitle title={event.title} />
            </h3>
            {event.tagline && <p className="text-gray-300 mt-3 font-mono text-sm">{event.tagline}</p>}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 font-mono text-sm text-white">
              <span className="flex items-center gap-2"><Icon.calendar className="w-4 h-4 text-forge-yellow" />{event.dateLabel}</span>
              {event.time && <span className="flex items-center gap-2"><Icon.clock className="w-4 h-4 text-forge-yellow" />{event.time}</span>}
              {event.venue && <span className="flex items-center gap-2"><Icon.pin className="w-4 h-4 text-forge-yellow" />{event.venue}</span>}
            </div>
            <div className="mt-7"><Countdown target={event.start} /></div>
            <div className="mt-7 flex flex-wrap gap-3">
              {event.registration && (
                <button onClick={() => setRegister(true)}
                  className="px-6 py-3 rounded-lg bg-forge-yellow text-black font-black font-mono hover:bg-orange-400 transition-colors shadow-[0_0_25px_rgba(249,115,22,0.45)]">
                  Register Now →
                </button>
              )}
              <button onClick={() => setDetails(true)}
                className="px-6 py-3 rounded-lg border border-white/20 text-white font-mono hover:border-forge-yellow hover:text-forge-yellow transition-colors">
                What's inside
              </button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default UpcomingSpotlight;
