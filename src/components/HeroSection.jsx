import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContactSection from '../pages/ContactSection';
import RegisterModal from '../pages/RegisterModel';
import UpcomingSpotlight, { EventTitle } from './UpcomingSpotlight';
import StatsBar from './StatsBar';
import EventCard from './EventCard';
import EventModal from './EventModal';
import Countdown from './Countdown';
import FAQ from './FAQ';
import Lightbox from './Lightbox';
import {SectionHeading, Reveal, Modal} from './ui';
import Icon from './icons';
import { getUpcoming, getPast } from '../data/events';
import { ABOUT_SHORT, STATS, COMMUNITIES, FAQ as FAQ_ITEMS, GALLERY, LINKS } from '../data/site';

const phrases = ["/career with", "/skills with", "/potential with"];

const Typewriter = ({ phrases }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[index];
    let delay = reverse ? 70 : 120;
    let step = () => setSubIndex((s) => s + (reverse ? -1 : 1));
    if (!reverse && subIndex === currentPhrase.length + 1) {
      delay = 2000;
      step = () => setReverse(true);
    } else if (reverse && subIndex === 0) {
      delay = 300;
      step = () => { setReverse(false); setIndex((i) => (i + 1) % phrases.length); };
    }
    const t = setTimeout(step, delay);
    return () => clearTimeout(t);
  }, [subIndex, index, reverse, phrases]);

  return (
    <span className="text-forge-yellow inline-block min-w-[200px] md:min-w-[300px] text-left">
      {phrases[index].substring(0, subIndex)}<span className="animate-pulse text-white/70">_</span>
    </span>
  );
};

