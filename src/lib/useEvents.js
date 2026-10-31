import { useEffect, useState } from 'react';
import { supabase, safeUrl } from './supabase';
import { events as bundled } from '../data/events';

// Images may be a site path ("/events/x.webp") or an https URL.
const media = (u) => (typeof u === 'string' && u.startsWith('/') && !u.startsWith('//') ? u : safeUrl(u));
const nonEmpty = (a) => (Array.isArray(a) && a.length ? a : undefined);

const IST = { timeZone: 'Asia/Kolkata' };
const autoDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { ...IST, day: '2-digit', month: 'short', year: 'numeric' });
const autoTime = (iso) => new Date(iso).toLocaleTimeString('en-US', { ...IST, hour: 'numeric', minute: '2-digit' });

// Database row → the event shape the components already use.
export const fromEventRow = (r) => ({
  slug: r.slug, title: r.title, tagline: r.tagline || undefined, category: r.category,
  start: r.start_at, end: r.end_at || undefined,
  dateLabel: r.date_label || autoDate(r.start_at),
  time: r.time_label || autoTime(r.start_at),
  venue: r.venue || undefined, collab: r.collab || undefined,
  banner: media(r.banner) || null, trailer: media(r.trailer),
  featured: r.featured, registration: r.registration,
  description: r.description || undefined,
  highlights: nonEmpty(r.highlights),
  sessions: nonEmpty(r.sessions),
  gallery: nonEmpty((r.gallery || []).map(media).filter(Boolean)),
  galleryTitle: r.gallery_title || undefined,
});

// Events from Supabase (table `events`), falling back to src/data/events.js
// when Supabase isn't configured or can't be reached.
export const useEvents = () => {
  const [list, setList] = useState(bundled);
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.from('events').select('*').order('start_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('Events fetch failed:', error.message); return; }
        if (alive && data) setList(data.map(fromEventRow));
      });
    return () => { alive = false; };
  }, []);
  return list;
};
