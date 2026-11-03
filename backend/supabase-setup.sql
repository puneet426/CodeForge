-- ============================================================
-- Code Forge NIAMT — Supabase Database Setup
-- Run this in your Supabase Project -> SQL Editor
-- ============================================================

-- 1. Create the members table
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    roll TEXT,
    batch TEXT NOT NULL, -- '2023-27', '2024-28', '2025-29', '2026-30'
    branch TEXT NOT NULL,
    github TEXT,
    photo TEXT,
    bio TEXT,
    role TEXT DEFAULT 'Member', -- e.g. 'Member', 'Developer', etc.
    community TEXT,
    stack TEXT[] DEFAULT '{}',
    projects JSONB DEFAULT '[]'::jsonb,
    github_url TEXT,
    linkedin TEXT,
    website TEXT,
    is_approved BOOLEAN DEFAULT true -- Instant live publication!
);

-- 2. Indexes for fast batch & email queries
CREATE INDEX IF NOT EXISTS idx_members_batch ON public.members(batch);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies:
-- Anyone can view member profiles (public directory)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.members;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.members FOR SELECT 
USING (true);

-- Allow students with @niamt.ac.in emails to register directly
DROP POLICY IF EXISTS "Students can register with verified niamt email" ON public.members;
DROP POLICY IF EXISTS "Students can register with niamt email" ON public.members;
CREATE POLICY "Students can register with niamt email" 
ON public.members FOR INSERT 
TO public
WITH CHECK (email ILIKE '%@niamt.ac.in');

-- Allow students to update their profile with their NIAMT email
DROP POLICY IF EXISTS "Students can update their own profile" ON public.members;
DROP POLICY IF EXISTS "Students can update profile with their niamt email" ON public.members;
CREATE POLICY "Students can update their own profile" 
ON public.members FOR UPDATE 
TO public
USING (email ILIKE '%@niamt.ac.in')
WITH CHECK (email ILIKE '%@niamt.ac.in');

-- 5. Auto-update timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_members_updated_at ON public.members;
CREATE TRIGGER set_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();
