import { useEffect, useState } from 'react';
import { supabase, safeUrl } from './supabase';
import { alumni as bundled } from '../data/alumni';

// Alumni from Supabase (table `alumni`). Falls back to the bundled list in
// src/data/alumni.js when Supabase isn't configured or can't be reached, so
// the page is never empty.
export const useAlumni = () => {
  const [list, setList] = useState(bundled);
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.from('alumni').select('name, role, company, sector, linkedin, category')
      .order('sort_order').order('name')
      .then(({ data, error }) => {
        if (error) { console.error('Alumni fetch failed:', error.message); return; }
        if (alive && data?.length) {
          setList(data.map((a) => ({ ...a, linkedin: safeUrl(a.linkedin), group: a.category })));
        }
      });
    return () => { alive = false; };
  }, []);
  return list;
};
