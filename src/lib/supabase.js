import { createClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------
// Supabase keys come from environment variables (see .env.example and
// supabase/README.md). Both are safe to expose in the browser — data is
// protected by the Row Level Security rules in supabase/schema.sql.
// NEVER put the service_role key here.
// ---------------------------------------------------------------------
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// null when not configured: pages then fall back to the bundled data.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

// Only allow https links from the database into href/src attributes.
export const safeUrl = (u) => (typeof u === 'string' && /^https:\/\//i.test(u.trim()) ? u.trim() : undefined);
