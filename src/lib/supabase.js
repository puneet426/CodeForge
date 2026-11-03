import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const LOCAL_STORAGE_KEY = 'codeforge_member_profile';

export const COLLEGE_EMAIL_DOMAIN = 'niamt.ac.in';
export const isCollegeEmail = (email = '') =>
  new RegExp(`^[^\\s@]+@${COLLEGE_EMAIL_DOMAIN.replace(/\\./g, '\\.')}$`, 'i').test(email.trim());

// Local profile cache for instant loading & editing on this device
export const getSavedLocalProfile = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Error reading local profile:', err);
    return null;
  }
};

export const setSavedLocalProfile = (profile) => {
  try {
    if (!profile) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    }
  } catch (err) {
    console.error('Error saving local profile:', err);
  }
};

// -------------------------------------------------------------
// Direct Members Database Operations (Instant, Zero Email Limits)
// -------------------------------------------------------------

// Fetch all members from Supabase
export const fetchMembersFromSupabase = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Supabase fetchMembers error:', error);
    throw error;
  }
  return data || [];
};

// Fetch a single member by their college email
export const fetchMemberByEmail = async (email) => {
  if (!supabase || !email) return null;
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .ilike('email', cleanEmail)
    .maybeSingle();

  if (error) {
    console.error('fetchMemberByEmail error:', error);
    return null;
  }
  return data;
};

// Save (insert or update) member profile directly into Supabase
export const saveMemberProfile = async (payload) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check your .env file.');
  }

  const cleanEmail = payload.email.trim().toLowerCase();
  if (!isCollegeEmail(cleanEmail)) {
    throw new Error(`Only official college emails ending in @${COLLEGE_EMAIL_DOMAIN} can register.`);
  }

  const record = {
    email: cleanEmail,
    name: payload.name.trim(),
    roll: payload.roll?.trim() || null,
    batch: payload.batch,
    branch: payload.branch,
    github: payload.github?.trim() || null,
    photo: payload.photo?.trim() || (payload.github ? `https://github.com/${payload.github.trim()}.png?size=200` : null),
    bio: payload.bio?.trim(),
    role: payload.role?.trim() || 'Member',
    community: payload.community?.trim() || null,
    stack: Array.isArray(payload.stack) 
      ? payload.stack 
      : (typeof payload.stack === 'string' ? payload.stack.split(',').map(s => s.trim()).filter(Boolean) : []),
    projects: Array.isArray(payload.projects) ? payload.projects.filter(p => p.title?.trim()) : [],
    github_url: payload.githubUrl || (payload.github ? `https://github.com/${payload.github.trim()}` : null),
    linkedin: payload.linkedin?.trim() || null,
    website: payload.website?.trim() || null,
    is_approved: true, // Instant publication!
  };

  const { data, error } = await supabase
    .from('members')
    .upsert(record, { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    console.error('Supabase save error:', error);
    throw new Error(error.message || 'Could not save profile to database.');
  }

  setSavedLocalProfile(data);
  return data;
};
