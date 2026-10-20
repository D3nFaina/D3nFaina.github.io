// The whole world for the Travels map, as plain lon/lat shapes, so the browser can redraw it in
// whichever projection the visitor picks: country outlines plus pastel land-cover patches.
import type { APIRoute } from 'astro';
import { feature } from 'topojson-client';
import world from 'world-atlas/countries-110m.json';
import biomes from '../../data/biomes.json';

const r2 = (c: any): any => (typeof c[0] === 'number' ? [+c[0].toFixed(2), +c[1].toFixed(2)] : c.map(r2));

export const GET: APIRoute = () => {
  const countries = (feature(world as any, (world as any).objects.countries) as any).features
    .filter((f: any) => f.properties.name !== 'Antarctica' && f.geometry)
    .map((f: any) => ({ n: f.properties.name, t: f.geometry.type, c: r2(f.geometry.coordinates) }));
  return new Response(JSON.stringify({ countries, biomes }), { headers: { 'Content-Type': 'application/json' } });
};
