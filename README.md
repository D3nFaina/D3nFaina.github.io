# Danny Fainozzi · personal website

Astro site, deployed for free on GitHub Pages at https://d3nfaina.github.io.

## Edit content

All content lives in `src/data/`:

| File | What it holds |
|---|---|
| `profile.ts` | name, pitch, bio, links (GitHub, ORCID, Scholar), stats, news |
| `research.ts` | research projects, each as question → approach → result |
| `publications.ts` | selected papers and talks |
| `projects.ts` | side projects and code (Projects page) |
| `life.ts` | CV timeline, interests, places on the travel map |

- Notes / blog posts: add a Markdown file to `src/content/notes/`.
- Photo: put `portrait.jpg` in `public/` and set `photo: '/portrait.jpg'` in `profile.ts`.
- CV PDF: replace `public/cv.pdf`.

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Deploy

The home-page drawing (Ginkaku-ji and its sand garden) is an inline SVG in `src/components/GardenScene.astro`.

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes the site.
One-time setup: repository **Settings → Pages → Source: GitHub Actions**.
