import { alumni } from './alumni';

// Most common companies (ignoring blanks), for the "where our alumni work" strips.
export const topCompanies = (n = 12) => {
  const c = {};
  alumni.forEach((a) => {
    if (a.company) {
      const k = a.company.replace(/\s*\(.*\)$/, "");
      c[k] = (c[k] || 0) + 1;
    }
  });
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);
};
