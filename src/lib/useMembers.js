import { useCallback, useEffect, useState } from 'react';
import { supabase, safeUrl } from './supabase';

// Approved members from Supabase (view `public_members`, which never
// includes email or roll number).
export const useMembers = () => {
  const [state, setState] = useState({ members: [], loading: Boolean(supabase), error: "" });

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from('public_members')
      .select('id, name, batch, branch, github, photo, bio, role, community, stack, projects, github_url, linkedin')
      .order('name');
    if (error) {
      console.error('Members fetch failed:', error.message);
      setState({ members: [], loading: false, error: "Couldn't load members right now." });
      return;
    }
    setState({
      loading: false, error: "",
      members: data.map((m) => {
        const github = m.github || (m.github_url?.match(/github\.com\/([A-Za-z0-9-]{1,39})\/?$/i) || [])[1] || undefined;
        return {
          id: m.id, name: m.name, batch: m.batch, branch: m.branch, role: m.role || undefined,
          community: m.community || undefined, bio: m.bio || undefined, github,
          linkedin: safeUrl(m.linkedin),
          avatar: safeUrl(m.photo) || (github ? `https://github.com/${github}.png?size=120` : undefined),
          stack: Array.isArray(m.stack) ? m.stack : [],
          projects: (Array.isArray(m.projects) ? m.projects : [])
            .filter((p) => p && p.title)
            .map((p) => ({ title: String(p.title), desc: p.desc ? String(p.desc) : "", url: safeUrl(p.url) })),
        };
      }),
    });
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
  useEffect(() => { load(); }, [load]);
  return state;
};
