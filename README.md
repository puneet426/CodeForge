# Code Forge NIAMT — website

The official website of **<Code/Forge>**, the coding club of NIAMT Ranchi. Built with React 19, Vite, Tailwind CSS v4 and React Router, deployed on Netlify (forms for contact and event registration).

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in /dist
```

## Where things live

| What | File |
| --- | --- |
| All events (upcoming + past) | `/admin` → Events (fallback copy: `src/data/events.js`) |
| Links, stats, communities preview, FAQ, gallery | `src/data/site.js` |
| Home page | `src/components/HeroSection.jsx` |
| Events page | `src/pages/EventsSection.jsx` |
| Gallery page | `src/pages/Gallery.jsx` |
| Community details & heads | `src/pages/Communities.jsx` |
| Advisors | `src/pages/About.jsx` |
| Hero background video, trailer, posters | `public/media/` |
| Event posters | `public/events/<slug>/` |
| Gallery photos | `public/gallery/` |
| **Database (Supabase): members, events, leaderboard, alumni, admins** | `supabase/` — setup guide in [`supabase/README.md`](supabase/README.md) |
| Admin panel (hidden, `/admin`, 5 leads only) | `src/pages/Admin.jsx`, `src/admin/` |
| Supabase connection | `src/lib/supabase.js` (keys from `.env.local` / Netlify env vars) |
| Batches, branches, college email domain | `src/data/members.js` |
| Member registration form | `src/components/MemberRegisterModal.jsx` |

## Backend (Supabase) — where to add the API keys

Members, events, the leaderboard and alumni are stored in Supabase and managed by the 5 leads at `/admin`. The site needs two environment variables
(from Supabase → Project Settings → API):

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

- **Live site:** Netlify → Site configuration → Environment variables, then redeploy.
- **Local:** copy `.env.example` to `.env.local` and fill them in.

Full setup (tables, existing data, email codes, approving members): [`supabase/README.md`](supabase/README.md).

## Adding an event

> With Supabase set up, add events from **`/admin` → Events** instead (no code or redeploy needed). The steps below edit the fallback copy.

1. Put the poster in `public/events/<slug>/01.webp` (or .jpg/.png). Keep it under ~300 KB.
2. Add a block to `src/data/events.js`:

```js
{
  slug: "hackathon-2027",
  title: "Forge Hackathon 2027",
  category: "Hackathon",            // Workshop | Session | Competition | Hackathon | Induction | Community
  start: "2027-02-14T10:00:00+05:30",
  end:   "2027-02-15T18:00:00+05:30", // optional, for multi-day events
  dateLabel: "14 – 15 Feb 2027",
  time: "10:00 AM",
  venue: "ITnC Lab",
  banner: "/events/hackathon-2027/01.webp",
  registration: true,               // shows "Register Now" (Netlify form)
  description: "…",
  highlights: ["…", "…"],
  gallery: ["/events/hackathon-2027/02.webp"],  // optional photos in the details popup
},
```

An event shows under **Upcoming** (with a live countdown on the home page) until it ends, then moves to **Past Events** automatically, so you never have to move it by hand.

## Media tips

- Hero background: `public/media/hero-loop.mp4`. Keep it short, silent and 720p (≈1–2 MB).
- Re-encode videos with `ffmpeg -i in.mp4 -vf scale=1280:-2 -c:v libx264 -crf 27 -movflags +faststart out.mp4`.
- Convert photos to WebP (≈1200–1400 px wide) before adding them.
