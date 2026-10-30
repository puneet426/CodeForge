import React from 'react';
import {Poster, CategoryPill} from './ui';
import Icon from './icons';

// Card used in the past-events grid. Clicking opens the event details.
const EventCard = ({ event, onOpen }) => (
  <button onClick={() => onOpen(event)}
    className="group text-left w-full h-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm hover:border-forge-yellow/60 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(249,115,22,0.15)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-forge-yellow">
    <div className="relative aspect-[4/3] overflow-hidden">
      <Poster src={event.banner} title={event.title} contain className="w-full h-full"
        imgClassName="transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute top-3 left-3"><CategoryPill>{event.category}</CategoryPill></div>
    </div>
    <div className="p-4 md:p-5 flex flex-col flex-grow">
      <p className="font-mono text-xs text-forge-yellow flex items-center gap-1.5 mb-2">
        <Icon.calendar className="w-3.5 h-3.5" /> {event.dateLabel}
      </p>
      <h3 className="text-lg font-bold text-white leading-snug group-hover:text-forge-yellow transition-colors">{event.title}</h3>
      {event.venue && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5"><Icon.pin className="w-3.5 h-3.5" />{event.venue}</p>}
      {event.description && <p className="text-sm text-gray-400 mt-3 line-clamp-2 font-sans">{event.description}</p>}
      <span className="mt-auto pt-4 text-xs font-mono text-gray-500 group-hover:text-forge-yellow transition-colors flex items-center gap-1">
        View details <Icon.arrow className="w-3.5 h-3.5" />
      </span>
    </div>
  </button>
);

export default EventCard;
