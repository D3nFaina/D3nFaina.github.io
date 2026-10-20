// Turns a land-cover class grid (1440x720 bytes, equirectangular, 0 = water) into smooth lon/lat
// polygons per class, written to src/data/biomes.json for the Travels map.
// The classes come from NASA's Blue Marble (public domain), sorted by colour into broad biomes.
import { readFileSync, writeFileSync } from 'node:fs';
import { contours } from 'd3-contour';

const [input, output = 'src/data/biomes.json'] = process.argv.slice(2);
const W = 1440, H = 720, grid = readFileSync(input);
const CLASSES = ['desert', 'dry', 'grass', 'forest', 'jungle', 'cold', 'ice'];

// Douglas-Peucker on a closed ring, in degrees: split it at the point farthest from the start.
function simplifyRing(r, tol) {
  let far = 0, fd = -1;
  for (let k = 0; k < r.length; k++) { const d = Math.hypot(r[k][0] - r[0][0], r[k][1] - r[0][1]); if (d > fd) { fd = d; far = k; } }
  return [...simplify(r.slice(0, far + 1), tol).slice(0, -1), ...simplify(r.slice(far), tol)];
}
function simplify(pts, tol) {
  if (pts.length < 5) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [i, j] = stack.pop();
    const [ax, ay] = pts[i], [bx, by] = pts[j];
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    let best = -1, bi = -1;
    for (let k = i + 1; k < j; k++) {
      const d = Math.abs((pts[k][0] - ax) * dy - (pts[k][1] - ay) * dx) / L;
      if (d > best) { best = d; bi = k; }
    }
    if (best > tol) { keep[bi] = 1; stack.push([i, bi], [bi, j]); }
  }
  return pts.filter((_, k) => keep[k]);
}

const out = {};
for (const [i, name] of CLASSES.entries()) {
  const v = new Float64Array(W * H);
  for (let k = 0; k < W * H; k++) v[k] = grid[k] === i + 1 ? 1 : 0;
  const [mp] = contours().size([W, H]).smooth(true).thresholds([0.5])(v);
  const polys = [];
  for (const poly of mp.coordinates) {
    const rings = poly
      .map((r) => simplifyRing(r.map(([x, y]) => [+(x / W * 360 - 180).toFixed(2), +(90 - y / H * 180).toFixed(2)]), 0.08))
      .filter((r) => r.length >= 4);
    if (rings.length && Math.abs(area(rings[0])) > 0.3) polys.push(rings.map((r) => r.reverse()));
  }
  out[name] = polys;
  console.log(name, polys.length);
}
function area(r) { let s = 0; for (let k = 0; k < r.length - 1; k++) s += r[k][0] * r[k + 1][1] - r[k + 1][0] * r[k][1]; return s / 2; }
writeFileSync(output, JSON.stringify(out));
