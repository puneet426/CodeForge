// Shared form styles + auth error text for the login, registration and admin forms.
export const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-forge-yellow transition-colors";
export const btnCls = "w-full py-3.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 disabled:opacity-60 transition-colors";

export const friendlyAuthError = (msg = "") => {
  if (/rate limit|too many|security purposes/i.test(msg)) return "Too many attempts. Please wait a few minutes and try again.";
  if (/expired|invalid/i.test(msg) && /token|otp|code/i.test(msg)) return "That code is wrong or has expired. Request a new one.";
  if (/fetch/i.test(msg)) return "Couldn't reach the server. Check your connection and try again.";
  return msg || "Something went wrong. Please try again.";
};

