import React, { useMemo, useState } from 'react';
import PersonCard from '../components/PersonCard';
import { Reveal } from '../components/ui';
import { alumni } from '../data/alumni';
import { LINKS } from '../data/site';
import { topCompanies } from '../data/alumniStats';

const GROUPS = [
  { id: "all", label: "All alumni" },
  { id: "leaders", label: "Leaders & founders" },
  { id: "tech", label: "Working in tech" },
];

const Alumni = () => {
  const [group, setGroup] = useState("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return alumni.filter((a) =>
      (group === "all" || a.group === group) &&
      (!s || `${a.name} ${a.role} ${a.company} ${a.sector}`.toLowerCase().includes(s)));
  }, [group, q]);

  const counts = { all: alumni.length, leaders: alumni.filter((a) => a.group === "leaders").length, tech: alumni.filter((a) => a.group === "tech").length };

  return (
    <div className="min-h-screen bg-forge-dark bg-dot-pattern pt-28 pb-20 px-4 md:px-12 font-mono text-white">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 border border-forge-yellow rounded-full bg-forge-yellow/10 text-forge-yellow text-xs md:text-sm font-bold tracking-widest">
          NIAMT · NIFFT ALUMNI NETWORK
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white">&lt;Alumni/&gt;</h1>
        <p className="text-gray-400 mt-4 font-sans text-lg max-w-2xl mx-auto">
          {alumni.length}+ alumni building at Google, KPMG, ZS, Capgemini, Infosys, startups and more. Reach out, ask for guidance, and connect on LinkedIn.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {topCompanies(10).map((c) => (
            <span key={c} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300">{c}</span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter alumni">
            {GROUPS.map((g) => (
              <button key={g.id} role="tab" aria-selected={group === g.id} onClick={() => setGroup(g.id)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${group === g.id
                  ? "bg-forge-yellow text-black border-forge-yellow font-bold"
                  : "border-white/15 text-gray-300 hover:border-forge-yellow/60 hover:text-white"}`}>
                {g.label} <span className={group === g.id ? "text-black/60" : "text-gray-500"}>{counts[g.id]}</span>
              </button>
            ))}
          </div>
          <label className="relative md:w-80">
            <span className="sr-only">Search alumni</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, company, role…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-forge-yellow" />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          </label>
        </div>

        <p className="text-xs text-gray-500 mb-5">{list.length} result{list.length === 1 ? "" : "s"}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((a, i) => (
            <Reveal key={a.linkedin} delay={(i % 4) * 50}>
              <PersonCard name={a.name} line1={a.role} line2={a.company} chip={a.group === "leaders" ? "Leader / founder" : a.sector}
                linkedin={a.linkedin} />
            </Reveal>
          ))}
        </div>
        {list.length === 0 && <p className="text-center text-gray-500 py-16">No alumni match “{q}”.</p>}

        <div className="mt-16 rounded-2xl border border-forge-yellow/30 bg-gradient-to-r from-forge-yellow/15 to-transparent p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-black">Are you a NIAMT / NIFFT alum?</h3>
            <p className="text-gray-300 font-sans mt-1">Get listed, mentor juniors, or speak at a Code Forge session — we'd love to hear from you.</p>
          </div>
          <a href={`mailto:${LINKS.email}?subject=Alumni%20%E2%80%94%20Code%20Forge`}
            className="shrink-0 text-center px-6 py-3 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 transition-colors">
            Get in touch →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Alumni;