const usePrefersReducedMotion = () => {
  const [reduce, setReduce] = useState(() => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = (e) => setReduce(e.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduce;
};

const HeroSection = () => {
  const upcoming = getUpcoming();
  const next = upcoming[0];
  const past = getPast();
  const reduce = usePrefersReducedMotion();
  const [trailer, setTrailer] = useState(false);
  const [register, setRegister] = useState(false);
  const [openEvent, setOpenEvent] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const stats = [{ label: "Events Hosted", count: past.length, suffix: "+" }, ...STATS.slice(0, 3)];
  const strip = [...GALLERY, ...GALLERY];

  return (
    <div className="relative bg-forge-dark overflow-x-hidden">
      {register && next && <RegisterModal eventName={next.title} onClose={() => setRegister(false)} />}
      {openEvent && <EventModal event={openEvent} onClose={() => setOpenEvent(null)} />}
      {lightbox !== null && <Lightbox items={GALLERY} index={lightbox} setIndex={setLightbox} />}
      {trailer && next?.trailer && (
        <Modal onClose={() => setTrailer(false)} maxW="max-w-5xl" label={`${next.title} trailer`}>
          <video src={next.trailer} poster={next.banner} controls autoPlay playsInline className="w-full rounded-2xl border border-forge-yellow/30 bg-black" />
        </Modal>
      )}

      {/* ================= HERO (video background) ================= */}
      <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
        {!reduce ? (
          <video className="absolute inset-0 w-full h-full object-cover" src="/media/hero-loop.mp4" poster="/media/hero-poster.jpg"
            autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        ) : (
          <img className="absolute inset-0 w-full h-full object-cover" src="/media/hero-poster.jpg" alt="" aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-forge-dark to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-forge-yellow/15 blur-[140px] pointer-events-none" />

        <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 pt-28 pb-16">
          {next && (
            <a href="#upcoming"
              className="group mb-8 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-forge-yellow/50 bg-black/60 backdrop-blur-md px-4 py-2 font-mono text-xs md:text-sm text-white hover:border-forge-yellow transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forge-yellow opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-forge-yellow" />
              </span>
              <span className="font-bold"><EventTitle title={next.title} /></span>
              <span className="text-gray-400">·</span>
              <span>{next.dateLabel}{next.time ? `, ${next.time}` : ""}</span>
              <span className="text-gray-400 hidden sm:inline">·</span>
              <span className="text-forge-yellow"><Countdown target={next.start} compact /></span>
            </a>
          )}

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-mono tracking-tighter text-white leading-[1.05]">
            Develop your <br />
            <Typewriter phrases={phrases} />
          </h1>
          <p className="mt-4 text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-black font-mono text-white tracking-tighter leading-none drop-shadow-[0_0_30px_rgba(249,115,22,0.35)]">
            &lt;Code/Forge&gt;
          </p>
          <p className="mt-6 font-mono text-sm md:text-lg text-gray-300">
            <span className="text-white">Compete.</span> <span className="text-forge-yellow">Code.</span> <span className="text-white">Conquer.</span>
            <span className="text-gray-500"> — the coding club of NIAMT Ranchi</span>
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {next?.registration && (
              <button onClick={() => setRegister(true)}
                className="px-6 md:px-8 py-3.5 rounded-lg bg-forge-yellow text-black font-black font-mono hover:bg-orange-400 transition-colors shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                Register for {next.title} →
              </button>
            )}
            {next?.trailer && (
              <button onClick={() => setTrailer(true)}
                className="px-6 md:px-8 py-3.5 rounded-lg border border-white/30 bg-black/40 backdrop-blur-md text-white font-mono hover:border-forge-yellow hover:text-forge-yellow transition-colors inline-flex items-center gap-2">
                <Icon.play className="w-4 h-4" /> Watch the trailer
              </button>
            )}
            {!next && (
              <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-lg bg-forge-yellow text-black font-black font-mono hover:bg-orange-400 transition-colors">
                Join the Club →
              </a>
            )}
          </div>
        </div>

        <a href="#stats" aria-label="Scroll down" className="relative z-10 mx-auto mb-8 animate-bounce">
          <svg className="w-8 h-8 text-forge-yellow" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </section>

      <div className="relative bg-dot-pattern">
        {/* ================= STATS ================= */}
        <section id="stats" className="max-w-7xl mx-auto px-4 md:px-12 pt-8 pb-20">
          <Reveal><StatsBar stats={stats} /></Reveal>
        </section>

        {/* ================= UPCOMING ================= */}
        {next && (
          <section id="upcoming" className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-20 scroll-mt-20">
            <SectionHeading cmd="./upcoming --next" title="Upcoming Event" />
            <UpcomingSpotlight event={next} />
          </section>
        )}

        {/* ================= ABOUT ================= */}
        <section id="about" className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <SectionHeading cmd="cat about.md" title={<>Not just a club. <span className="text-forge-yellow">A forge.</span></>} />
              <p className="text-gray-300 text-lg leading-relaxed font-sans -mt-4">{ABOUT_SHORT}</p>
              <Link to="/about" className="inline-flex items-center gap-2 mt-8 font-mono text-forge-yellow hover:text-white transition-colors">
                More about us & our advisors <Icon.arrow className="w-4 h-4" />
              </Link>
            </Reveal>
            <Reveal delay={150}>
              <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[360px] md:h-[440px]">
                <img src={GALLERY[7].src} alt={GALLERY[7].caption} loading="lazy" className="col-span-4 row-span-4 w-full h-full object-cover rounded-2xl border border-white/10" />
                <img src={GALLERY[16].src} alt={GALLERY[16].caption} loading="lazy" className="col-span-2 row-span-3 w-full h-full object-cover rounded-2xl border border-white/10" />
                <img src={GALLERY[18].src} alt={GALLERY[18].caption} loading="lazy" className="col-span-2 row-span-3 w-full h-full object-cover rounded-2xl border border-white/10" />
                <img src={GALLERY[9].src} alt={GALLERY[9].caption} loading="lazy" className="col-span-4 row-span-2 w-full h-full object-cover rounded-2xl border border-white/10" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= COMMUNITIES ================= */}
        <section id="communities" className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-20">
          <SectionHeading cmd="ls ./communities" title="Find your community" subtitle="Five communities, one forge. Pick a track — or explore them all." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {COMMUNITIES.map((c, i) => (
              <Reveal key={c.key} delay={i * 80}>
                <Link to="/communities"
                  className="group block h-full p-6 rounded-2xl border border-white/10 bg-black/50 hover:border-forge-yellow/60 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-forge-yellow/10 border border-forge-yellow/40 flex items-center justify-center font-mono font-black text-forge-yellow mb-5 group-hover:bg-forge-yellow group-hover:text-black transition-colors">
                    {c.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg leading-snug">{c.title}</h3>
                  <p className="text-gray-400 text-sm mt-2 font-sans">{c.blurb}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= RECENT EVENTS ================= */}
        <section id="events" className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading cmd="git log --events" title="What we've been building" subtitle={`${past.length}+ events so far — workshops, hackathons, contests and talks.`} />
            <Link to="/events" className="mb-10 md:mb-14 inline-flex items-center gap-2 font-mono text-forge-yellow hover:text-white transition-colors">
              All events <Icon.arrow className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {past.slice(0, 6).map((e, i) => (
              <Reveal key={e.slug} delay={(i % 3) * 100}><EventCard event={e} onOpen={setOpenEvent} /></Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* ================= GALLERY STRIP ================= */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-12 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading cmd="open ./gallery" title="Moments from the forge" />
          <Link to="/gallery" className="mb-10 md:mb-14 inline-flex items-center gap-2 font-mono text-forge-yellow hover:text-white transition-colors">
            Open gallery <Icon.arrow className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            {strip.map((g, i) => (
              <button key={i} onClick={() => setLightbox(i % GALLERY.length)}
                className="shrink-0 w-64 md:w-80 aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-forge-yellow/60 transition-colors">
                <img src={g.src} alt={g.caption} loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ + JOIN ================= */}
      <section className="bg-dot-pattern">
        <div className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-20 grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <SectionHeading cmd="man codeforge" title="Questions? Answered." />
            <FAQ items={FAQ_ITEMS} />
          </div>
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-3xl border border-forge-yellow/40 bg-gradient-to-br from-forge-yellow/20 via-black/60 to-black p-8 md:p-10 flex flex-col justify-between">
              <div>
                <p className="font-mono text-forge-yellow text-sm">~$ sudo join codeforge</p>
                <h3 className="text-3xl md:text-4xl font-black text-white mt-4 leading-tight">Ready to build something real?</h3>
                <p className="text-gray-300 mt-4 font-sans">Join the community for event updates, resources and everything Code Forge.</p>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="text-center px-6 py-3.5 rounded-lg bg-forge-yellow text-black font-black font-mono hover:bg-orange-400 transition-colors">
                  Join our WhatsApp community →
                </a>
                <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer"
                  className="text-center px-6 py-3.5 rounded-lg border border-white/20 text-white font-mono hover:border-forge-yellow hover:text-forge-yellow transition-colors">
                  Follow @codeforgeniamt
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default HeroSection;
