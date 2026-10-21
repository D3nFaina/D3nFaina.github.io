// Refreshes src/data/scholar.json (citations, h-index, i10-index and citations per year) from Den's
// public Google Scholar profile. Runs in CI before every build and on the daily schedule, so the chart
// on the Publications page follows Scholar. Scholar has no API, so this reads the profile page; if
// Scholar refuses (it sometimes shows a captcha to servers) or the page layout changes, the last
// good numbers in scholar.json are kept and the build carries on.

import { readFile, writeFile } from 'node:fs/promises';

const USER = 'rOEzuyEAAAAJ';
const OUT = new URL('../src/data/scholar.json', import.meta.url);
const URL_ = `https://scholar.google.com/citations?user=${USER}&hl=en`;
const num = (s) => Number(String(s).replace(/[^\d]/g, ''));

try {
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

  if (!total || perYear.every(([, n]) => !n)) throw new Error('parsed zeros, keeping old numbers');
  const data = { asOf: new Date().toISOString().slice(0, 10), source: 'scholar', total, h, i10, perYear };
  await writeFile(OUT, JSON.stringify(data, null, 1));
  console.log('fetch-scholar:', JSON.stringify(data));
} catch (err) {
  const old = JSON.parse(await readFile(OUT, 'utf8'));
  console.warn(`fetch-scholar: ${err.message}; keeping numbers from ${old.asOf}`);
}
