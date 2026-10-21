// Refreshes src/data/scholar.json (citations, h-index, i10-index and citations per year) from Den's
// Google Scholar profile. Runs in CI before every build and on the daily schedule, so the chart on the
// Publications page follows Scholar.
//
// Scholar has no API and answers GitHub's servers with HTTP 403, so the numbers come through SerpApi's
// Google Scholar Author API (free plan; one call per build). Set the repository secret SERPAPI_KEY.
// Without it the script still tries the profile page directly. If both fail, the last good numbers
// in scholar.json are kept and the build carries on.

import { readFile, writeFile } from 'node:fs/promises';

const USER = 'rOEzuyEAAAAJ';
const OUT = new URL('../src/data/scholar.json', import.meta.url);
const URL_ = `https://scholar.google.com/citations?user=${USER}&hl=en`;
const num = (s) => Number(String(s).replace(/[^\d]/g, ''));

async function viaSerpApi(key) {
  const res = await fetch(`https://serpapi.com/search.json?engine=google_scholar_author&author_id=${USER}&hl=en&api_key=${key}`);
  if (!res.ok) throw new Error(`SerpApi HTTP ${res.status}`);
  const j = await res.json();
  const t = j.cited_by?.table ?? [];
  const pick = (k) => t.find((r) => r[k])?.[k]?.all;
  const perYear = (j.cited_by?.graph ?? []).map((g) => [g.year, g.citations]);
  return { total: pick('citations'), h: pick('h_index'), i10: pick('i10_index'), perYear };
}

async function direct() {
  const res = await fetch(URL_, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // Stats table: All / Since cells for citations, h-index, i10-index.
  const cells = [...html.matchAll(/<td class="gsc_rsb_std">([^<]*)<\/td>/g)].map((m) => num(m[1]));
  if (cells.length < 6) throw new Error('stats table not found (captcha or new layout)');
  const [total, , h, , i10] = cells;

  // Histogram: years are labels, bars carry the counts. Years with no citations have no bar, so bars
  // are matched to years through their z-index (Scholar sets it to count - index).
  const years = [...html.matchAll(/<span class="gsc_g_t"[^>]*>(\d{4})<\/span>/g)].map((m) => +m[1]);
  const bars = [...html.matchAll(/<a[^>]*class="gsc_g_a"[^>]*style="[^"]*z-index:\s*(\d+)[^"]*"[^>]*>\s*<span class="gsc_g_al">([\d,]+)<\/span>/g)]
    .map((m) => ({ z: +m[1], n: num(m[2]) }));
  if (!years.length || !bars.length) throw new Error('citation histogram not found');
  const perYear = years.map((y) => [y, 0]);
  for (const b of bars) { const i = years.length - b.z; if (perYear[i]) perYear[i][1] = b.n; }

  return { total, h, i10, perYear };
}

try {
  const key = process.env.SERPAPI_KEY;
  let got, source;
  if (key) {
    try { got = await viaSerpApi(key); source = 'serpapi'; } catch (e) { console.warn(`fetch-scholar: ${e.message}, trying the page`); }
  }
  if (!got) { got = await direct(); source = 'scholar'; }
  const { total, h, i10, perYear } = got;
  if (!total || !perYear.length || perYear.every(([, n]) => !n)) throw new Error('parsed no numbers');
  const data = { asOf: new Date().toISOString().slice(0, 10), source, total, h, i10, perYear };
  await writeFile(OUT, JSON.stringify(data, null, 1));
  console.log('fetch-scholar:', JSON.stringify(data));
} catch (err) {
  const old = JSON.parse(await readFile(OUT, 'utf8'));
  console.warn(`fetch-scholar: ${err.message}; keeping numbers from ${old.asOf}`);
}
