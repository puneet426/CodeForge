// Member settings. The members themselves live in Supabase (table `members`):
// students register on /members, the core team approves them in the
// Supabase Table Editor. See supabase/README.md.

// Batch tabs on the Members page and options in the registration form.
// Add next year's batch here (id format "YYYY-YY").
export const BATCHES = [
  { id: "2023-27", label: "2023 – 27", year: "Final year" },
  { id: "2024-28", label: "2024 – 28", year: "3rd year" },
  { id: "2025-29", label: "2025 – 29", year: "2nd year" },
  { id: "2026-30", label: "2026 – 30", year: "1st year" },
];

export const BRANCHES = [
  "Computer Engineering (CE)",
  "Mechanical Engineering (ME)",
  "Metallurgical & Materials Engineering (MME)",
  "Production & Industrial Engineering (PIE)",
];

// Only college addresses can register (also enforced in supabase/schema.sql).
export const COLLEGE_EMAIL_DOMAIN = "niamt.ac.in";
export const isCollegeEmail = (email) =>
  new RegExp(`^[^\\s@]+@${COLLEGE_EMAIL_DOMAIN.replace(/\./g, "\\.")}$`, "i").test(email.trim());
