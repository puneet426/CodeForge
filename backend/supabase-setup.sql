-- ============================================================
-- Code Forge NIAMT — Supabase Database Setup
-- Run this in your Supabase Project -> SQL Editor
-- ============================================================

-- 1. Create the members table linked to authenticated users
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
    role TEXT DEFAULT 'Member', -- e.g. 'Club Lead', 'Web Lead', 'Member'
    community TEXT,
    stack TEXT[] DEFAULT '{}',
    projects JSONB DEFAULT '[]'::jsonb,
    github_url TEXT,
    linkedin TEXT,
    website TEXT,
    is_lead BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true -- Instant publication! No admin approval required.
);

-- 2. Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_members_batch ON public.members(batch);
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies:
-- Anyone can view member profiles (public directory)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.members;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.members FOR SELECT 
USING (true);

-- Authenticated students can register their own profile with their verified NIAMT email
DROP POLICY IF EXISTS "Students can register with niamt email" ON public.members;
CREATE POLICY "Students can register with verified niamt email" 
ON public.members FOR INSERT 
TO authenticated
WITH CHECK (
    email ILIKE '%@niamt.ac.in' 
    AND (auth.uid() = user_id OR auth.jwt() ->> 'email' = email)
);

-- Authenticated students can edit and save changes to their own profile
DROP POLICY IF EXISTS "Students can update profile with their niamt email" ON public.members;
CREATE POLICY "Students can update their own profile" 
ON public.members FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = email)
WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'email' = email);

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
