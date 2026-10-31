# Supabase backend

The website uses Supabase for two things:

| Table | What it holds | Who writes it |
|---|---|---|
| `members` | Current students' profiles | Students, after verifying their `@niamt.ac.in` email. The core team approves them. |
| `alumni` | The alumni network (113 people, loaded from `src/data/alumni.js`) | The core team, in the Supabase Table Editor |

The website only ever sees **approved** members, through the `public_members`
view, which leaves out email and roll number.

---

## 1. Create the project

1. Go to <https://supabase.com>, sign in (use the club account), and click **New project**.
2. Name it `codeforge`, choose a strong database password (save it), region **Mumbai (ap-south-1)**.

## 2. Create the tables and load the existing data

In the Supabase dashboard open **SQL Editor → New query**, then:

1. Paste all of [`schema.sql`](./schema.sql) → **Run**.
2. New query → paste all of [`seed.sql`](./seed.sql) → **Run**. This loads the existing 113 alumni.

Check **Table Editor**: you should see `members` (empty) and `alumni` (113 rows).

## 3. Set up email login (needed for the registration code)

**a. Send emails from your own address (required).**
Supabase's built-in email only delivers to your own team's addresses and only
a few per hour, so students won't receive codes until you add SMTP.
**Authentication → Emails → SMTP Settings → Enable custom SMTP.** For example, with the
club Gmail:

| Field | Value |
|---|---|
| Sender email | `codeforgeniamt@gmail.com` |
| Sender name | `Code Forge` |
| Host | `smtp.gmail.com` |
| Port | `587` |
| Username | `codeforgeniamt@gmail.com` |
| Password | a Gmail **App Password** (Google Account → Security → 2-Step Verification → App passwords) |

(Brevo, Resend or any other SMTP service also works.)

**b. Put the code in the emails.**
**Authentication → Emails → Templates.** In both **Magic Link** and
**Confirm signup**, add this line to the message body:

```html
<p>Your Code Forge verification code: <strong>{{ .Token }}</strong></p>
```

**c. Allow the website's address.**
**Authentication → URL Configuration**:
- Site URL: your live site, e.g. `https://codeforgeniamt.netlify.app`
- Redirect URLs: add `https://codeforgeniamt.netlify.app/members` and `http://localhost:5173/members`

## 4. Where to add the API keys

Get them from **Project Settings → API** (or **API Keys**):

| Supabase shows | Put it in |
|---|---|
| **Project URL** (`https://xxxx.supabase.co`) | `VITE_SUPABASE_URL` |
| **anon / public** key (or the **publishable** key, `sb_publishable_…`) | `VITE_SUPABASE_ANON_KEY` |

**Live site (Netlify):** Site configuration → **Environment variables** → add both
variables → **Deploys → Trigger deploy** (variables are read at build time).

**On your computer:** copy `.env.example` to `.env.local`, fill in the two
values, and run `npm run dev`. `.env.local` is git-ignored, so the keys
are never committed.

> ⚠️ Never use the **service_role** / **secret** key in the website. It bypasses
> all security rules.

Both keys above are meant to be public. The security rules in `schema.sql`
protect the data: anyone can read approved members and alumni, and students
can only create or edit their **own** profile, after proving they own a
`@niamt.ac.in` address.

## 5. Approving members (core team)

**Table Editor → members**:
- New and edited profiles have `approved = false`. Check the name and email, then tick **approved** and save. The profile appears on the website straight away.
- To hide someone, untick **approved**. To remove them, delete the row.
- When a student edits their profile, it automatically goes back to `false` for review.
- To add a member by hand (no login), insert a row with `name`, `batch` (e.g. `2024-28`), `branch`, and `approved` ticked.

## 6. Editing alumni

**Table Editor → alumni**: add, edit or delete rows. `category` is `leaders`
or `tech`; `sort_order` controls the order (lower comes first).
If Supabase is unreachable, the site falls back to the list in `src/data/alumni.js`.

## Each new academic year

Add the new batch to `BATCHES` in `src/data/members.js` (e.g. `2027-31`) and update the year labels.
