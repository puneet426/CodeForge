import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { inputCls, btnCls, friendlyAuthError } from '../lib/formUi';

// Email → one-time code sign-in (Supabase Auth). When the code is verified,
// Supabase fires SIGNED_IN; the parent listens with onAuthStateChange.
//   allowEmail(email) → error message string, or "" if the email is allowed.

export const ErrorMsg = ({ msg }) => (msg ? <p role="alert" className="text-sm text-red-400 font-bold">{msg}</p> : null);

const EmailCodeLogin = ({ intro, placeholder = "you@example.com", allowEmail = () => "", redirectPath = "/" }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const clean = email.trim().toLowerCase();
  const emailProblem = email ? allowEmail(clean) : "";

  const sendCode = async (e) => {
    e?.preventDefault();
    setErr("");
    const problem = allowEmail(clean);
    if (problem) { setErr(problem); return; }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}${redirectPath}` },
    });
    setBusy(false);
    if (error) { setErr(friendlyAuthError(error.message)); return; }
    setCode(""); setStep("code");
  };

  const verify = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    const { error } = await supabase.auth.verifyOtp({ email: clean, token: code.trim(), type: "email" });
    setBusy(false);
    if (error) setErr(friendlyAuthError(error.message));
  };

  if (step === "email") {
    return (
      <form onSubmit={sendCode} className="mt-5 space-y-4">
        {intro && <p className="text-gray-400 text-sm font-sans">{intro}</p>}
        <div>
          <label htmlFor="login-email" className="block text-sm text-gray-300 mb-1.5">Email <span className="text-forge-yellow">*</span></label>
          <input id="login-email" type="email" required autoFocus autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder} aria-invalid={Boolean(emailProblem) || undefined}
            className={`${inputCls} ${emailProblem ? "border-red-500/70 focus:border-red-500" : ""}`} />
          {emailProblem && <p className="text-xs text-red-400 mt-1">{emailProblem}</p>}
        </div>
        <ErrorMsg msg={err} />
        <button type="submit" disabled={busy} className={btnCls}>{busy ? "Sending…" : "Send code"}</button>
      </form>
    );
  }

  return (
    <form onSubmit={verify} className="mt-5 space-y-4">
      <p className="text-gray-400 text-sm font-sans">
        We sent a code to <span className="text-white font-mono">{clean}</span>. Check your inbox (and spam).
      </p>
      <div>
        <label htmlFor="login-code" className="block text-sm text-gray-300 mb-1.5">Verification code <span className="text-forge-yellow">*</span></label>
        <input id="login-code" required autoFocus inputMode="numeric" autoComplete="one-time-code" maxLength={10}
          value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="123456"
          className={`${inputCls} text-center text-xl tracking-[0.4em]`} />
      </div>
      <ErrorMsg msg={err} />
      <button type="submit" disabled={busy || code.length < 6} className={btnCls}>{busy ? "Verifying…" : "Verify"}</button>
      <div className="flex justify-between text-xs">
        <button type="button" onClick={() => { setErr(""); setStep("email"); }} className="text-gray-400 hover:text-white">← Change email</button>
        <button type="button" onClick={sendCode} disabled={busy} className="text-forge-yellow hover:underline">Resend code</button>
      </div>
    </form>
  );
};

export default EmailCodeLogin;
