import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

const LOCAL_STORAGE_KEY = 'codeforge_member_profile';

export const COLLEGE_EMAIL_DOMAIN = 'niamt.ac.in';
export const isCollegeEmail = (email = '') =>
  new RegExp(`^[^\\s@]+@${COLLEGE_EMAIL_DOMAIN.replace(/\\./g, '\\.')}$`, 'i').test(email.trim());

// Local profile cache for offline/instant UI feedback
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
// Authentication with NIAMT College Email
// -------------------------------------------------------------

// Send 6-digit OTP to college email
export const sendCollegeEmailOtp = async (email) => {
  if (!supabase) {
    throw new Error('Supabase is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!isCollegeEmail(cleanEmail)) {
    throw new Error(`Only official college emails ending in @${COLLEGE_EMAIL_DOMAIN} can register.`);
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error('sendCollegeEmailOtp error:', error);
    throw new Error(error.message || 'Failed to send OTP to college email.');
  }

  return data;
};

// Verify 6-digit OTP
export const verifyCollegeEmailOtp = async (email, token) => {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: token.trim(),
    type: 'email',
  });

  if (error) {
    console.error('verifyCollegeEmailOtp error:', error);
    throw new Error(error.message || 'Invalid or expired OTP. Please check and try again.');
  }

  return data; // contains session and user
};

// Get current signed-in user
export const getCurrentAuthUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Sign out
export const signOutOfCollegeAccount = async () => {
  if (supabase) {
    await supabase.auth.signOut();
  }
  setSavedLocalProfile(null);
  window.dispatchEvent(new CustomEvent('codeforge:profile-updated', { detail: null }));
};

// -------------------------------------------------------------
// Members Database Operations (Instant, No Admin Approval)
// -------------------------------------------------------------

// Fetch all members from public directory
export const fetchMembersFromSupabase = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .order('is_lead', { ascending: false })
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

// Save (insert or update) member profile
export const saveMemberProfile = async (payload) => {
  if (!supabase) {
    throw new Error('Supabase is not configured yet. Please configure .env');
  }

  const cleanEmail = payload.email.trim().toLowerCase();
  if (!isCollegeEmail(cleanEmail)) {
    throw new Error(`Only @${COLLEGE_EMAIL_DOMAIN} emails are allowed.`);
  }

  // Get authenticated user ID to link with profile
  const { data: { user } } = await supabase.auth.getUser();

  const record = {
    email: cleanEmail,
    user_id: user ? user.id : undefined,
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
    is_lead: Boolean(payload.is_lead || payload.isLead || (payload.role && payload.role.toLowerCase().includes('lead'))),
    is_approved: true, // Instant publication without admin approval
  };

  const { data, error } = await supabase
    .from('members')
    .upsert(record, { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    console.error('Supabase save error:', error);
    throw error;
  }

  setSavedLocalProfile(data);
  return data;
};
