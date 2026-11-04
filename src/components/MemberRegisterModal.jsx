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
  "Developer",
  "Designer",
  "Competitive Programmer",
  "ML Engineer",
  "Open Source Contributor",
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

  // Check active Supabase authenticated session on mount
  useEffect(() => {
    let alive = true;
    async function checkAuth() {
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

      const user = await getCurrentAuthUser();
      if (!alive) return;

      if (user && user.email) {
        await handleAuthenticatedUser(user.email);
      } else {
        const local = initialProfile || getSavedLocalProfile();
        if (local && local.email) {
          setEmailInput(local.email);
        }
        setStep('request-otp');
      }
    }

    checkAuth();
    return () => { alive = false; };
  }, []);

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

  const handleAuthenticatedUser = async (email) => {
    setVerifiedEmail(email);
    const memberData = await fetchMemberByEmail(email);
    if (memberData) {
      populateForm(memberData);
      setIsExistingMember(true);
    } else {
      const local = getSavedLocalProfile();
      if (local && local.email?.toLowerCase() === email.toLowerCase()) {
        populateForm(local);
      } else {
        setF(s => ({ ...s, email }));
      }
      setIsExistingMember(false);
    }
    setStep('profile-form');
  };

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

  // Step 1: Send OTP to College Email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = (emailInput || verifiedEmail).trim().toLowerCase();

    if (!cleanEmail) {
      setStatus({ state: "error", msg: "Please enter your NIAMT college email." });
      return;
    }

    if (!isCollegeEmail(cleanEmail)) {
      setStatus({ 
        state: "error", 
        msg: `Please enter a valid student email ending in @${COLLEGE_EMAIL_DOMAIN} (e.g. ce4052024@niamt.ac.in).` 
      });
      return;
    }

    setLoading(true);
    setStatus({ state: "sending", msg: "Sending verification code to your college email…" });

    try {
      await sendCollegeEmailOtp(cleanEmail);
      setVerifiedEmail(cleanEmail);
      setStep('verify-otp');
      setStatus({ 
        state: "idle", 
        msg: `Verification code sent to ${cleanEmail}. Please check your inbox (and spam/junk folder).` 
      });
    } catch (err) {
      console.error(err);
      setStatus({ 
        state: "error", 
        msg: err.message || "Failed to send verification code. Please check your Brevo SMTP settings in Supabase." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const token = otpInput.trim();

    if (!token || token.length < 6) {
      setStatus({ state: "error", msg: "Please enter the complete 6-digit code from your email." });
      return;
    }

    setLoading(true);
    setStatus({ state: "sending", msg: "Verifying code…" });

    try {
      await verifyCollegeEmailOtp(verifiedEmail, token);
      setStatus({ state: "idle", msg: "" });
      await handleAuthenticatedUser(verifiedEmail);
    } catch (err) {
      console.error(err);
      setStatus({ state: "error", msg: err.message || "Invalid or expired code. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Switch account / Sign out
  const handleSignOut = async () => {
    await signOutOfCollegeAccount();
    setVerifiedEmail("");
    setOtpInput("");
    setF(EMPTY);
    setStep('request-otp');
    setStatus({ state: "idle", msg: "" });
  };

  // Step 3: Publish / Update Profile
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ state: "sending", msg: "Publishing profile to directory…" });

    const payload = {
      ...f,
      email: verifiedEmail || f.email,
      stack: typeof f.stack === 'string' ? f.stack.split(',').map(s => s.trim()).filter(Boolean) : f.stack,
      projects: f.projects.filter(p => p.title && p.title.trim()),
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
      setStatus({ 
        state: "error", 
        msg: err.message || "Could not publish profile. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 md:p-8 flex justify-center items-start">
      <div className="relative w-full max-w-2xl bg-[#141414] border border-white/20 rounded-2xl p-6 md:p-8 my-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-gray-400 hover:text-white text-xl font-bold p-1 cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* ================= STAGE 0: CHECKING AUTH ================= */}
        {step === 'check-auth' && (
          <div className="py-12 text-center text-gray-400">
            <div className="animate-spin inline-block w-8 h-8 border-2 border-forge-yellow border-t-transparent rounded-full mb-3" />
            <p className="text-sm font-sans">Connecting to NIAMT verification system…</p>
          </div>
        )}

        {/* ================= STAGE 1: REQUEST OTP ================= */}
        {step === 'request-otp' && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-forge-yellow/10 text-forge-yellow border border-forge-yellow/20 mb-3">
                OFFICIAL NIAMT EMAIL VERIFICATION
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Verify Your College Email
              </h2>
              <p className="text-gray-400 text-sm mt-1 font-sans">
                Enter your official student email. We will send a secure 6-digit verification code directly to your inbox.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="req-email">College Email ID <Req /></Label>
                <input
                  id="req-email"
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. ce4052024@niamt.ac.in"
                  className={input}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  Only verified <code className="text-forge-yellow">@niamt.ac.in</code> emails are permitted.
                </p>
              </div>

              {status.state === "error" && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 disabled:opacity-60 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer"
              >
                {loading ? "Sending Code…" : "Send Verification Code →"}
              </button>
            </form>
          </div>
        )}

        {/* ================= STAGE 2: ENTER OTP ================= */}
        {step === 'verify-otp' && (
          <div className="space-y-6">
            <div>
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-green-500/10 text-green-400 border border-green-500/20 mb-3">
                CODE SENT
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Enter Verification Code
              </h2>
              <p className="text-gray-400 text-sm mt-1 font-sans">
                We sent a 6-digit code to <strong className="text-white">{verifiedEmail}</strong>. Check your inbox (or spam folder).
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp-box">6-Digit Verification Code <Req /></Label>
                <input
                  id="otp-box"
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-center text-3xl font-mono tracking-[0.5em] text-white focus:outline-none focus:border-forge-yellow"
                  disabled={loading}
                />
              </div>

              {status.state === "error" && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 disabled:opacity-60 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] cursor-pointer"
              >
                {loading ? "Verifying…" : "Verify & Continue →"}
              </button>

              <div className="flex justify-between items-center text-xs text-gray-400 pt-2 font-sans">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="hover:text-forge-yellow underline cursor-pointer"
                >
                  Didn't get code? Resend
                </button>
                <button
                  type="button"
                  onClick={() => setStep('request-otp')}
                  className="hover:text-white cursor-pointer"
                >
                  Change email address
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STAGE 3: PROFILE FORM ================= */}
        {step === 'profile-form' && (
          <div>
            <div className="mb-6 pr-10">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                  ✓ VERIFIED STUDENT
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {verifiedEmail || f.email}
                </span>
                <span className="text-gray-600">·</span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs text-gray-400 hover:text-red-400 cursor-pointer underline font-sans transition-colors"
                >
                  Sign out
                </button>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                {isExistingMember ? "Edit Your Profile" : "Create Member Profile"}
              </h2>
              <p className="text-gray-400 text-sm mt-1 font-sans">
                {isExistingMember 
                  ? "Update your stack, projects, and bio. Changes publish immediately." 
                  : "Fill in your details to be featured in the official NIAMT Code Forge directory."}
              </p>
            </div>

            <form onSubmit={handleSubmitProfile} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="m-name">Full Name <Req /></Label>
                  <input id="m-name" required maxLength={60} value={f.name} onChange={set("name")} placeholder="Akash Kumar" className={input} />
                </div>

                <div>
                  <Label htmlFor="m-email">College Email (Locked)</Label>
                  <input id="m-email" disabled value={verifiedEmail || f.email} className={`${input} opacity-60 cursor-not-allowed`} />
                </div>

                <div>
                  <Label htmlFor="m-roll">Roll Number <span className="text-gray-500">(optional)</span></Label>
                  <input id="m-roll" maxLength={20} value={f.roll} onChange={set("roll")} placeholder="e.g. 405" className={input} />
                </div>

                <div>
                  <Label htmlFor="m-batch">Batch <Req /></Label>
                  <select id="m-batch" value={f.batch} onChange={set("batch")} className={input}>
                    {BATCHES.map((b) => <option key={b.id} value={b.id} className="bg-forge-dark">{b.label}</option>)}
                  </select>
                </div>

                <div>
                  <Label htmlFor="m-branch">Branch <Req /></Label>
                  <select id="m-branch" value={f.branch} onChange={set("branch")} className={input}>
                    {BRANCHES.map((b) => <option key={b} value={b} className="bg-forge-dark">{b}</option>)}
                  </select>
                </div>

                <div>
                  <Label htmlFor="m-role">Role in Tech <Req /></Label>
                  <select id="m-role" value={f.role} onChange={set("role")} className={input}>
                    {ROLES.map((r) => <option key={r} value={r} className="bg-forge-dark">{r}</option>)}
                  </select>
                </div>

                <div>
                  <Label htmlFor="m-gh">GitHub Username</Label>
                  <input id="m-gh" maxLength={39} value={f.github} onChange={set("github")} onBlur={onGithubBlur} placeholder="username (without @)" className={input} />
                </div>

                <div>
                  <Label htmlFor="m-photo">Avatar URL</Label>
                  <div className="flex gap-2">
                    <Avatar name={f.name || "Preview"} src={f.photo} size="w-10 h-10" />
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
                {loading ? "Publishing Profile…" : isExistingMember ? "[ Save Changes ]" : "[ Publish Profile Instantly ]"}
              </button>
              <p className="text-center text-xs text-gray-500">
                ⚡ Instant publish: Your profile will appear immediately on the Members page upon saving.
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
              <button onClick={onClose} className="px-8 py-3 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 transition-colors cursor-pointer">
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
