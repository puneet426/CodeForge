# Supabase backend

Everything the website shows comes from Supabase:

| Table | What it holds | Who can change it |
|---|---|---|
| `members` | Current students' profiles | Students edit **their own** (after verifying their `@niamt.ac.in` email). Admins approve / edit / delete. |
| `events` | All upcoming + past events (21 loaded from `src/data/events.js`) | Admins |
| `leaderboard` | Leaderboard scores | Admins (with CSV import from the old Google Sheet) |
| `alumni` | Alumni network (113 loaded from `src/data/alumni.js`) | Admins |
| `admins` | The **5 leads** who can use `/admin` | Only from the Supabase dashboard |

Admins manage everything at **`/admin`** on the website (e.g.
`https://codeforgeniamt.netlify.app/admin`). The page isn't linked anywhere on the site.
Anyone who opens it only sees an email-code login. Only the 5 emails in
the `admins` table get controls after verifying. The database enforces
this itself, so even someone who calls the API directly can't change anything
unless they're one of the 5. A 6th admin is refused.

---

## 1. Create the project

1. Go to <https://supabase.com>, sign in with the club account, **New project**.
2. Name `codeforge`, strong database password (save it), region **Mumbai (ap-south-1)**.

## 2. Create the tables and load the data

**SQL Editor → New query**, paste each file and click **Run**, in this order:

1. [`schema.sql`](./schema.sql): tables, security rules, image storage bucket
2. [`seed.sql`](./seed.sql): existing 113 alumni + 21 events
3. [`admins.sql`](./admins.sql): the 5 leads:
   `ce4272023@niamt.ac.in`, `ce40520224@gmail.com`, `ce4222024@niamt.ac.in`,
   `ce4352024@niamt.ac.in`, `ce4302024@niamt.ac.in`

Check **Table Editor**: `alumni` 113 rows, `events` 21, `admins` 5.
All three files are safe to run again.

## 3. Email login (needed for students and admins)

**a. Send emails from your own address (required).**
Supabase's built-in email only reaches your Supabase team members and only a
few per hour. **Authentication → Emails → SMTP Settings → Enable custom SMTP**,
e.g. with the club Gmail:

| Field | Value |
|---|---|
| Sender email | `codeforgeniamt@gmail.com` |
| Sender name | `Code Forge` |
| Host | `smtp.gmail.com` |
| Port | `587` |
| Username | `codeforgeniamt@gmail.com` |
| Password | a Gmail **App Password** (Google Account → Security → 2-Step Verification → App passwords) |

**b. Put the code in the emails.**
**Authentication → Emails → Templates**: in both **Magic Link** and
**Confirm signup**, add:

```html
<p>Your Code Forge verification code: <strong>{{ .Token }}</strong></p>
```

**c. Allow the website's address.**
**Authentication → URL Configuration**:
- Site URL: `https://codeforgeniamt.netlify.app` (your live address)
- Redirect URLs: add `https://codeforgeniamt.netlify.app/**` and `http://localhost:5173/**`

## 4. Where to add the API keys

**Project Settings → API** (or **API Keys**):

| Supabase shows | Variable |
|---|---|
| **Project URL** (`https://xxxx.supabase.co`) | `VITE_SUPABASE_URL` |
| **anon / public** key (or **publishable** key, `sb_publishable_…`) | `VITE_SUPABASE_ANON_KEY` |

- **Live site:** Netlify → Site configuration → **Environment variables** → add both → **Deploys → Trigger deploy**.
- **Your computer:** copy `.env.example` to `.env.local`, fill both in, `npm run dev`. (`.env.local` is never committed.)

> ⚠️ Never put the **service_role** / **secret** key in the website or on GitHub.

## 5. Moving the old leaderboard over

1. Open the old Google Sheet → **File → Download → Comma-separated values (.csv)**.
2. On the website go to `/admin` → **Leaderboard → Import CSV** → choose the file → **Import**.

Until the `leaderboard` table has rows, the Leaderboard page keeps reading the old Google Sheet.

## 6. Using /admin (the 5 leads)

- **Members:** the **Pending** list shows new and edited profiles. Click **Approve** to put a profile on the website, **Edit** to fix details, or **Delete** to remove it. When a student edits their own profile, it goes back to Pending.
- **Events:** **+ Add new** to add an event, with poster **Upload**. Events move from "Upcoming" to "Past" on their own when the date passes. Leave the date/time labels blank to have them generated.
- **Leaderboard:** edit scores, add/delete rows, or re-import a CSV.
- **Alumni:** add, edit and delete.

## Changing the admins

Only possible in the Supabase dashboard (**Table Editor → admins**, or SQL Editor):

```sql
delete from public.admins where email = 'old@niamt.ac.in';
insert into public.admins (email) values ('new@niamt.ac.in');
```

A maximum of 5 is enforced; delete one before adding another.

## Each new academic year

Add the new batch to `BATCHES` in `src/data/members.js` (e.g. `2027-31`) and update the year labels.
