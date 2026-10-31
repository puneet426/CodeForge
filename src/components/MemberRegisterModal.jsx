import React, { useEffect, useState } from 'react';
import { BATCHES, BRANCHES, COLLEGE_EMAIL_DOMAIN, MEMBERS_API, isCollegeEmail } from '../data/members';
import { Avatar } from './PersonCard';

const EMPTY = {
  name: "", email: "", roll: "", batch: BATCHES[1]?.id || BATCHES[0].id, branch: BRANCHES[0],
  github: "", photo: "", bio: "", role: "", stack: "",
  projects: [{ title: "", desc: "", url: "" }, { title: "", desc: "", url: "" }],
  githubUrl: "", linkedin: "", website: "",
};

const input = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-forge-yellow transition-colors";
const Label = ({ children, htmlFor, extra }) => (
  <label htmlFor={htmlFor} className="block text-sm text-gray-300 mb-1.5">
    {children} {extra}
  </label>
);
const Req = () => <span className="text-forge-yellow">*</span>;

const MemberRegisterModal = ({ onClose }) => {
  const [f, setF] = useState(EMPTY);
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

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

  const emailBad = f.email && !isCollegeEmail(f.email);

  const submit = async (e) => {
    e.preventDefault();
    if (!isCollegeEmail(f.email)) {
      setStatus({ state: "error", msg: `Please use your college email ending in @${COLLEGE_EMAIL_DOMAIN}.` });
      return;
    }
    if (!MEMBERS_API) {
      setStatus({ state: "error", msg: "Member registration isn't open yet. Please try again later." });
      return;
    }
    setStatus({ state: "sending", msg: "Submitting…" });
    try {
      // text/plain body keeps this a "simple" CORS request for Apps Script.
      const res = await fetch(MEMBERS_API, { method: "POST", body: JSON.stringify({ ...f, email: f.email.trim() }) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Something went wrong.");
      setStatus({
        state: "done",
        msg: data.updated
          ? "Your profile was updated. It will show again once the core team re-approves it."
          : "You're registered! Your profile will appear on this page once the core team approves it.",
      });
    } catch (err) {
      setStatus({ state: "error", msg: err.message && err.message !== "Failed to fetch" ? err.message : "Couldn't submit. Check your connection and try again." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="member-reg-title"
        className="relative w-full max-w-3xl my-8 bg-forge-dark border border-forge-yellow/40 rounded-2xl p-6 md:p-8 font-mono text-white shadow-[0_0_30px_rgba(249,115,22,0.15)]">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold">✕</button>

        <h2 id="member-reg-title" className="text-2xl md:text-3xl font-black">Register as a member</h2>
        <p className="text-gray-400 text-sm mt-1 font-sans">Add your profile to the Code Forge members wall. Profiles go live after a quick review.</p>

        {status.state === "done" ? (
          <div className="mt-8 rounded-xl border border-green-500/40 bg-green-500/10 p-6 text-center">
            <p className="text-green-400 font-bold">{status.msg}</p>
            <button onClick={onClose} className="mt-5 px-6 py-2.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 transition-colors">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-5">
            {/* Honeypot: hidden from people, bots fill it. */}
            <input type="text" name="website" value={f.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="m-name">Full Name <Req /></Label>
                <input id="m-name" required maxLength={80} value={f.name} onChange={set("name")} placeholder="e.g. Akash Kumar" className={input} />
              </div>
              <div>
                <Label htmlFor="m-email">College Email <Req /></Label>
                <input id="m-email" type="email" required value={f.email} onChange={set("email")}
                  placeholder={`yourname@${COLLEGE_EMAIL_DOMAIN}`} aria-invalid={emailBad || undefined}
                  pattern={`^[^\\s@]+@${COLLEGE_EMAIL_DOMAIN.replace(/\./g, "\\.")}$`}
                  title={`Must end with @${COLLEGE_EMAIL_DOMAIN}`}
                  className={`${input} ${emailBad ? "border-red-500/70 focus:border-red-500" : ""}`} />
                {emailBad && <p className="text-xs text-red-400 mt-1">Only @{COLLEGE_EMAIL_DOMAIN} emails can register.</p>}
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
                <Label htmlFor="m-roll">Roll Number <span className="text-gray-500">(Optional, not shown publicly)</span></Label>
                <input id="m-roll" maxLength={20} value={f.roll} onChange={set("roll")} placeholder="e.g. 24/CE/089" className={input} />
              </div>
              <div>
                <Label htmlFor="m-gh" extra={<span className="text-forge-yellow text-xs">(Auto-fetches photo!)</span>}>GitHub Username</Label>
                <input id="m-gh" maxLength={39} value={f.github} onChange={set("github")} onBlur={onGithubBlur} placeholder="e.g. torvalds" className={input} />
              </div>

              <div className="md:col-span-2">
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
                <Label htmlFor="m-role">Club Role / Company <span className="text-gray-500">(Optional)</span></Label>
                <input id="m-role" maxLength={60} value={f.role} onChange={set("role")} placeholder="e.g. ML Lead or SDE Intern" className={input} />
              </div>
              <div>
                <Label htmlFor="m-stack">Tech Stack <span className="text-gray-500">(comma-separated)</span></Label>
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

            {status.state === "error" && <p role="alert" className="text-sm text-red-400 font-bold">{status.msg}</p>}

            <button type="submit" disabled={status.state === "sending"}
              className="w-full py-3.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 disabled:opacity-60 transition-colors">
              {status.state === "sending" ? "Submitting…" : "[ Submit Profile ]"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MemberRegisterModal;
