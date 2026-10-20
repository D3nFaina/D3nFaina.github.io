// Prints the CV page of a built site to public/cv.pdf.
// Usage: npm run build, serve dist/ on a port, then node scripts/cv-pdf.cjs http://localhost:4322/cv-print/
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const url = process.argv[2] || 'http://localhost:4322/cv-print/';
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  const date = await p.evaluate(() => document.body.dataset.date);
  const small = "font-family: Arial, sans-serif; font-size: 7pt; color: #9a97a3; width: 100%; padding: 0 16mm;";
  await p.pdf({
    path: 'public/cv.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: `<div style="${small} text-align: right; letter-spacing: .12em; text-transform: uppercase;">Danny Fainozzi · Curriculum vitae</div>`,
    footerTemplate: `<div style="${small} display: flex; justify-content: space-between;"><span>Page <span class="pageNumber"></span>/<span class="totalPages"></span></span><span>${date}, Danny Fainozzi, ORCID iD 0000-0001-7380-8324</span></div>`,
  });
  await b.close();
})();
