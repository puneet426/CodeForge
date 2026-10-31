// Code Forge members, batch-wise (2023–27 onwards).
//
// Two sources are merged on the Members page:
//   1. The hand-written lists below (optional).
//   2. Self-registered members from the Google Sheet behind MEMBERS_API,
//      shown once a core-team member sets "Approved" to Yes in the sheet.
//      Setup: see backend/README.md.
//
// Each hand-written member: { name, branch, role?, community?, linkedin?, github? }
//   role      — e.g. "Lead · Software Development" (shown in orange)
//   github    — username only; their GitHub photo is used as the avatar
export const BATCHES = [
  { id: "2023-27", label: "2023 – 27", year: "Final year", members: [] },
  { id: "2024-28", label: "2024 – 28", year: "3rd year", members: [] },
  { id: "2025-29", label: "2025 – 29", year: "2nd year", members: [] },
  { id: "2026-30", label: "2026 – 30", year: "1st year", members: [] },
];

// Keep in sync with BRANCHES in backend/members-apps-script.gs.
export const BRANCHES = [
  "Computer Engineering (CE)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical Engineering (EE)",
  "Mechanical Engineering (ME)",
  "Manufacturing Engineering (MFE)",
  "Metallurgical & Materials Engineering (MME)",
  "Other",
];

// Only college addresses can register.
export const COLLEGE_EMAIL_DOMAIN = "niamt.ac.in";
export const isCollegeEmail = (email) =>
  new RegExp(`^[^\\s@]+@${COLLEGE_EMAIL_DOMAIN.replace(/\./g, "\\.")}$`, "i").test(email.trim());

// Web-app URL of the deployed Apps Script (ends in /exec). Can also be set
// with VITE_MEMBERS_API in a .env file / the Netlify dashboard.
export const MEMBERS_API = import.meta.env.VITE_MEMBERS_API || "";
