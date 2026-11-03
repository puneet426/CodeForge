import React, { useEffect, useState } from 'react';
import { BATCHES, BRANCHES } from '../data/members';
import { Avatar } from './PersonCard';
import { 
  COLLEGE_EMAIL_DOMAIN,
  isCollegeEmail,
  isSupabaseConfigured,
  sendCollegeEmailOtp,
  verifyCollegeEmailOtp,
  getCurrentAuthUser,
  signOutOfCollegeAccount,
  fetchMemberByEmail,
  saveMemberProfile,
  getSavedLocalProfile,
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
  "Club Lead",
  "Vice Lead",
  "Web Development Lead",
  "AI / ML Lead",
  "Competitive Programming Lead",
  "Cybersecurity Lead",
  "Design & Media Lead",
  "Events Coordinator",
];

const MemberRegisterModal = ({ onClose, initialProfile = null }) => {
  // Step: 'check-auth' | 'request-otp' | 'verify-otp' | 'profile-form' | 'success'
  const [step, setStep] = useState('check-auth');
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [isExistingMember, setIsExistingMember] = useState(false);

  const [f, setF] = useState(EMPTY);
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const [loading, setLoading] = useState(false);

  // Check existing session on modal open
  useEffect(() => {
    let alive = true;
    async function checkAuth() {
      // 1. If Supabase is not configured yet (mock/local mode)
      if (!isSupabaseConfigured) {
        const local = initialProfile || getSavedLocalProfile();
        if (local) {
          populateForm(local);
          setVerifiedEmail(local.email);
          setIsExistingMember(true);
        }
        setStep('profile-form');
        return;
      }

      // 2. Check active Supabase authenticated session
      const user = await getCurrentAuthUser();
      if (!alive) return;

      if (user && user.email) {
        setVerifiedEmail(user.email);
        const memberData = await fetchMemberByEmail(user.email);
        if (memberData) {
          populateForm(memberData);
          setIsExistingMember(true);
        } else {
          setF(s => ({ ...s, email: user.email }));
          setIsExistingMember(false);
        }
        setStep('profile-form');
      } else {
        // Not authenticated: prompt college email OTP
        setStep('request-otp');
      }
    }

    checkAuth();
    return () => { alive = false; };
  }, [initialProfile]);

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

  const populateForm = (data) => {
    setF({
      name: data.name || "",
      email: data.email || "",
      roll: data.roll || "",
      batch: data.batch || BATCHES[1]?.id || BATCHES[0].id,
      branch: data.branch || BRANCHES[0],
      github: data.github || "",
      photo: data.photo || "",
      bio: data.bio || "",
      role: data.role || "Member",
      stack: Array.isArray(data.stack) ? data.stack.join(", ") : (data.stack || ""),
      projects: Array.isArray(data.projects) && data.projects.length 
        ? [
            data.projects[0] || { title: "", desc: "", url: "" },
            data.projects[1] || { title: "", desc: "", url: "" },
          ]
        : [{ title: "", desc: "", url: "" }, { title: "", desc: "", url: "" }],
      githubUrl: data.github_url || data.githubUrl || "",
      linkedin: data.linkedin || "",
      website: data.website || "",
    });
  };

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

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!isCollegeEmail(cleanEmail)) {
      setStatus({ state: "error", msg: `Only official college emails ending in @${COLLEGE_EMAIL_DOMAIN} are permitted.` });
      return;
    }

    setLoading(true);
    setStatus({ state: "idle", msg: "" });

    try {
      if (isSupabaseConfigured) {
        await sendCollegeEmailOtp(cleanEmail);
      }
      setVerifiedEmail(cleanEmail);
      setStep('verify-otp');
      setStatus({ state: "idle", msg: `Verification code sent to ${cleanEmail}. Please check your inbox.` });
    } catch (err) {
      setStatus({ state: "error", msg: err.message || "Failed to send verification code." });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      setStatus({ state: "error", msg: "Please enter the 6-digit OTP code." });
      return;
    }

    setLoading(true);
    setStatus({ state: "idle", msg: "" });

    try {
      if (isSupabaseConfigured) {
        await verifyCollegeEmailOtp(verifiedEmail, otpInput);
      }

      // Check if user already has an existing profile in Supabase
      const existing = await fetchMemberByEmail(verifiedEmail);
      if (existing) {
        populateForm(existing);
        setIsExistingMember(true);
      } else {
        setF(s => ({ ...s, email: verifiedEmail }));
        setIsExistingMember(false);
      }

      setStep('profile-form');
    } catch (err) {
      setStatus({ state: "error", msg: err.message || "Invalid OTP code. Please check and try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutOfCollegeAccount();
    setStep('request-otp');
    setF(EMPTY);
    setVerifiedEmail("");
    setIsExistingMember(false);
  };

  // Step 3: Save profile (instant publish, zero admin approval)
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const emailToUse = verifiedEmail || f.email;

    if (!isCollegeEmail(emailToUse)) {
      setStatus({ state: "error", msg: `Must use your verified @${COLLEGE_EMAIL_DOMAIN} email.` });
      return;
    }

    setLoading(true);
    setStatus({ state: "sending", msg: "Publishing your profile to the live directory…" });

    const payload = {
      ...f,
      email: emailToUse.trim().toLowerCase(),
      stack: typeof f.stack === 'string' ? f.stack.split(',').map(s => s.trim()).filter(Boolean) : f.stack,
      projects: f.projects.filter(p => p.title && p.title.trim()),
      is_lead: Boolean(f.role && f.role !== 'Member'),
      is_approved: true, // No admin approval required!
    };

    try {
      let saved = null;
      if (isSupabaseConfigured) {
        saved = await saveMemberProfile(payload);
      } else {
        saved = payload;
      }

      window.dispatchEvent(new CustomEvent('codeforge:profile-updated', { detail: saved }));
      setStep('success');
    } catch (err) {
      console.error(err);
      setStatus({ state: "error", msg: err.message || "Could not publish profile. Please try again." });
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

        {/* ================= STAGE 1: REQUEST OTP ================= */}
        {step === 'request-otp' && (
          <div className="py-4">
            <div className="inline-block px-3 py-1 mb-3 border border-forge-yellow/60 rounded-full bg-forge-yellow/10 text-forge-yellow text-xs font-bold tracking-widest">
              OFFICIAL NIAMT VERIFICATION
            </div>
            <h2 id="member-modal-title" className="text-2xl md:text-3xl font-black mb-2">
              Enter Your College Email
            </h2>
            <p className="text-gray-400 text-sm font-sans mb-6">
              Only verified NIAMT students can register or edit member profiles. We will send a 6-digit confirmation code directly to your student inbox.
            </p>

            <form onSubmit={handleRequestOtp} className="space-y-4 max-w-lg">
              <div>
                <Label htmlFor="req-email">College Email ID <Req /></Label>
                <input 
                  id="req-email"
                  type="email" 
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={`yourname@${COLLEGE_EMAIL_DOMAIN}`}
                  className={input}
                />
                <p className="text-xs text-gray-500 mt-1 font-mono">
                  Must end with @{COLLEGE_EMAIL_DOMAIN}
                </p>
              </div>

              {status.state === "error" && (
                <p className="text-xs text-red-400 font-bold">{status.msg}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-forge-yellow text-black font-black rounded-lg hover:bg-orange-400 disabled:opacity-50 transition-colors shadow-md">
                {loading ? "Sending Code…" : "Send Verification Code →"}
              </button>
            </form>
          </div>
        )}

        {/* ================= STAGE 2: VERIFY OTP ================= */}
        {step === 'verify-otp' && (
          <div className="py-4">
            <div className="inline-block px-3 py-1 mb-3 border border-forge-yellow/60 rounded-full bg-forge-yellow/10 text-forge-yellow text-xs font-bold tracking-widest">
              CHECK YOUR INBOX
            </div>
            <h2 id="member-modal-title" className="text-2xl md:text-3xl font-black mb-2">
              Enter 6-Digit OTP Code
            </h2>
            <p className="text-gray-400 text-sm font-sans mb-6">
              Sent to <span className="text-forge-yellow font-mono">{verifiedEmail}</span>. Enter the code below to verify your identity.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-lg">
              <div>
                <Label htmlFor="otp-input">6-Digit OTP Code <Req /></Label>
                <input 
                  id="otp-input"
                  type="text" 
                  required
                  maxLength={10}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  className={`${input} text-center tracking-widest text-lg font-bold font-mono`}
                />
              </div>

              {status.state === "error" && (
                <p className="text-xs text-red-400 font-bold">{status.msg}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-forge-yellow text-black font-black rounded-lg hover:bg-orange-400 disabled:opacity-50 transition-colors shadow-md">
                {loading ? "Verifying…" : "Verify & Continue →"}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button 
                  type="button" 
                  onClick={() => setStep('request-otp')} 
                  className="text-gray-400 hover:text-white">
                  ← Change Email
                </button>
                <button 
                  type="button" 
                  onClick={handleRequestOtp} 
                  className="text-forge-yellow hover:underline">
                  Resend Code
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STAGE 3: PROFILE FORM ================= */}
        {step === 'profile-form' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 id="member-modal-title" className="text-2xl md:text-3xl font-black">
                  {isExistingMember ? "Edit Member Profile" : "Register as a Member"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-400 font-mono">
                    Verified ID: {verifiedEmail || f.email}
                  </span>
                </div>
              </div>

              {verifiedEmail && (
                <button 
                  type="button"
                  onClick={handleSignOut} 
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors">
                  [ Sign Out ]
                </button>
              )}
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
                  <Label htmlFor="m-email">Verified College Email <Req /></Label>
                  <input 
                    id="m-email" 
                    type="email" 
                    required 
                    readOnly 
                    value={verifiedEmail || f.email} 
                    className={`${input} opacity-75 cursor-not-allowed border-green-500/40 bg-green-500/5`} 
                  />
                  <p className="text-[11px] text-green-400/80 mt-1">✓ Verified with official NIAMT email</p>
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
                  <Label htmlFor="m-role">Role in Club <Req /></Label>
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
                    placeholder="e.g. 3rd year CE student passionate about Full-Stack Systems & AI/ML." className={`${input} font-sans resize-y`} />
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
                {loading ? "Publishing Profile…" : isExistingMember ? "[ Save Changes ]" : "[ Publish Profile Instantly ]"}
              </button>
              <p className="text-center text-xs text-gray-500">
                ⚡ Live publication: Your profile appears immediately on the Members page upon saving.
              </p>
            </form>
          </div>
        )}

        {/* ================= STAGE 4: SUCCESS ================= */}
        {step === 'success' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-3xl font-black mx-auto border border-green-500/40">
              ✓
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Profile Published!
            </h2>
            <p className="text-gray-300 font-sans max-w-md mx-auto text-sm">
              Your profile is now live on the Code Forge members directory. You can edit your details anytime using your verified college ID.
            </p>
            <div className="pt-4">
              <button onClick={onClose} className="px-8 py-3 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 transition-colors">
                View on Members Wall →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberRegisterModal;
