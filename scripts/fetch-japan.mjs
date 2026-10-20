// Picks a few random featured photos of Japan from Wikimedia Commons (all freely
// licensed) and saves them to public/japan/ with credits in manifest.json.
// Runs before every build in CI, so each deploy gets a fresh random set; the hero
// then shows one of them at random on every page load. If anything fails, the
// existing images (or the gradient fallback) are kept and the build carries on.

import { mkdir, writeFile, readdir, rm } from 'node:fs/promises';

const OUT = new URL('../public/japan/', import.meta.url);
const COUNT = 6;
const CATEGORIES = ['Category:Featured pictures of Japan', 'Category:Quality images of Japan'];
const UA = 'd3nfaina.github.io build (https://github.com/D3nFaina/D3nFaina.github.io)';

const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function listCandidates(category) {
  const files = [];
  let cont = {};
  for (let page = 0; page < 6; page++) {
    const params = new URLSearchParams({
      action: 'query', format: 'json', formatversion: '2',
      generator: 'categorymembers', gcmtitle: category, gcmtype: 'file', gcmlimit: '200',
      prop: 'imageinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '2200',
      iiextmetadatafilter: 'Artist|LicenseShortName|ObjectName',
      ...cont,
    });
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`Commons API ${res.status}`);
    const data = await res.json();
    for (const p of data.query?.pages ?? []) {
      const ii = p.imageinfo?.[0];
      if (!ii || ii.mime !== 'image/jpeg') continue;
      if (ii.width < 2000 || ii.width / ii.height < 1.35) continue; // wide landscapes only
      files.push({
        title: p.title.replace(/^File:/, ''),
        thumb: ii.thumburl,
        page: ii.descriptionurl,
        artist: strip(ii.extmetadata?.Artist?.value) || 'Unknown',
        license: strip(ii.extmetadata?.LicenseShortName?.value) || 'see source',
        name: strip(ii.extmetadata?.ObjectName?.value),
      });
    }
    if (!data.continue) break;
    cont = data.continue;
  }
  return files;
}

try {
  let pool = [];
  for (const c of CATEGORIES) {
    pool = await listCandidates(c);
    if (pool.length >= COUNT) break;
  }
  if (pool.length === 0) throw new Error('no candidates');
  pool.sort(() => Math.random() - 0.5);

  const picked = [];
  const tmp = [];
  for (const f of pool) {
    if (picked.length === COUNT) break;
    const res = await fetch(f.thumb, { headers: { 'User-Agent': UA } });
    if (!res.ok) continue;
    const file = `japan-${picked.length + 1}.jpg`;
    tmp.push([file, Buffer.from(await res.arrayBuffer())]);
    picked.push({ src: `/japan/${file}`, title: f.name || f.title.replace(/\.[^.]+$/, '').replace(/_/g, ' '), artist: f.artist, license: f.license, page: f.page });
  }
  if (picked.length === 0) throw new Error('downloads failed');

  await mkdir(OUT, { recursive: true });
  for (const old of await readdir(OUT)) await rm(new URL(old, OUT));
  for (const [file, buf] of tmp) await writeFile(new URL(file, OUT), buf);
  await writeFile(new URL('manifest.json', OUT), JSON.stringify(picked, null, 2) + '\n');
  console.log(`fetch-japan: saved ${picked.length} images`);
} catch (err) {
  console.warn(`fetch-japan: skipped (${err.message}); keeping existing images`);
}
