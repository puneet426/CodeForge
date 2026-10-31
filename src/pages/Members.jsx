import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PersonCard from '../components/PersonCard';
import MemberRegisterModal from '../components/MemberRegisterModal';
import { Reveal } from '../components/ui';
import { BATCHES, MEMBERS_API } from '../data/members';

const githubFromUrl = (url = "") => (url.match(/github\.com\/([A-Za-z0-9-]{1,39})\/?$/i) || [])[1] || "";

// Approved self-registered members from the Google Sheet (see backend/README.md).
const useRegisteredMembers = () => {
  const [state, setState] = useState({ members: [], loading: Boolean(MEMBERS_API) });
  useEffect(() => {
    if (!MEMBERS_API) return;
    let alive = true;
    fetch(MEMBERS_API)
      .then((r) => r.json())
      .then((d) => alive && setState({ members: Array.isArray(d.members) ? d.members : [], loading: false }))
      .catch((err) => { console.error("Members fetch failed:", err); if (alive) setState({ members: [], loading: false }); });
    return () => { alive = false; };
  }, []);
  return state;
};

const Members = () => {
  const { members: registered, loading } = useRegisteredMembers();
  const [showForm, setShowForm] = useState(false);
  const closeForm = useCallback(() => setShowForm(false), []);

  // Hand-written lists + approved registrations, grouped by batch.
  const batches = useMemo(() => BATCHES.map((b) => ({
    ...b,
    members: [
      ...b.members,
      ...registered.filter((m) => m.batch === b.id).map((m) => {
        const github = m.github || githubFromUrl(m.githubUrl);
        return {
          name: m.name, branch: m.branch, role: m.role, linkedin: m.linkedin || undefined, github: github || undefined,
          avatar: m.photo || (github ? `https://github.com/${github}.png?size=120` : undefined),
          bio: m.bio, stack: m.stack || [], projects: m.projects || [],
        };
      }),
    ],
  })), [registered]);

  const total = batches.reduce((n, b) => n + b.members.length, 0);
  const filled = batches.filter((b) => b.members.length).length;
  const [picked, setPicked] = useState(null);
  const batchId = picked || (batches.find((b) => b.members.length) || batches[0]).id;
  const [q, setQ] = useState("");
  const batch = batches.find((b) => b.id === batchId);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return batch.members
      .filter((m) => !s || `${m.name} ${m.branch || ""} ${m.role || ""} ${m.community || ""} ${(m.stack || []).join(" ")}`.toLowerCase().includes(s))
      .sort((a, b) => (b.role ? 1 : 0) - (a.role ? 1 : 0) || a.name.localeCompare(b.name));
  }, [batch, q]);

  return (
    <div className="min-h-screen bg-forge-dark bg-dot-pattern pt-28 pb-20 px-4 md:px-12 font-mono text-white">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 border border-forge-yellow rounded-full bg-forge-yellow/10 text-forge-yellow text-xs md:text-sm font-bold tracking-widest">
          THE PEOPLE OF THE FORGE
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white">&lt;Members/&gt;</h1>
        <p className="text-gray-400 mt-4 font-sans text-lg">
          {total > 0 ? `${total} member${total === 1 ? "" : "s"} across ${filled} batch${filled === 1 ? "" : "es"}.` : "Every Code Forge member, batch by batch."}
        </p>
        <button onClick={() => setShowForm(true)}
          className="mt-6 px-7 py-3 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 transition-colors">
          + Register as a member
        </button>
        <p className="text-xs text-gray-500 mt-2">Use your @niamt.ac.in email · profiles appear after review</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Batch">
            {batches.map((b) => (
              <button key={b.id} role="tab" aria-selected={batchId === b.id} onClick={() => setPicked(b.id)}
                className={`px-4 py-2 rounded-xl text-left border transition-colors ${batchId === b.id
                  ? "bg-forge-yellow text-black border-forge-yellow"
                  : "border-white/15 text-gray-300 hover:border-forge-yellow/60 hover:text-white"}`}>
                <span className="block font-black text-sm">Batch {b.label}</span>
                <span className={`block text-[11px] ${batchId === b.id ? "text-black/70" : "text-gray-500"}`}>{b.year} · {b.members.length} members</span>
              </button>
            ))}
          </div>
          <label className="relative md:w-72">
            <span className="sr-only">Search members</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, branch, skill…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-forge-yellow" />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          </label>
        </div>

        {loading && batch.members.length === 0 ? (
          <div className="py-20 text-center text-forge-yellow animate-pulse">Loading members…</div>
        ) : batch.members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center text-gray-500">
            <p>No members listed for batch {batch.label} yet.</p>
            <button onClick={() => setShowForm(true)} className="mt-4 text-forge-yellow font-bold hover:underline">Be the first to register →</button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-5">{list.length} member{list.length === 1 ? "" : "s"}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {list.map((m, i) => (
                <Reveal key={`${m.name}-${i}`} delay={(i % 4) * 50}>
                  <PersonCard name={m.name} line1={m.branch} line2={m.role} chip={m.community}
                    linkedin={m.linkedin} github={m.github} bio={m.bio} stack={m.stack} projects={m.projects}
                    avatar={m.avatar || (m.github ? `https://github.com/${m.github}.png?size=120` : undefined)} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>

      {showForm && <MemberRegisterModal onClose={closeForm} />}
    </div>
  );
};

export default Members;
