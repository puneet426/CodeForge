import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { inputCls } from '../lib/formUi';
import { ErrorMsg } from '../components/EmailCodeLogin';
import { toForm, fromForm } from './fields';
import CsvImport from './CsvImport';

const small = "px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors";

// Upload a file to the public "media" bucket and return its URL.
const upload = async (file, folder) => {
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').slice(-60);
  const path = `${folder}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { cacheControl: '31536000' });
  if (error) throw error;
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
};

const Field = ({ field, value, onChange }) => {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const id = `f-${field.key}`;
  const common = { id, value, onChange: (e) => onChange(e.target.value), className: inputCls };

  if (field.type === 'bool') {
    return (
      <label className="flex items-center gap-3 text-sm text-gray-200 md:col-span-2">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-orange-500" />
        {field.label}
      </label>
    );
  }

  const wide = ['textarea', 'list', 'json', 'image'].includes(field.type);
  let input;
  if (field.type === 'select') {
    input = (
      <select {...common} required={field.required} className={`${inputCls} font-bold`}>
        {field.options.map((o) => <option key={o} value={o} className="bg-forge-dark">{o}</option>)}
      </select>
    );
  } else if (['textarea', 'list', 'json'].includes(field.type)) {
    input = <textarea {...common} rows={field.type === 'json' ? 6 : 3} className={`${inputCls} ${field.type === 'json' ? 'font-mono text-xs' : 'font-sans'} resize-y`} />;
  } else if (field.type === 'image') {
    input = (
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="w-14 h-14 rounded-lg object-cover bg-black border border-white/10" />}
        <input {...common} placeholder="https://… or upload →" />
        <label className={`${small} shrink-0 cursor-pointer border-forge-yellow/60 text-forge-yellow hover:bg-forge-yellow hover:text-black`}>
          {busy ? 'Uploading…' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={async (e) => {
            const file = e.target.files?.[0]; if (!file) return;
            setErr(''); setBusy(true);
            try { onChange(await upload(file, field.folder || 'misc')); } catch (x) { setErr(x.message); }
            setBusy(false); e.target.value = '';
          }} />
        </label>
      </div>
    );
  } else {
    input = <input {...common} type={field.type === 'number' ? 'number' : field.type === 'datetime' ? 'datetime-local' : field.type === 'url' ? 'url' : 'text'}
      step={field.type === 'number' ? 'any' : undefined} required={field.required} />;
  }

  return (
    <div className={wide ? 'md:col-span-2' : ''}>
      <label htmlFor={id} className="block text-sm text-gray-300 mb-1.5">{field.label}{field.required && <span className="text-forge-yellow"> *</span>}</label>
      {input}
      <ErrorMsg msg={err} />
    </div>
  );
};

const Editor = ({ resource, row, onDone, onCancel }) => {
  const isNew = !row.id;
  const [form, setForm] = useState(() => Object.fromEntries(resource.fields.map((f) => [f.key, toForm(f, row[f.key])])));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const save = async (e) => {
    e.preventDefault();
    const out = {};
    for (const f of resource.fields) {
      const [v, problem] = fromForm(f, form[f.key]);
      if (problem) { setErr(problem); return; }
      if (f.required && (v === null || v === '')) { setErr(`${f.label} is required.`); return; }
      out[f.key] = v;
    }
    setErr(''); setBusy(true);
    const q = supabase.from(resource.table);
    const { error } = isNew ? await q.insert(out) : await q.update(out).eq('id', row.id);
    setBusy(false);
    if (error) { setErr(error.message); return; }
    onDone();
  };

  return (
    <form onSubmit={save} className="rounded-2xl border border-forge-yellow/40 bg-black/60 p-5 md:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-lg">{isNew ? `New ${resource.label.replace(/s$/, '').toLowerCase()}` : `Edit: ${resource.title(row)}`}</h3>
        <button type="button" onClick={onCancel} className="text-gray-400 hover:text-white text-sm">Cancel</button>
      </div>
      {row.email && <p className="text-xs text-gray-500 mb-4">Email: <span className="text-gray-300">{row.email}</span>{row.roll && <> · Roll: <span className="text-gray-300">{row.roll}</span></>}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {resource.fields.map((f) => (
          <Field key={f.key} field={f} value={form[f.key]} onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))} />
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button type="submit" disabled={busy} className="px-6 py-2.5 rounded-lg bg-forge-yellow text-black font-black hover:bg-orange-400 disabled:opacity-60">{busy ? 'Saving…' : 'Save'}</button>
        <ErrorMsg msg={err} />
      </div>
    </form>
  );
};

const AdminTable = ({ resource }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState(resource.filters?.[0].id);
  const [editing, setEditing] = useState(null);
  const [importing, setImporting] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(resource.table).select('*').order(...resource.order);
    setLoading(false);
    if (error) { setErr(error.message); return; }
    setErr(''); setRows(data);
  }, [resource]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const test = resource.filters?.find((f) => f.id === filter)?.test || (() => true);
    return rows.filter((r) => test(r) && (!s || resource.search(r).toLowerCase().includes(s)));
  }, [rows, q, filter, resource]);

  const toggle = async (r) => {
    const k = resource.toggle.key;
    const { error } = await supabase.from(resource.table).update({ [k]: !r[k] }).eq('id', r.id);
    if (error) { setErr(error.message); return; }
    setRows((all) => all.map((x) => (x.id === r.id ? { ...x, [k]: !r[k] } : x)));
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete "${resource.title(r)}"? This can't be undone.`)) return;
    const { error } = await supabase.from(resource.table).delete().eq('id', r.id);
    if (error) { setErr(error.message); return; }
    setRows((all) => all.filter((x) => x.id !== r.id));
  };

  const done = () => { setEditing(null); setImporting(false); load(); };

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between mb-5">
        <div className="flex flex-wrap items-center gap-2">
          {resource.filters?.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`${small} ${filter === f.id ? 'bg-forge-yellow text-black border-forge-yellow' : 'border-white/15 text-gray-300 hover:border-forge-yellow/60'}`}>
              {f.label} ({rows.filter(f.test).length})
            </button>
          ))}
          <button onClick={() => { setImporting(false); setEditing(resource.blank || {}); }}
            className={`${small} border-forge-yellow text-forge-yellow hover:bg-forge-yellow hover:text-black`}>+ Add new</button>
          {resource.csvImport && (
            <button onClick={() => { setEditing(null); setImporting((v) => !v); }}
              className={`${small} border-white/15 text-gray-300 hover:border-forge-yellow/60`}>Import CSV</button>
          )}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" aria-label={`Search ${resource.label}`} className={`${inputCls} md:w-64`} />
      </div>

      <ErrorMsg msg={err} />
      {importing && <CsvImport table={resource.table} onDone={done} onCancel={() => setImporting(false)} />}
      {editing && <Editor key={editing.id || 'new'} resource={resource} row={editing} onDone={done} onCancel={() => setEditing(null)} />}

      {loading ? <p className="text-forge-yellow animate-pulse py-10">Loading…</p> : (
        <>
          <p className="text-xs text-gray-500 mb-3">{shown.length} of {rows.length}</p>
          <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/40">
            {shown.map((r) => (
              <li key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-bold truncate">{resource.title(r)}</p>
                  <p className="text-xs text-gray-500 truncate font-sans">{resource.subtitle(r)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {resource.toggle && (
                    <button onClick={() => toggle(r)}
                      className={`${small} ${r[resource.toggle.key] ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' : 'border-forge-yellow/60 text-forge-yellow hover:bg-forge-yellow/10'}`}>
                      {r[resource.toggle.key] ? `✓ ${resource.toggle.on}` : `${resource.toggle.off} → Approve`}
                    </button>
                  )}
                  <button onClick={() => { setImporting(false); setEditing(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`${small} border-white/15 text-gray-200 hover:border-forge-yellow/60`}>Edit</button>
                  <button onClick={() => remove(r)} className={`${small} border-red-500/40 text-red-400 hover:bg-red-500/10`}>Delete</button>
                </div>
              </li>
            ))}
            {shown.length === 0 && <li className="p-8 text-center text-gray-500 text-sm">Nothing here.</li>}
          </ul>
        </>
      )}
    </section>
  );
};

export default AdminTable;
