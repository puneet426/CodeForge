import React, { useEffect, useState } from 'react';
import { BATCHES, BRANCHES } from '../data/members';
import { Avatar } from './PersonCard';
import { 
  COLLEGE_EMAIL_DOMAIN,
  isCollegeEmail,
  isSupabaseConfigured,
  fetchMemberByEmail,
  saveMemberProfile,
  getSavedLocalProfile,
  setSavedLocalProfile,
} from '../lib/supabase';

const EMPTY = {
  name: "", email: "", roll: "", batch: BATCHES[1]?.id || BATCHES[0].id, branch: BRANCHES[0],
  github: "", photo: "", bio: "", role: "Member", stack: "",
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

const ROLES = [
  "Member",
  "Developer",
  "Designer",
  "Competitive Programmer",
  "ML Engineer",
  "Open Source Contributor",
];

const MemberRegisterModal = ({ onClose, initialProfile = null }) => {
  const saved = initialProfile || getSavedLocalProfile();
  const [mode, setMode] = useState(saved ? "edit" : "register"); // 'register' | 'edit' | 'lookup' | 'success'
  const [lookupEmail, setLookupEmail] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  const [f, setF] = useState(() => {
    if (saved) {
      return {
        name: saved.name || "",
        email: saved.email || "",
        roll: saved.roll || "",
        batch: saved.batch || BATCHES[1]?.id || BATCHES[0].id,
        branch: saved.branch || BRANCHES[0],
        github: saved.github || "",
        photo: saved.photo || "",
        bio: saved.bio || "",
        role: saved.role || "Member",
        stack: Array.isArray(saved.stack) ? saved.stack.join(", ") : (saved.stack || ""),
        projects: Array.isArray(saved.projects) && saved.projects.length 
          ? [
              saved.projects[0] || { title: "", desc: "", url: "" },
              saved.projects[1] || { title: "", desc: "", url: "" },
            ]
          : [{ title: "", desc: "", url: "" }, { title: "", desc: "", url: "" }],
        githubUrl: saved.github_url || saved.githubUrl || "",
        linkedin: saved.linkedin || "",
        website: saved.website || "",
      };
    }
    return EMPTY;
  });

  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { 
      document.removeEventListener("keydown", onKey); 
      document.body.style.overflow = prev; 
    };
  }, [onClose]);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const setProject = (i, k) => (e) =>
    setF((s) => ({ ...s, projects: s.projects.map((p, j) => (j === i ? { ...p, [k]: e.target.value } : p)) }));

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

  // Look up existing member by college email (if using a different device)
  const handleLookup = async (e) => {
    e.preventDefault();
    const clean = lookupEmail.trim().toLowerCase();
    if (!isCollegeEmail(clean)) {
      setStatus({ state: "error", msg: `Please enter a valid @${COLLEGE_EMAIL_DOMAIN} email.` });
      return;
    }

    setIsLookingUp(true);
    setStatus({ state: "idle", msg: "" });

    try {
      const found = await fetchMemberByEmail(clean);
      if (found) {
        setF({
          name: found.name || "",
          email: found.email || clean,
          roll: found.roll || "",
          batch: found.batch || BATCHES[1]?.id || BATCHES[0].id,
          branch: found.branch || BRANCHES[0],
          github: found.github || "",
          photo: found.photo || "",
          bio: found.bio || "",
          role: found.role || "Member",
          stack: Array.isArray(found.stack) ? found.stack.join(", ") : (found.stack || ""),
          projects: Array.isArray(found.projects) && found.projects.length 
            ? found.projects 
            : [{ title: "", desc: "", url: "" }, { title: "", desc: "", url: "" }],
          githubUrl: found.github_url || found.githubUrl || "",
          linkedin: found.linkedin || "",
          website: found.website || "",
        });
        setSavedLocalProfile(found);
        setMode("edit");
        setStatus({ state: "idle", msg: "" });
      } else {
        setStatus({ 
          state: "error", 
          msg: `No existing profile found for ${clean}. You can register as a new member below.` 
        });
        setF(s => ({ ...s, email: clean }));
        setMode("register");
      }
    } catch (err) {
      setStatus({ state: "error", msg: "Lookup failed. Please check your connection." });
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleForgetDevice = () => {
    setSavedLocalProfile(null);
    setF(EMPTY);
    setMode("register");
    window.dispatchEvent(new CustomEvent('codeforge:profile-updated', { detail: null }));
  };

  // Save profile directly to Supabase
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    if (!isCollegeEmail(f.email)) {
      setStatus({ state: "error", msg: `Please use your official college email ending in @${COLLEGE_EMAIL_DOMAIN}.` });
      return;
    }

    setLoading(true);
    setStatus({ state: "sending", msg: "Publishing profile to live directory…" });

    const payload = {
      ...f,
      email: f.email.trim().toLowerCase(),
      stack: typeof f.stack === 'string' ? f.stack.split(',').map(s => s.trim()).filter(Boolean) : f.stack,
      projects: f.projects.filter(p => p.title && p.title.trim()),
    };

    try {
      let saved = null;
      if (isSupabaseConfigured) {
        saved = await saveMemberProfile(payload);
      } else {
        saved = payload;
        setSavedLocalProfile(payload);
      }

      window.dispatchEvent(new CustomEvent('codeforge:profile-updated', { detail: saved }));
      setMode('success');
    } catch (err) {
      console.error(err);
      setStatus({ 
        state: "error", 
        msg: err.message || "Could not publish profile. Please check that you ran the SQL policy update in Supabase." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="member-modal-title"
        className="relative w-full max-w-3xl my-8 bg-forge-dark border border-forge-yellow/50 rounded-2xl p-6 md:p-8 font-mono text-white shadow-[0_0_40px_rgba(249,115,22,0.2)]">
        
        {/* Close Button */}
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold cursor-pointer">✕</button>

        {/* ================= LOOKUP VIEW ================= */}
        {mode === "lookup" ? (
          <form onSubmit={handleLookup} className="space-y-5 py-4 max-w-lg">
            <div>
              <div className="inline-block px-3 py-1 mb-3 border border-forge-yellow/60 rounded-full bg-forge-yellow/10 text-forge-yellow text-xs font-bold tracking-widest">
                PROFILE LOOKUP
              </div>
              <h2 id="member-modal-title" className="text-2xl md:text-3xl font-black mb-1">
                Find Your Profile
              </h2>
              <p className="text-gray-400 text-sm font-sans mb-4">
                Enter the college email you previously registered with:
              </p>
            </div>

            <div>
              <Label htmlFor="lookup-email">College Email ID <Req /></Label>
              <input 
                id="lookup-email"
                type="email" 
                required
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder={`yourname@${COLLEGE_EMAIL_DOMAIN}`}
                className={input}
              />
            </div>

            {status.state === "error" && (
              <p className="text-xs text-red-400 font-bold">{status.msg}</p>
            )}

            <div className="flex items-center gap-3">
              <button 
                type="submit" 
                disabled={isLookingUp}
                className="px-6 py-2.5 bg-forge-yellow text-black font-black rounded-lg hover:bg-orange-400 disabled:opacity-50 transition-colors shadow-md cursor-pointer">
                {isLookingUp ? "Looking up…" : "Fetch My Profile →"}
              </button>
              <button 
                type="button" 
                onClick={() => setMode("register")} 
                className="text-xs text-gray-400 hover:text-white cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        ) : mode === "success" ? (
          /* ================= SUCCESS VIEW ================= */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-3xl font-black mx-auto border border-green-500/40">
              ✓
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Profile Published!
            </h2>
            <p className="text-gray-300 font-sans max-w-md mx-auto text-sm">
              Your profile is now live on the Code Forge members directory. You can edit your details anytime from this browser.
            </p>
            <div className="pt-4">
              <button onClick={onClose} className="px-8 py-3 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 transition-colors cursor-pointer">
                View on Members Wall →
              </button>
            </div>
          </div>
        ) : (
          /* ================= MAIN PROFILE FORM ================= */
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 id="member-modal-title" className="text-2xl md:text-3xl font-black">
                  {mode === "edit" ? "Edit Member Profile" : "Register as a Member"}
                </h2>
                <p className="text-gray-400 text-sm mt-1 font-sans">
                  {mode === "edit"
                    ? "Update your bio, tech stack, projects, and contact handles."
                    : "Join the official Code Forge member directory using your NIAMT email."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {mode === "edit" ? (
                  <button 
                    type="button"
                    onClick={handleForgetDevice} 
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors cursor-pointer">
                    [ Switch Account ]
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setMode("lookup")} 
                    className="text-xs text-forge-yellow hover:underline cursor-pointer">
                    Already registered? Find profile →
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmitProfile} className="space-y-5">
              {/* Honeypot */}
              <input type="text" name="website" value={f.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="m-name">Full Name <Req /></Label>
                  <input id="m-name" required maxLength={80} value={f.name} onChange={set("name")} placeholder="e.g. Akash Kumar" className={input} />
                </div>
                <div>
                  <Label htmlFor="m-email">College Email ID <Req /></Label>
                  <input 
                    id="m-email" 
                    type="email" 
                    required 
                    disabled={mode === "edit"}
                    value={f.email} 
                    onChange={set("email")}
                    placeholder={`yourname@${COLLEGE_EMAIL_DOMAIN}`} 
                    aria-invalid={emailBad || undefined}
                    className={`${input} ${mode === "edit" ? "opacity-75 cursor-not-allowed" : ""} ${emailBad ? "border-red-500/70 focus:border-red-500" : ""}`} 
                  />
                  {emailBad ? (
                    <p className="text-xs text-red-400 mt-1">Must be an official @{COLLEGE_EMAIL_DOMAIN} address.</p>
                  ) : (
                    <p className="text-[11px] text-gray-500 mt-1">Must end with @{COLLEGE_EMAIL_DOMAIN}</p>
                  )}
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
                  <Label htmlFor="m-role">Role / Domain <Req /></Label>
                  <select id="m-role" required value={f.role} onChange={set("role")} className={`${input} font-bold text-forge-yellow`}>
                    {ROLES.map((r) => <option key={r} value={r} className="bg-forge-dark text-white">{r}</option>)}
                  </select>
                </div>

                <div>
                  <Label htmlFor="m-roll">Roll Number <span className="text-gray-500">(Optional)</span></Label>
                  <input id="m-roll" maxLength={20} value={f.roll} onChange={set("roll")} placeholder="e.g. 24/CE/089" className={input} />
                </div>

                <div>
                  <Label htmlFor="m-gh" extra={<span className="text-forge-yellow text-xs">(Auto-fetches photo!)</span>}>GitHub Username</Label>
                  <input id="m-gh" maxLength={39} value={f.github} onChange={set("github")} onBlur={onGithubBlur} placeholder="e.g. sky4infy" className={input} />
                </div>

                <div>
                  <Label htmlFor="m-photo">Profile Photo URL</Label>
                  <div className="flex items-center gap-3">
                    <Avatar name={f.name || "?"} src={f.photo || undefined} size="w-10 h-10" />
                    <input id="m-photo" type="url" value={f.photo} onChange={set("photo")} placeholder="https://… or auto-filled by GitHub" className={input} />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="m-bio">Bio / Summary <Req /></Label>
                  <textarea id="m-bio" required maxLength={280} rows={2} value={f.bio} onChange={set("bio")}
                    placeholder="e.g. 3rd year Computer Engineering student, passionate about Systems & Web Development." className={`${input} font-sans resize-y`} />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="m-stack">Tech Stack <span className="text-gray-500">(comma-separated)</span></Label>
                  <input id="m-stack" maxLength={200} value={f.stack} onChange={set("stack")} placeholder="e.g. React, Node.js, Python, PostgreSQL, Docker" className={input} />
                </div>
              </div>

              {/* Projects */}
              <div className="border-t border-white/10 pt-5">
                <p className="text-forge-yellow text-sm font-bold tracking-wider mb-4">▸ SHOWCASE PROJECTS (OPTIONAL)</p>
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

              {/* Socials */}
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

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 disabled:opacity-60 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer">
                {loading ? "Publishing Profile…" : mode === "edit" ? "[ Save Changes ]" : "[ Publish Profile Instantly ]"}
              </button>
              <p className="text-center text-xs text-gray-500">
                ⚡ Instant live publication: Your profile appears immediately on the Members page upon saving.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberRegisterModal;
