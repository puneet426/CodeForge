// Convert between database values and form-input strings.

const pad = (n) => String(n).padStart(2, '0');
// ISO timestamp → value for <input type="datetime-local"> (in the browser's time zone).
const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const toForm = (field, v) => {
  switch (field.type) {
    case 'bool': return Boolean(v);
    case 'number': return v ?? '';
    case 'datetime': return toLocalInput(v);
    case 'list': return (v || []).join(field.sep ? `${field.sep} ` : '\n');
    case 'json': return v && v.length ? JSON.stringify(v, null, 2) : '';
    default: return v ?? '';
  }
};

// Returns [value, errorMessage].
export const fromForm = (field, v) => {
  switch (field.type) {
    case 'bool': return [Boolean(v)];
    case 'number': {
      if (v === '' || v === null) return [field.empty ?? null, field.required ? `${field.label} is required.` : ''];
      const n = Number(v);
      return Number.isFinite(n) ? [n] : [null, `${field.label} must be a number.`];
    }
    case 'datetime': return [v ? new Date(v).toISOString() : null];
    case 'list': return [String(v).split(field.sep || '\n').map((s) => s.trim()).filter(Boolean)];
    case 'json': {
      if (!String(v).trim()) return [[]];
      try {
        const parsed = JSON.parse(v);
        return Array.isArray(parsed) ? [parsed] : [null, `${field.label} must be a JSON list [ ... ].`];
      } catch { return [null, `${field.label} is not valid JSON.`]; }
    }
    default: {
      const s = String(v ?? '').trim();
      if (field.pattern && s && !new RegExp(field.pattern).test(s)) return [null, `${field.label} has an invalid format.`];
      if ((field.type === 'url' || field.type === 'image') && s && !/^(https:\/\/|\/)/i.test(s)) return [null, `${field.label} must start with https://`];
      return [s || (field.empty ?? null)];
    }
  }
};

// Small CSV parser (handles quoted fields with commas, quotes and newlines).
export const parseCsv = (text) => {
  const rows = []; let row = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim()));
};
