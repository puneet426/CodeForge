import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import EmailCodeLogin from '../components/EmailCodeLogin';
import AdminTable from '../admin/AdminTable';
import { RESOURCES } from '../admin/resources';

// Hidden admin page (/admin) — not linked anywhere on the site.
// Anyone can open the URL, but only emails listed in the Supabase `admins`
// table (max 5) get any controls, and the database itself refuses writes
// from everyone else (see supabase/schema.sql).

const Shell = ({ children }) => (
  <div className="min-h-screen bg-forge-dark bg-dot-pattern pt-28 pb-20 px-4 md:px-12 font-mono text-white">
    <div className="max-w-5xl mx-auto">{children}</div>
  </div>
);

const Admin = () => {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [isAdmin, setIsAdmin] = useState(null);
  const [tab, setTab] = useState(RESOURCES[0].id);

  useEffect(() => {
    const robots = document.createElement('meta');
    robots.name = 'robots'; robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let alive = true;
    supabase.rpc('is_admin').then(({ data, error }) => alive && setIsAdmin(!error && data === true));
    return () => { alive = false; };
  }, [session]);

  const signOut = async () => { await supabase.auth.signOut(); setIsAdmin(null); };

  if (!supabase) return <Shell><p className="text-gray-400">Supabase isn't configured for this build.</p></Shell>;
  if (session === undefined || (session && isAdmin === null)) return <Shell><p className="text-forge-yellow animate-pulse">Loading…</p></Shell>;

  if (!session) {
    return (
      <Shell>
        <div className="max-w-md mx-auto rounded-2xl border border-forge-yellow/40 bg-black/60 p-6 md:p-8">
          <h1 className="text-2xl font-black">Admin sign in</h1>
          <EmailCodeLogin intro="Leads only. Enter your email to get a one-time code." redirectPath="/admin" />
        </div>
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell>
        <div className="max-w-md mx-auto rounded-2xl border border-white/15 bg-black/60 p-6 md:p-8 space-y-4">
          <h1 className="text-2xl font-black">No access</h1>
          <p className="text-gray-400 text-sm font-sans"><span className="text-white font-mono">{session.user.email}</span> isn't an admin.</p>
          <button onClick={signOut} className="px-5 py-2.5 rounded-lg bg-forge-yellow text-black font-black">Sign out</button>
        </div>
      </Shell>
    );
  }

  const resource = RESOURCES.find((r) => r.id === tab);
  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-forge-yellow text-xs tracking-widest font-bold">ADMIN</p>
          <h1 className="text-3xl md:text-4xl font-black">&lt;Forge Control/&gt;</h1>
        </div>
        <p className="text-xs text-gray-400 font-sans">
          {session.user.email} · <button onClick={signOut} className="text-forge-yellow hover:underline">Sign out</button>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6" role="tablist">
        {RESOURCES.map((r) => (
          <button key={r.id} role="tab" aria-selected={tab === r.id} onClick={() => setTab(r.id)}
            className={`px-4 py-2 rounded-xl border font-black text-sm transition-colors ${tab === r.id ? 'bg-forge-yellow text-black border-forge-yellow' : 'border-white/15 text-gray-300 hover:border-forge-yellow/60'}`}>
            {r.label}
          </button>
        ))}
      </div>

      <AdminTable key={resource.id} resource={resource} />
    </Shell>
  );
};

export default Admin;
