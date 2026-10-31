// What each /admin tab edits. Field types:
//   text | textarea | url | number | select | bool | datetime
//   list  (one item per line, or `sep: ","`) | json | image (URL + upload)
// `empty: ""` stores an empty string instead of null (for NOT NULL columns).
import { BATCHES, BRANCHES } from '../data/members';
import { CATEGORIES } from '../data/events';

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) : '');

export const RESOURCES = [
  {
    id: 'members', label: 'Members', table: 'members',
    order: ['created_at', { ascending: false }],
    toggle: { key: 'approved', on: 'Approved', off: 'Pending' },
    filters: [{ id: 'pending', label: 'Pending', test: (r) => !r.approved }, { id: 'all', label: 'All', test: () => true }],
    title: (r) => r.name,
    subtitle: (r) => [r.batch, r.branch, r.email || 'added by admin'].filter(Boolean).join(' · '),
    search: (r) => `${r.name} ${r.email} ${r.branch} ${r.batch} ${r.role}`,
    blank: { batch: BATCHES[0].id, branch: BRANCHES[0], approved: true },
    fields: [
      { key: 'name', label: 'Full name', type: 'text', required: true },
      { key: 'batch', label: 'Batch', type: 'select', options: BATCHES.map((b) => b.id), required: true },
      { key: 'branch', label: 'Branch', type: 'select', options: BRANCHES, required: true },
      { key: 'role', label: 'Club role / company', type: 'text' },
      { key: 'community', label: 'Community', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
      { key: 'github', label: 'GitHub username', type: 'text' },
      { key: 'photo', label: 'Photo URL', type: 'url' },
      { key: 'github_url', label: 'GitHub profile URL', type: 'url' },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { key: 'stack', label: 'Tech stack (comma-separated)', type: 'list', sep: ',' },
      { key: 'approved', label: 'Approved (shown on website)', type: 'bool' },
    ],
  },
  {
    id: 'events', label: 'Events', table: 'events',
    order: ['start_at', { ascending: false }],
    title: (r) => r.title,
    subtitle: (r) => `${fmtDate(r.start_at)} · ${r.category}${r.venue ? ` · ${r.venue}` : ''}`,
    search: (r) => `${r.title} ${r.slug} ${r.category} ${r.venue}`,
    blank: { category: 'Session', featured: false, registration: false },
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'slug', label: 'Slug (unique, lowercase-with-dashes)', type: 'text', required: true, pattern: '^[a-z0-9-]+$' },
      { key: 'category', label: 'Category', type: 'select', options: CATEGORIES.filter((c) => c !== 'All'), required: true },
      { key: 'start_at', label: 'Starts', type: 'datetime', required: true },
      { key: 'end_at', label: 'Ends (optional, multi-day)', type: 'datetime' },
      { key: 'date_label', label: 'Date label (blank = auto, e.g. "20 Nov 2026")', type: 'text' },
      { key: 'time_label', label: 'Time label (blank = auto, e.g. "4:00 PM")', type: 'text' },
      { key: 'venue', label: 'Venue', type: 'text' },
      { key: 'collab', label: 'In collaboration with', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'banner', label: 'Poster', type: 'image', folder: 'events' },
      { key: 'trailer', label: 'Trailer video URL', type: 'text' },
      { key: 'featured', label: 'Featured', type: 'bool' },
      { key: 'registration', label: 'Show "Register" button', type: 'bool' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'highlights', label: 'Highlights (one per line)', type: 'list' },
      { key: 'gallery', label: 'Gallery image URLs (one per line)', type: 'list' },
      { key: 'gallery_title', label: 'Gallery title', type: 'text' },
      { key: 'sessions', label: 'Sessions (JSON: [{"day","title","date","venue","note"}])', type: 'json' },
    ],
  },
  {
    id: 'leaderboard', label: 'Leaderboard', table: 'leaderboard',
    order: ['score', { ascending: false }],
    csvImport: true,
    title: (r) => r.name,
    subtitle: (r) => `${Number(r.score)} pts${r.github ? ` · @${r.github}` : ''}`,
    search: (r) => `${r.name} ${r.github}`,
    blank: { score: 0 },
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'github', label: 'GitHub username', type: 'text' },
      { key: 'score', label: 'Total score', type: 'number', required: true },
    ],
  },
  {
    id: 'alumni', label: 'Alumni', table: 'alumni',
    order: ['sort_order', { ascending: true }],
    title: (r) => r.name,
    subtitle: (r) => [r.role, r.company, r.category].filter(Boolean).join(' · '),
    search: (r) => `${r.name} ${r.role} ${r.company} ${r.sector}`,
    blank: { category: 'tech', sort_order: 1000 },
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'role', label: 'Role', type: 'text', empty: '' },
      { key: 'company', label: 'Company', type: 'text', empty: '' },
      { key: 'sector', label: 'Sector', type: 'text', empty: '' },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'url' },
      { key: 'category', label: 'Group', type: 'select', options: ['leaders', 'tech'], required: true },
      { key: 'sort_order', label: 'Order (lower = first)', type: 'number', empty: 1000 },
    ],
  },
];
