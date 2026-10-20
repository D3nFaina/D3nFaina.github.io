// One-off helper: searches Wikimedia Commons and saves small previews plus credits for picking
// header images. Run by the "Commons candidates" workflow, which pushes them to a scratch branch.
import { mkdir, writeFile } from 'node:fs/promises';
const UA = 'd3nfaina.github.io build (https://github.com/D3nFaina/D3nFaina.github.io)';
const strip = (h = '') => h.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const queries = JSON.parse(process.env.QUERIES);
const out = 'candidates';
await mkdir(out, { recursive: true });
const meta = [];
for (const [key, q] of Object.entries(queries)) {
  for (const term of q) {
    const p = new URLSearchParams({ action: 'query', format: 'json', formatversion: '2', generator: 'search', gsrsearch: `${term} filetype:bitmap`, gsrnamespace: '6', gsrlimit: '10',
      prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '900', iiextmetadatafilter: 'Artist|LicenseShortName' });
    const r = await fetch(`https://commons.wikimedia.org/w/api.php?${p}`, { headers: { 'User-Agent': UA } });
    const d = await r.json();
    for (const pg of d.query?.pages ?? []) {
      const ii = pg.imageinfo?.[0];
      if (!ii || !/jpeg|png/.test(ii.mime) || ii.width < 1200) continue;
      const id = `${key}-${meta.length}`;
      const img = await fetch(ii.thumburl, { headers: { 'User-Agent': UA } });
      if (!img.ok) continue;
      await writeFile(`${out}/${id}.jpg`, Buffer.from(await img.arrayBuffer()));
      meta.push({ id, key, term, title: pg.title, url: ii.url, page: ii.descriptionurl, w: ii.width, h: ii.height,
        artist: strip(ii.extmetadata?.Artist?.value), license: strip(ii.extmetadata?.LicenseShortName?.value) });
    }
  }
}
await writeFile(`${out}/meta.json`, JSON.stringify(meta, null, 1));
console.log(meta.length, 'candidates');
