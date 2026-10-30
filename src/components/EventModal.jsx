import React, { useState } from 'react';
import {Modal, Poster, CategoryPill} from './ui';
import Icon from './icons';

const EventModal = ({ event, onClose }) => {
  const [zoom, setZoom] = useState(null);
  return (
    <Modal onClose={zoom ? () => setZoom(null) : onClose} label={event.title}>
      <div className="rounded-2xl overflow-hidden border border-forge-yellow/30 bg-forge-dark shadow-[0_0_60px_rgba(249,115,22,0.15)]">
        <div className="grid md:grid-cols-5">
          <div className="md:col-span-2 bg-black">
            <Poster src={event.banner} title={event.title} contain className="w-full aspect-[4/5] md:h-full" />
          </div>
          <div className="md:col-span-3 p-6 md:p-8 font-mono">
            <CategoryPill>{event.category}</CategoryPill>
            <h3 className="text-2xl md:text-3xl font-black text-white mt-3 leading-tight">{event.title}</h3>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-forge-yellow mt-4">
              <span className="flex items-center gap-1.5"><Icon.calendar className="w-4 h-4" />{event.dateLabel}</span>
              {event.time && <span className="flex items-center gap-1.5"><Icon.clock className="w-4 h-4" />{event.time}</span>}
              {event.venue && <span className="flex items-center gap-1.5"><Icon.pin className="w-4 h-4" />{event.venue}</span>}
            </div>
            {event.collab && <p className="text-xs text-gray-400 mt-3"><span className="text-gray-500">in collaboration with</span> {event.collab}</p>}
            {event.description && <p className="text-gray-300 mt-5 leading-relaxed font-sans">{event.description}</p>}

            {event.highlights && (
              <ul className="mt-5 space-y-2">
                {event.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-300 font-sans">
                    <span className="text-forge-yellow mt-0.5">▹</span>{h}
                  </li>
                ))}
              </ul>
            )}

            {event.sessions && (
              <ol className="mt-6 space-y-3 border-l border-forge-yellow/30 pl-4">
                {event.sessions.map((s) => (
                  <li key={s.day}>
                    <p className="text-xs text-forge-yellow">{s.day} · {s.date} · {s.venue}</p>
                    <p className="text-white font-bold">{s.title}</p>
                    <p className="text-xs text-gray-400 font-sans">{s.note}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {event.gallery && (
          <div className="p-6 md:p-8 border-t border-white/10">
            <p className="text-sm font-mono text-gray-400 mb-4">{event.galleryTitle || "Moments"}</p>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {event.gallery.map((g) => (
                <button key={g} onClick={() => setZoom(g)} className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-forge-yellow/60 transition-colors">
                  <img src={g} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {zoom && (
        <div className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center p-4" onClick={() => setZoom(null)}>
          <img src={zoom} alt="" className="max-w-full max-h-[90vh] rounded-lg" />
        </div>
      )}
    </Modal>
  );
};

export default EventModal;
