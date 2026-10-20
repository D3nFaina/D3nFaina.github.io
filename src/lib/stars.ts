// Favourite places from Google Maps (Takeout "Saved Places.json"), grouped per country.
// Shared by the Travels page and the per-country map data in /geo/<slug>.json.
import starred from '../data/starred.json';

export type Star = { n: string; a: number; o: number; c: string; t: number };
export const stars = starred as Star[];

export const slug = (c: string) => c.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

export const byCountry = new Map<string, Star[]>();
for (const s of stars) byCountry.set(s.c, [...(byCountry.get(s.c) ?? []), s]);
export const starCountries = [...byCountry.keys()].sort((x, y) => byCountry.get(y)!.length - byCountry.get(x)!.length);

// The lon/lat box a country's view is framed on: its stars plus some margin.
export function frame(c: string) {
  const ps = byCountry.get(c)!;
  const lo = ps.map((p) => p.o), la = ps.map((p) => p.a);
  const x0 = Math.min(...lo), x1 = Math.max(...lo), y0 = Math.min(...la), y1 = Math.max(...la);
  const span = Math.max(x1 - x0, y1 - y0);
  const pad = Math.max(0.4, span * 0.2);
  return { box: [x0 - pad, y0 - pad, x1 + pad, y1 + pad], span };
}
