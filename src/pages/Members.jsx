import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PersonCard from '../components/PersonCard';
import MemberRegisterModal from '../components/MemberRegisterModal';
import { Reveal } from '../components/ui';
import { BATCHES, MEMBERS_API } from '../data/members';
import { 
  isSupabaseConfigured, 
  fetchMembersFromSupabase, 
  getSavedLocalProfile 
} from '../lib/supabase';

const githubFromUrl = (url = "") => (url.match(/github\.com\/([A-Za-z0-9-]{1,39})\/?$/i) || [])[1] || "";

// Fetch approved members from Supabase, Apps Script, or local cache
const useRegisteredMembers = (refreshTrigger) => {
  const [state, setState] = useState({ members: [], loading: true });

  useEffect(() => {
    let alive = true;

    async function loadMembers() {
      // 1. Try Supabase first if configured
      if (isSupabaseConfigured) {
        try {
          const supabaseData = await fetchMembersFromSupabase();
          if (alive && Array.isArray(supabaseData) && supabaseData.length > 0) {
            setState({ members: supabaseData, loading: false });
            return;
          }
        } catch (err) {
          console.warn("Supabase fetch failed, attempting fallback:", err);
        }
      }

      // 2. Try Apps Script fallback if MEMBERS_API is defined
      if (MEMBERS_API) {
        try {
          const res = await fetch(MEMBERS_API);
          const d = await res.json();
          if (alive && Array.isArray(d.members)) {
            setState({ members: d.members, loading: false });
            return;
          }
        } catch (err) {
          console.warn("Apps Script fetch failed:", err);
        }
      }

      // 3. Check locally saved profile as preview
      const local = getSavedLocalProfile();
      if (alive) {
        setState({ members: local ? [local] : [], loading: false });
      }
    }

    loadMembers();
    return () => { alive = false; };
  }, [refreshTrigger]);

  return state;
};

