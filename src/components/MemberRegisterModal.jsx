import React, { useEffect, useState } from 'react';
import { BATCHES, BRANCHES, COLLEGE_EMAIL_DOMAIN, isCollegeEmail } from '../data/members';
import { supabase } from '../lib/supabase';
import { Avatar } from './PersonCard';
import EmailCodeLogin, { ErrorMsg } from './EmailCodeLogin';
import { inputCls as input, btnCls as btn, friendlyAuthError } from '../lib/formUi';

// Flow: 1) college email → 2) one-time code from that inbox → 3) profile form.
// The student can come back later, verify again, and edit their profile.

const blankProject = () => ({ title: "", desc: "", url: "" });
const EMPTY = {
  name: "", roll: "", batch: BATCHES[1]?.id || BATCHES[0].id, branch: BRANCHES[0],
  github: "", photo: "", bio: "", role: "", stack: "",
  projects: [blankProject(), blankProject()], githubUrl: "", linkedin: "",
};

const Label = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="block text-sm text-gray-300 mb-1.5">{children}</label>;
const Req = () => <span className="text-forge-yellow">*</span>;
const Muted = ({ children }) => <span className="text-gray-500">{children}</span>;

const isHttps = (u) => !u || /^https:\/\/\S+$/i.test(u.trim());

// Database row → form fields.
const fromRow = (r) => ({
  name: r.name || "", roll: r.roll || "", batch: r.batch, branch: r.branch,
  github: r.github || "", photo: r.photo || "", bio: r.bio || "", role: r.role || "",
  stack: (r.stack || []).join(", "),
  projects: [0, 1].map((i) => ({ ...blankProject(), ...(r.projects?.[i] || {}) })),
  githubUrl: r.github_url || "", linkedin: r.linkedin || "",
});

// Form fields → database row. user_id/email/approved are set by the database.
const toRow = (f, userId) => ({
  user_id: userId,
  name: f.name.trim(), roll: f.roll.trim() || null, batch: f.batch, branch: f.branch,
  github: f.github.trim() || null, photo: f.photo.trim() || null,
  bio: f.bio.trim(), role: f.role.trim() || null,
  stack: f.stack.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 15),
  projects: f.projects
    .map((p) => ({ title: p.title.trim(), desc: p.desc.trim(), url: p.url.trim() }))
    .filter((p) => p.title),
  github_url: f.githubUrl.trim() || null, linkedin: f.linkedin.trim() || null,
});

const friendly = (msg = "") => {
  if (/row-level security/i.test(msg)) return `Only @${COLLEGE_EMAIL_DOMAIN} accounts can register.`;
  if (/members_email_key/i.test(msg)) return "This email is already on the members list. Contact the core team to link it.";
  if (/check constraint/i.test(msg)) return "Some fields aren't valid. Links must start with https:// and the GitHub username can only use letters, numbers and dashes.";
  return friendlyAuthError(msg);
};

