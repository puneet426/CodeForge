# Member registry (Google Sheet + Apps Script)

The "Register as a member" form on `/members` saves profiles into a **private**
Google Sheet. A profile appears on the site only after a core-team member sets
its **Approved** cell to `Yes`.

The Apps Script returns approved profiles **without** email or roll number, so
the sheet itself never needs to be public.

## One-time setup (≈5 minutes)

1. Create a new Google Sheet using the club account (e.g. "Code Forge Members").
2. **Extensions → Apps Script**. Delete the sample code and paste in
   everything from [`members-apps-script.gs`](./members-apps-script.gs). Save.
3. From the function dropdown pick **`setup`**, then click **Run** and allow
   the permissions it asks for. A `Members` tab with headers is created.
4. **Deploy → New deployment → type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
5. Give that URL to the website. Pick one way:
   - Netlify: **Site settings → Environment variables** → add
     `VITE_MEMBERS_API` = the URL, then redeploy, **or**
   - Paste it in `src/data/members.js` as the fallback value of `MEMBERS_API`.

## Approving members

Open the sheet, check the row, and change **Approved** from `No` to `Yes`.
It shows up on the Members page the next time someone loads it.

- If someone submits again with the same email, the row is **updated** and
  set back to `No` so the change is reviewed.
- To remove someone, set Approved to `No` or delete the row.

## Changing the code later

After editing the script, use **Deploy → Manage deployments → Edit (pencil)
→ Version: New version → Deploy**. This keeps the same URL.

## Limits

The `@niamt.ac.in` check confirms the address *looks* like a college email;
it does not prove the person owns it. Manual approval is the safeguard — check
that the name and email match before setting `Yes`.
