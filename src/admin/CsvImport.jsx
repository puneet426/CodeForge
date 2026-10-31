import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ErrorMsg } from '../components/EmailCodeLogin';
import { parseCsv } from './fields';

// Leaderboard import. Expects the old Google Sheet's columns:
//   Name, Github_Username, Total_Score   (header names are matched loosely)
const pick = (headers, ...names) => headers.findIndex((h) => names.includes(h.trim().toLowerCase().replace(/[\s-]+/g, '_')));

const CsvImport = ({ table, onDone, onCancel }) => {
  const [rows, setRows] = useState(null);
  const [replace, setReplace] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const read = async (file) => {
    setErr(''); setRows(null);
    const [head, ...body] = parseCsv(await file.text());
    if (!head) { setErr('The file is empty.'); return; }
    const iName = pick(head, 'name', 'full_name');
    const iGh = pick(head, 'github_username', 'github', 'username');
    const iScore = pick(head, 'total_score', 'score', 'points');
    if (iName < 0 || iScore < 0) { setErr('Need at least "Name" and "Total_Score" columns.'); return; }
    const parsed = body
      .map((r) => {
        const gh = iGh >= 0 ? (r[iGh] || '').trim().replace(/^@/, '') : '';
        return {
          name: (r[iName] || '').trim().slice(0, 80),
          github: /^[A-Za-z0-9-]{1,39}$/.test(gh) ? gh : null,
          score: Number(String(r[iScore] || '0').replace(/[^0-9.-]/g, '')) || 0,
        };
      })
      .filter((r) => r.name);
    if (!parsed.length) { setErr('No rows with a name found.'); return; }
    setRows(parsed);
  };

  const run = async () => {
    setBusy(true); setErr('');
    if (replace) {
      const { error } = await supabase.from(table).delete().gte('id', 0);
      if (error) { setBusy(false); setErr(error.message); return; }
    }
    const { error } = await supabase.from(table).insert(rows);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    onDone();
  };

  return (
    <div className="rounded-2xl border border-forge-yellow/40 bg-black/60 p-5 md:p-6 mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-lg">Import leaderboard from CSV</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-white text-sm">Cancel</button>
      </div>
      <p className="text-sm text-gray-400 font-sans">
        In the Google Sheet: <b>File → Download → Comma-separated values (.csv)</b>, then choose that file.
        Columns used: <code>Name</code>, <code>Github_Username</code>, <code>Total_Score</code>.
      </p>
      <input type="file" accept=".csv,text/csv" onChange={(e) => e.target.files?.[0] && read(e.target.files[0])}
        className="block text-sm text-gray-300 file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-forge-yellow file:text-black file:font-bold" />
      {rows && (
        <>
          <p className="text-sm text-green-400">Found {rows.length} rows. Top: {rows.slice().sort((a, b) => b.score - a.score).slice(0, 3).map((r) => `${r.name} (${r.score})`).join(', ')}</p>
          <label className="flex items-center gap-2 text-sm text-gray-200">
            <input type="checkbox" checked={replace} onChange={(e) => setReplace(e.target.checked)} className="accent-orange-500" />
            Replace the current leaderboard (otherwise rows are added)
          </label>
          <button onClick={run} disabled={busy} className="px-6 py-2.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 disabled:opacity-60">
            {busy ? 'Importing…' : `Import ${rows.length} rows`}
          </button>
        </>
      )}
      <ErrorMsg msg={err} />
    </div>
  );
};

export default CsvImport;
