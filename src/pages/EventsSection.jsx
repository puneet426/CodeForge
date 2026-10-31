import React, { useMemo, useState } from 'react';
import UpcomingSpotlight from '../components/UpcomingSpotlight';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import { SectionHeading, Reveal } from '../components/ui';
import { getUpcoming, getPast, CATEGORIES } from '../data/events';
import { useEvents } from '../lib/useEvents';

// =========================================
// Events page: upcoming spotlight + filterable past-events archive.
// Data: Supabase `events` table (managed from /admin), fallback src/data/events.js
// =========================================
const EventsSection = () => {
  const events = useEvents();
  const upcoming = useMemo(() => getUpcoming(events), [events]);
  const past = useMemo(() => getPast(events), [events]);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);

  const counts = useMemo(() => {
    const c = { All: past.length };
    past.forEach((e) => { c[e.category] = (c[e.category] || 0) + 1; });
    return c;
  }, [past]);

  const byYear = useMemo(() => {
    const list = filter === "All" ? past : past.filter((e) => e.category === filter);
    const groups = {};
    list.forEach((e) => {
      const y = new Date(e.start).getFullYear();
      (groups[y] = groups[y] || []).push(e);
    });
    return Object.entries(groups).sort((a, b) => b[0] - a[0]);
  }, [past, filter]);

  return (
    <section className="min-h-screen pt-28 pb-20 px-4 md:px-12 bg-forge-dark bg-dot-pattern font-mono overflow-hidden">
      {open && <EventModal event={open} onClose={() => setOpen(null)} />}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14 md:mb-20">
          <div className="inline-block px-3 py-1 mb-4 border border-forge-yellow rounded-full bg-forge-yellow/10 text-forge-yellow text-xs md:text-sm font-bold tracking-widest">
            EVENTS & ACTIVITIES
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white">&lt;Events/&gt;</h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto font-sans text-lg">
            Workshops, hackathons, contests and talks — everything we've built together, and what's coming next.
          </p>
        </div>

        {upcoming.length > 0 && (
          <div className="mb-20 md:mb-28">
            <SectionHeading cmd="./upcoming" title="Upcoming" />
            <div className="space-y-8">
              {upcoming.map((e) => <UpcomingSpotlight key={e.slug} event={e} />)}
            </div>
          </div>
        )}

        <SectionHeading cmd="git log --all" title="Past Events" subtitle={`${past.length} events and counting. Tap any card for details, highlights and photos.`} />

        <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filter events">
          {CATEGORIES.filter((c) => counts[c]).map((c) => (
            <button key={c} role="tab" aria-selected={filter === c} onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${filter === c
                ? "bg-forge-yellow text-black border-forge-yellow font-bold"
                : "border-white/15 text-gray-300 hover:border-forge-yellow/60 hover:text-white"}`}>
              {c} <span className={filter === c ? "text-black/60" : "text-gray-500"}>{counts[c]}</span>
            </button>
          ))}
        </div>

        {byYear.map(([year, list]) => (
          <div key={year} className="mb-14">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-2xl md:text-3xl font-black text-white">{year}</h3>
              <div className="h-px flex-grow bg-gradient-to-r from-forge-yellow/50 to-transparent" />
              <span className="text-xs text-gray-500">{list.length} event{list.length > 1 ? "s" : ""}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map((e, i) => (
                <Reveal key={e.slug} delay={(i % 3) * 80}><EventCard event={e} onOpen={setOpen} /></Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EventsSection;
