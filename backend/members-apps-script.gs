/**
 * Code Forge — member registry (Google Apps Script web app).
 *
 * Bound to a private Google Sheet. The website:
 *   POST  → registers / updates a member (college email only). New and edited
 *           profiles start with Approved = "No".
 *   GET   → returns approved members as JSON, WITHOUT email or roll number.
 *
 * Setup instructions: backend/README.md
 */

const SHEET_NAME = 'Members';
const EMAIL_DOMAIN = 'niamt.ac.in';
const BATCHES = ['2023-27', '2024-28', '2025-29', '2026-30'];
const BRANCHES = [
  'Computer Engineering (CE)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical Engineering (EE)',
  'Mechanical Engineering (ME)',
  'Manufacturing Engineering (MFE)',
  'Metallurgical & Materials Engineering (MME)',
  'Other',
];
const HEADERS = [
  'Timestamp', 'Email', 'Name', 'Roll', 'Batch', 'Branch', 'GitHub', 'Photo',
  'Bio', 'Role', 'Stack', 'Projects', 'GitHubURL', 'LinkedIn', 'Approved',
];
const COL = HEADERS.reduce((m, h, i) => { m[h] = i; return m; }, {});

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    const approved = sh.getRange(2, COL.Approved + 1, sh.getMaxRows() - 1, 1);
    approved.setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Yes', 'No'], true).build());
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Trim, cap length, and stop spreadsheet formula injection.
function clean_(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function url_(v) {
  const s = String(v || '').trim().slice(0, 300);
  return /^https:\/\/[^\s]+$/i.test(s) ? s : '';
}

/** Run once from the editor to create the sheet tab and headers. */
function setup() { sheet_(); }

function doGet() {
  const rows = sheet_().getDataRange().getValues().slice(1);
  const members = rows
    .filter((r) => String(r[COL.Approved]).trim().toLowerCase() === 'yes' && r[COL.Name])
    .map((r) => {
      let projects = [];
      try { projects = JSON.parse(r[COL.Projects] || '[]'); } catch (e) { projects = []; }
      return {
        name: String(r[COL.Name]),
        batch: String(r[COL.Batch]),
        branch: String(r[COL.Branch]),
        github: String(r[COL.GitHub]),
        photo: String(r[COL.Photo]),
        bio: String(r[COL.Bio]),
        role: String(r[COL.Role]),
        stack: String(r[COL.Stack]).split(',').map((s) => s.trim()).filter(Boolean),
        projects: projects,
        githubUrl: String(r[COL.GitHubURL]),
        linkedin: String(r[COL.LinkedIn]),
      };
    });
  return json_({ ok: true, members: members });
}

function doPost(e) {
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'Invalid request.' }); }

  if (d.website) return json_({ ok: true }); // honeypot: bots fill hidden fields

  const email = String(d.email || '').trim().toLowerCase();
  const domainRe = new RegExp('^[^\\s@]+@' + EMAIL_DOMAIN.replace(/\./g, '\\.') + '$');
  if (!domainRe.test(email)) return json_({ ok: false, error: 'Use your college email (@' + EMAIL_DOMAIN + ').' });

  const name = clean_(d.name, 80);
  const bio = clean_(d.bio, 280);
  if (!name) return json_({ ok: false, error: 'Full name is required.' });
  if (!bio) return json_({ ok: false, error: 'A one-line bio is required.' });
  if (BATCHES.indexOf(d.batch) < 0) return json_({ ok: false, error: 'Pick a valid batch.' });
  if (BRANCHES.indexOf(d.branch) < 0) return json_({ ok: false, error: 'Pick a valid branch.' });

  const github = /^[A-Za-z0-9-]{1,39}$/.test(String(d.github || '').trim()) ? String(d.github).trim() : '';
  const projects = (Array.isArray(d.projects) ? d.projects : [])
    .slice(0, 2)
    .map((p) => ({ title: clean_(p && p.title, 60), desc: clean_(p && p.desc, 140), url: url_(p && p.url) }))
    .filter((p) => p.title);

  const row = [];
  row[COL.Timestamp] = new Date();
  row[COL.Email] = email;
  row[COL.Name] = name;
  row[COL.Roll] = clean_(d.roll, 20);
  row[COL.Batch] = d.batch;
  row[COL.Branch] = d.branch;
  row[COL.GitHub] = github;
  row[COL.Photo] = url_(d.photo);
  row[COL.Bio] = bio;
  row[COL.Role] = clean_(d.role, 60);
  row[COL.Stack] = clean_(d.stack, 200);
  row[COL.Projects] = JSON.stringify(projects);
  row[COL.GitHubURL] = url_(d.githubUrl);
  row[COL.LinkedIn] = url_(d.linkedin);
  row[COL.Approved] = 'No';

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const emails = sh.getRange(1, COL.Email + 1, sh.getLastRow(), 1).getValues().map((r) => String(r[0]).toLowerCase());
    const idx = emails.indexOf(email);
    if (idx > 0) {
      sh.getRange(idx + 1, 1, 1, HEADERS.length).setValues([row]); // re-submission: update + re-approve
      return json_({ ok: true, updated: true });
    }
    sh.appendRow(row);
    return json_({ ok: true, updated: false });
  } finally {
    lock.releaseLock();
  }
}