const Members = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { members: registered, loading } = useRegisteredMembers(refreshTrigger);
  const [showForm, setShowForm] = useState(false);
  const [savedProfile, setSavedProfile] = useState(() => getSavedLocalProfile());
  const closeForm = useCallback(() => setShowForm(false), []);

  // Listen for local profile updates
  useEffect(() => {
    const handleUpdate = () => {
      setSavedProfile(getSavedLocalProfile());
      setRefreshTrigger((prev) => prev + 1);
    };
    window.addEventListener('codeforge:profile-updated', handleUpdate);
    return () => window.removeEventListener('codeforge:profile-updated', handleUpdate);
  }, []);

  // Hand-written lists + dynamic registrations, grouped by batch
  const batches = useMemo(() => BATCHES.map((b) => ({
    ...b,
    members: [
      ...b.members,
      ...registered
        .filter((m) => m.batch === b.id)
        .map((m) => {
          const github = m.github || githubFromUrl(m.githubUrl || m.github_url);
          const isLead = Boolean(m.is_lead || m.isLead || (m.role && m.role.toLowerCase().includes('lead')));
          return {
            name: m.name,
            branch: m.branch,
            role: m.role || "Member",
            isLead: isLead,
            community: m.community,
            linkedin: m.linkedin || undefined,
            github: github || undefined,
            avatar: m.photo || (github ? `https://github.com/${github}.png?size=120` : undefined),
            bio: m.bio,
            stack: Array.isArray(m.stack) ? m.stack : (typeof m.stack === 'string' ? m.stack.split(',').map(s => s.trim()) : []),
            projects: Array.isArray(m.projects) ? m.projects : [],
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
    if (!batch) return [];
    const s = q.trim().toLowerCase();
    return batch.members
      .filter((m) => !s || `${m.name} ${m.branch || ""} ${m.role || ""} ${m.community || ""} ${(m.stack || []).join(" ")}`.toLowerCase().includes(s))
      .sort((a, b) => (b.isLead ? 1 : 0) - (a.isLead ? 1 : 0) || a.name.localeCompare(b.name));
  }, [batch, q]);

  // Separate leads from active members for clear hierarchy
  const leads = useMemo(() => list.filter(m => m.isLead), [list]);
  const generalMembers = useMemo(() => list.filter(m => !m.isLead), [list]);

  return (
    <div className="min-h-screen bg-forge-dark bg-dot-pattern pt-28 pb-20 px-4 md:px-12 font-mono text-white">
      
      {/* Top Header of Members Section */}
      <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-white/10 pb-4 mb-8">
        <div className="text-xs text-gray-400">
          <span className="text-forge-yellow font-bold">Code Forge</span> / Members Wall
        </div>

        {/* Person Icon "Edit Profile" Button in top-right of Member Section */}
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-forge-yellow/50 bg-black/60 hover:bg-forge-yellow/15 hover:border-forge-yellow text-white transition-all shadow-md group font-mono text-xs md:text-sm cursor-pointer"
          title={savedProfile ? `Edit profile for ${savedProfile.name}` : "Click to register or edit profile"}
        >
          <span className="w-6 h-6 rounded-full bg-forge-yellow/20 flex items-center justify-center text-forge-yellow group-hover:bg-forge-yellow group-hover:text-black transition-colors shrink-0">
            {savedProfile?.photo ? (
              <img src={savedProfile.photo} alt={savedProfile.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </span>
          <span className="font-bold">Edit Profile</span>
          {savedProfile && (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-0.5" title="Profile connected" />
          )}
        </button>
      </div>

      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 border border-forge-yellow rounded-full bg-forge-yellow/10 text-forge-yellow text-xs md:text-sm font-bold tracking-widest">
          THE PEOPLE OF THE FORGE
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white">&lt;Members/&gt;</h1>
        <p className="text-gray-400 mt-4 font-sans text-lg">
          {total > 0 ? `${total} member${total === 1 ? "" : "s"} across ${filled} batch${filled === 1 ? "" : "es"}.` : "Every Code Forge member, batch by batch."}
        </p>

        {savedProfile ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 transition-colors flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <span>Edit My Profile</span>
              <span className="text-xs bg-black/20 px-2 py-0.5 rounded font-mono">({savedProfile.name})</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowForm(true)}
            className="mt-6 px-7 py-3 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            + Register as a member
          </button>
        )}
        <p className="text-xs text-gray-500 mt-2 font-mono">Use your @niamt.ac.in email · Instant updates</p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* Batch tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between mb-8">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Batch">
            {batches.map((b) => (
              <button 
                key={b.id} 
                role="tab" 
                aria-selected={batchId === b.id} 
                onClick={() => setPicked(b.id)}
                className={`px-4 py-2 rounded-xl text-left border transition-colors cursor-pointer ${batchId === b.id
                  ? "bg-forge-yellow text-black border-forge-yellow font-bold shadow-[0_0_10px_rgba(249,115,22,0.2)]"
                  : "border-white/15 text-gray-300 hover:border-forge-yellow/60 hover:text-white"}`}>
                <span className="block font-black text-sm">Batch {b.label}</span>
                <span className={`block text-[11px] ${batchId === b.id ? "text-black/70" : "text-gray-500"}`}>{b.year} · {b.members.length} members</span>
              </button>
            ))}
          </div>

          <label className="relative md:w-72">
            <span className="sr-only">Search members</span>
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search name, branch, role…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-forge-yellow" 
            />
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          </label>
        </div>

        {/* Member Cards / Empty State */}
        {loading && batch?.members.length === 0 ? (
          <div className="py-20 text-center text-forge-yellow animate-pulse">Loading members…</div>
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 py-20 text-center text-gray-500">
            <p className="text-gray-400">No members listed for batch {batch?.label} yet.</p>
            <button onClick={() => setShowForm(true)} className="mt-4 text-forge-yellow font-bold hover:underline">
              Be the first to register →
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* 1. Core Team & Leads Tier (Hierarchy) */}
            {leads.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-forge-yellow text-xs font-bold tracking-wider font-mono">
                    ★ CORE TEAM & DOMAIN LEADS ({leads.length})
                  </span>
                  <div className="flex-1 h-px bg-forge-yellow/20" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {leads.map((m, i) => (
                    <Reveal key={`${m.name}-${i}`} delay={(i % 4) * 50}>
                      <PersonCard 
                        name={m.name} 
                        line1={m.branch} 
                        line2={m.role} 
                        chip={m.community}
                        linkedin={m.linkedin} 
                        github={m.github} 
                        bio={m.bio} 
                        stack={m.stack} 
                        projects={m.projects}
                        avatar={m.avatar} 
                        isLead={true}
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Active Members Tier */}
            {generalMembers.length > 0 && (
              <div>
                {leads.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-400 text-xs font-bold tracking-wider font-mono">
                      ▸ ACTIVE MEMBERS ({generalMembers.length})
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {generalMembers.map((m, i) => (
                    <Reveal key={`${m.name}-${i}`} delay={(i % 4) * 50}>
                      <PersonCard 
                        name={m.name} 
                        line1={m.branch} 
                        line2={m.role} 
                        chip={m.community}
                        linkedin={m.linkedin} 
                        github={m.github} 
                        bio={m.bio} 
                        stack={m.stack} 
                        projects={m.projects}
                        avatar={m.avatar} 
                        isLead={false}
                      />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Member Registration & Edit Modal */}
      {showForm && (
        <MemberRegisterModal 
          onClose={closeForm} 
          initialProfile={savedProfile} 
        />
      )}
    </div>
  );
};

export default Members;
