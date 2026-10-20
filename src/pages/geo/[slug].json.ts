// Land around each country with favourite spots, as plain lon/lat polygons, so the Travels page can
// draw it in whichever projection the visitor picks. Fetched only when someone zooms in.
import type { APIRoute } from 'astro';
import { feature } from 'topojson-client';
import world50 from 'world-atlas/countries-50m.json';
import world10 from 'world-atlas/countries-10m.json';
import { starCountries, byCountry, frame, slug } from '../../lib/stars';

const f50 = (feature(world50 as any, (world50 as any).objects.countries) as any).features;
const f10 = (feature(world10 as any, (world10 as any).objects.countries) as any).features;
// Drop vertices closer than about a pixel of the zoomed view to the last kept one. Far from the
// frame (where only the globe or a wide conic shows them, small) the step grows with distance.
const thin = (r: number[][], box: number[]) => {
  const w = box[2] - box[0], cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
  const out: number[][] = [];
  for (const [x, y] of r) {
    const d = Math.max(Math.abs(x - cx), Math.abs(y - cy)) / w;
    const tol = (w / 1200) * (d < 1 ? 1 : d * d * 6);
    const l = out[out.length - 1];
    if (!l || Math.abs(x - l[0]) > tol || Math.abs(y - l[1]) > tol) out.push([+x.toFixed(3), +y.toFixed(3)]);
  }
  return out;
};

export function getStaticPaths() {
  return starCountries.map((c) => ({ params: { slug: slug(c) }, props: { c } }));
}

export const GET: APIRoute = ({ props }) => {
  const c = props.c as string;
  const { box, span } = frame(c);
  // Keep a wide margin so other projections, which see past the frame, still find land there.
  const m = Math.max(4, span * 1.2);
  const [x0, y0, x1, y1] = [box[0] - m, box[1] - m, box[2] + m, box[3] + m];
  const land: { home: boolean; rings: number[][][] }[] = [];
  for (const f of span < 3 ? f10 : f50) {
    const g = f.geometry;
    if (!g) continue;
    const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
    for (const p of polys) {
      const xs = p[0].map((q: number[]) => q[0]), ys = p[0].map((q: number[]) => q[1]);
      if (Math.max(...xs) < x0 || Math.min(...xs) > x1 || Math.max(...ys) < y0 || Math.min(...ys) > y1) continue;
      const rings = p.map((r: number[][]) => thin(r, box)).filter((r: number[][]) => r.length >= 4);
      if (rings.length) land.push({ home: f.properties.name === c, rings });
    }
  }
  const stars = byCountry.get(c)!.map((s) => [s.o, s.a, s.n]);
  return new Response(JSON.stringify({ c, box, span, land, stars }), { headers: { 'Content-Type': 'application/json' } });
};
