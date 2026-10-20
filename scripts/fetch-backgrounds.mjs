// Syncs the home page backgrounds with Den's Google Drive folder Website_images/Background.
// Runs in CI before every build (and on the daily schedule), so any photo dropped in that
// folder joins the random rotation; photos removed from the folder drop out. The hero then
// picks one at random on every page load.
//
// Needs the folder shared as "Anyone with the link can view" and two repository secrets:
//   GDRIVE_API_KEY  a Google Cloud API key with the Drive API enabled
//   BG_FOLDER_ID    the folder id (the last part of its Drive URL)
// Without them, or if Drive fails, the committed public/bg/manifest.json is kept as it is.
//
// Photos already committed to public/bg/ (matched by their Drive file name in "drive") keep
// their caption and are not downloaded again. New ones are resized to 2400 px and saved
// without EXIF, so no GPS location is published.

import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const KEY = process.env.GDRIVE_API_KEY;
const FOLDER = process.env.BG_FOLDER_ID;
const DIR = new URL('../public/bg/', import.meta.url);
const MANIFEST = new URL('manifest.json', DIR);

if (!KEY || !FOLDER) {
  console.log('fetch-backgrounds: no Drive secrets, keeping the committed backgrounds');
  process.exit(0);
}

const api = 'https://www.googleapis.com/drive/v3/files';

try {
  const committed = JSON.parse(await readFile(MANIFEST, 'utf8'));
  const byDrive = new Map(committed.filter((e) => e.drive).map((e) => [e.drive, e]));

  const files = [];
  let pageToken = '';
  do {
    const q = encodeURIComponent(`'${FOLDER}' in parents and mimeType contains 'image/' and trashed = false`);
    const res = await fetch(`${api}?q=${q}&fields=nextPageToken,files(id,name)&pageSize=200&key=${KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`);
    if (!res.ok) throw new Error(`Drive list ${res.status}: ${await res.text()}`);
    const data = await res.json();
    files.push(...data.files);
    pageToken = data.nextPageToken || '';
  } while (pageToken);
  if (!files.length) throw new Error('the Background folder is empty');

  const list = [];
  for (const f of files) {
    const known = byDrive.get(f.name);
    if (known) { list.push(known); continue; }
    const res = await fetch(`${api}/${f.id}?alt=media&key=${KEY}`);
    if (!res.ok) { console.warn(`fetch-backgrounds: skipped ${f.name} (${res.status})`); continue; }
    const name = `drive-${f.id}.jpg`;
    await sharp(Buffer.from(await res.arrayBuffer()))
      .rotate() // apply the camera orientation before EXIF is dropped
      .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 84, progressive: true, mozjpeg: true })
      .toFile(new URL(name, DIR).pathname);
    list.push({ src: `/bg/${name}`, drive: f.name, title: '', artist: 'Danny Fainozzi', license: '', page: '' });
  }
  if (!list.length) throw new Error('no photo could be downloaded');
  await writeFile(MANIFEST, JSON.stringify(list, null, 2));
  console.log(`fetch-backgrounds: ${list.length} backgrounds (${files.length} in Drive)`);
} catch (err) {
  console.warn(`fetch-backgrounds: ${err.message}; keeping the committed backgrounds`);
}