const MemberRegisterModal = ({ onClose, onSaved }) => {
  const [step, setStep] = useState(supabase ? "loading" : "closed"); // loading | login | wrong | form | done | closed
  const [user, setUser] = useState(null);
  const [existing, setExisting] = useState(null);
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Close on Escape + lock page scroll while open.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  // Already verified on this device? Go straight to the form.
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    const enter = async (u) => {
      if (!isCollegeEmail(u.email || "")) { if (alive) { setUser(u); setStep("wrong"); } return; }
      const { data } = await supabase.from("members").select("*").eq("user_id", u.id).maybeSingle();
      if (!alive) return;
      setUser(u); setExisting(data || null);
      if (data) setF(fromRow(data));
      setStep("form");
    };
    supabase.auth.getSession().then(({ data }) => (data.session ? enter(data.session.user) : alive && setStep("login")));
    // Also handles the student clicking the link in the email instead of typing the code.
    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => {
      // Deferred: calling Supabase from inside this callback can deadlock.
      if (evt === "SIGNED_IN" && session) setTimeout(() => enter(session.user), 0);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setExisting(null); setF(EMPTY); setErr(""); setStep("login");
  };

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const setProject = (i, k) => (e) =>
    setF((s) => ({ ...s, projects: s.projects.map((p, j) => (j === i ? { ...p, [k]: e.target.value } : p)) }));

  // Fill photo + profile URL from the GitHub username when they're empty.
  const onGithubBlur = () => {
    const u = f.github.trim().replace(/^@/, "");
    if (!/^[A-Za-z0-9-]{1,39}$/.test(u)) return;
    setF((s) => ({
      ...s, github: u,
      photo: s.photo || `https://github.com/${u}.png?size=200`,
      githubUrl: s.githubUrl || `https://github.com/${u}`,
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    const links = [f.photo, f.githubUrl, f.linkedin, ...f.projects.map((p) => p.url)];
    if (!links.every(isHttps)) { setErr("Links must start with https://"); return; }
    if (f.github && !/^[A-Za-z0-9-]{1,39}$/.test(f.github.trim())) { setErr("GitHub username can only use letters, numbers and dashes."); return; }
    setBusy(true);
    const { error } = await supabase.from("members").upsert(toRow(f, user.id), { onConflict: "user_id" });
    setBusy(false);
    if (error) { setErr(friendly(error.message)); return; }
    setStep("done");
    onSaved?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="member-reg-title"
        className={`relative w-full ${step === "form" ? "max-w-3xl" : "max-w-md"} my-8 bg-forge-dark border border-forge-yellow/40 rounded-2xl p-6 md:p-8 font-mono text-white shadow-[0_0_30px_rgba(249,115,22,0.15)]`}>
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold">✕</button>

        <h2 id="member-reg-title" className="text-2xl md:text-3xl font-black pr-8">
          {step === "form" && existing ? "Edit your profile" : "Register as a member"}
        </h2>

        {step === "closed" && (
          <p className="text-gray-400 text-sm mt-3 font-sans">Member registration isn't open yet. Please check back soon.</p>
        )}

        {step === "loading" && <p className="mt-6 text-forge-yellow animate-pulse">Loading…</p>}

        {step === "login" && (
          <EmailCodeLogin
            intro="Enter your college email. We'll send a one-time code to confirm it's you."
            placeholder={`yourname@${COLLEGE_EMAIL_DOMAIN}`}
            allowEmail={(e) => (isCollegeEmail(e) ? "" : `Only @${COLLEGE_EMAIL_DOMAIN} emails can register.`)}
            redirectPath="/members?register=1" />
        )}

        {step === "wrong" && (
          <div className="mt-5 space-y-4">
            <p className="text-gray-400 text-sm font-sans">
              You're signed in as <span className="text-white font-mono">{user?.email}</span>, which isn't a college email.
              Sign out and use your @{COLLEGE_EMAIL_DOMAIN} address to register.
            </p>
            <button onClick={signOut} className={btn}>Sign out</button>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={save} className="mt-5 space-y-5">
            <p className="text-sm font-sans text-gray-400 flex flex-wrap items-center gap-x-2">
              <span>Signed in as <span className="text-white font-mono">{user?.email}</span></span>
              <button type="button" onClick={signOut} className="text-forge-yellow hover:underline text-xs">(not you? sign out)</button>
            </p>
            {existing && (
              <p className={`text-xs rounded-lg px-3 py-2 border ${existing.approved ? "border-green-500/40 text-green-400 bg-green-500/10" : "border-forge-yellow/40 text-forge-yellow bg-forge-yellow/10"}`}>
                {existing.approved ? "Your profile is live. Saving changes sends it for review again." : "Your profile is waiting for approval by the core team."}
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="m-name">Full Name <Req /></Label>
                <input id="m-name" required maxLength={80} value={f.name} onChange={set("name")} placeholder="e.g. Akash Kumar" className={input} />
              </div>
              <div>
                <Label htmlFor="m-roll">Roll Number <Muted>(Optional, private)</Muted></Label>
                <input id="m-roll" maxLength={20} value={f.roll} onChange={set("roll")} placeholder="e.g. 24/CE/089" className={input} />
              </div>

              <div>
                <Label htmlFor="m-batch">Select Batch <Req /></Label>
                <select id="m-batch" required value={f.batch} onChange={set("batch")} className={`${input} font-bold`}>
                  {BATCHES.map((b) => <option key={b.id} value={b.id} className="bg-forge-dark">Batch {b.label.replace(/\s/g, "")} ({b.year})</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="m-branch">Select Branch <Req /></Label>
                <select id="m-branch" required value={f.branch} onChange={set("branch")} className={`${input} font-bold`}>
                  {BRANCHES.map((b) => <option key={b} value={b} className="bg-forge-dark">{b}</option>)}
                </select>
              </div>

              <div>
                <Label htmlFor="m-gh">GitHub Username <span className="text-forge-yellow text-xs">(Auto-fetches photo!)</span></Label>
                <input id="m-gh" maxLength={39} value={f.github} onChange={set("github")} onBlur={onGithubBlur} placeholder="e.g. torvalds" className={input} />
              </div>
              <div>
                <Label htmlFor="m-photo">Profile Photo URL</Label>
                <div className="flex items-center gap-3">
                  <Avatar name={f.name || "?"} src={f.photo || undefined} size="w-11 h-11" />
                  <input id="m-photo" type="url" value={f.photo} onChange={set("photo")} placeholder="https://… or auto-filled by GitHub" className={input} />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="m-bio">One-line Summary / Bio <Req /></Label>
                <textarea id="m-bio" required maxLength={280} rows={2} value={f.bio} onChange={set("bio")}
                  placeholder="e.g. Machine learning enthusiast, Kaggle competitor, building autonomous robotics systems." className={`${input} font-sans resize-y`} />
              </div>

              <div>
                <Label htmlFor="m-role">Club Role / Company <Muted>(Optional)</Muted></Label>
                <input id="m-role" maxLength={60} value={f.role} onChange={set("role")} placeholder="e.g. ML Lead or SDE Intern" className={input} />
              </div>
              <div>
                <Label htmlFor="m-stack">Tech Stack <Muted>(comma-separated)</Muted></Label>
                <input id="m-stack" maxLength={200} value={f.stack} onChange={set("stack")} placeholder="e.g. Python, React, C++, ROS2, Docker" className={input} />
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <p className="text-forge-yellow text-sm font-bold tracking-wider mb-4">▸ PROJECTS (OPTIONAL)</p>
              <div className="space-y-4">
                {f.projects.map((p, i) => (
                  <fieldset key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <legend className="sr-only">Project {i + 1}</legend>
                    <p className="text-xs text-gray-400 font-bold tracking-wider mb-3">PROJECT {i + 1}</p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <input aria-label={`Project ${i + 1} title`} maxLength={60} value={p.title} onChange={setProject(i, "title")} placeholder="Project Title" className={input} />
                      <input aria-label={`Project ${i + 1} description`} maxLength={140} value={p.desc} onChange={setProject(i, "desc")} placeholder="Short Description" className={input} />
                      <input aria-label={`Project ${i + 1} link`} type="url" value={p.url} onChange={setProject(i, "url")} placeholder="GitHub or Demo URL" className={input} />
                    </div>
                  </fieldset>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 border-t border-white/10 pt-5">
              <div>
                <Label htmlFor="m-ghurl">GitHub Profile URL</Label>
                <input id="m-ghurl" type="url" value={f.githubUrl} onChange={set("githubUrl")} placeholder="https://github.com/your-username" className={input} />
              </div>
              <div>
                <Label htmlFor="m-li">LinkedIn Profile URL</Label>
                <input id="m-li" type="url" value={f.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/your-profile" className={input} />
              </div>
            </div>

            <ErrorMsg msg={err} />
            <button type="submit" disabled={busy} className={btn}>{busy ? "Saving…" : existing ? "[ Save Changes ]" : "[ Submit Profile ]"}</button>
          </form>
        )}

        {step === "done" && (
          <div className="mt-6 rounded-xl border border-green-500/40 bg-green-500/10 p-6 text-center">
            <p className="text-green-400 font-bold">
              {existing ? "Changes saved. Your profile will show again once the core team re-approves it."
                : "You're registered! Your profile will appear on this page once the core team approves it."}
            </p>
            <button onClick={onClose} className="mt-5 px-6 py-2.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 transition-colors">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberRegisterModal;
