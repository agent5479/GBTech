/**
 * Post-build prerender: visit each route in a headless browser and write static HTML.
 * Google and other crawlers receive fully rendered pages on GitHub Pages (no empty SPA shell).
 *
 * Requires: npm run build first (dist/ must exist).
 * Env: SITE_URL — canonical origin for sitemap/robots (e.g. https://example.com)
 */
import { createServer } from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sirv from 'sirv';
import { PRERENDER_ROUTES } from './prerender-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const previewPort = 4173;
const previewUrl = `http://127.0.0.1:${previewPort}`;

function routeToFile(route) {
  if (route === '/' || route === '') {
    return path.join(distDir, 'index.html');
  }
  const segment = route.replace(/^\//, '').replace(/\/$/, '');
  return path.join(distDir, segment, 'index.html');
}

function startStaticServer() {
  const serve = sirv(distDir, {
    dev: true,
    single: true, // SPA fallback → index.html for client-side routes
  });

  const server = createServer((req, res) => {
    serve(req, res, () => {
      res.statusCode = 404;
      res.end('Not found');
    });
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(previewPort, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function prerender() {
  if (!fs.existsSync(distDir)) {
    throw new Error('dist/ not found — run vite build first');
  }

  const server = await startStaticServer();

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    for (const route of PRERENDER_ROUTES) {
      const url = `${previewUrl}${route}`;
      console.log(`Prerendering ${route} …`);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForFunction(
        () => document.querySelector('meta[name="description"]')?.getAttribute('content'),
        { timeout: 15000 }
      );

      const html = await page.content();
      const outFile = routeToFile(route);
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, html, 'utf8');
    }

    await browser.close();

    const indexHtml = path.join(distDir, 'index.html');
    fs.copyFileSync(indexHtml, path.join(distDir, '404.html'));

    console.log(`Prerendered ${PRERENDER_ROUTES.length} routes into dist/`);
  } finally {
    server.close();
  }
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
