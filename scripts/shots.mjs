// Loads every page in the installed Chrome at phone, tablet and laptop widths, checks for problems
// (horizontal overflow, broken images, console errors, empty alt, h1 count) and saves full-page
// screenshots to review/. Run the site first (npx wrangler dev --port 8787), then: npm run shots
// Optional: SITE_URL=https://... node scripts/shots.mjs [390|768|1440] [path...]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = (process.env.SITE_URL || 'http://127.0.0.1:8787').replace(/\/$/, '');
const LOCAL = /127\.0\.0\.1|localhost/.test(BASE);
const OUT = path.resolve(process.env.OUT || 'review');
fs.mkdirSync(OUT, {recursive: true});
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
const widths = args.filter((a) => /^\d+$/.test(a)).map(Number);
const only = args.filter((a) => a.startsWith('/'));
const sizes = [
  {w: 390, h: 844, mobile: true},
  {w: 768, h: 1024, mobile: true},
  {w: 1440, h: 900},
].filter((s) => !widths.length || widths.includes(s.w));
const paths = only.length ? only : ['/', '/brain/', '/agents/', '/how-we-work/', '/work/', '/pricing/', '/about/', '/contact/', '/privacy/', '/nope'];

const browser = await puppeteer.launch({executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars']});
let problems = 0;
for (const s of sizes) {
  for (const p of paths) {
    const page = await browser.newPage();
    await page.setViewport({width: s.w, height: s.h, isMobile: !!s.mobile, hasTouch: !!s.mobile, deviceScaleFactor: 1});
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    const res = await page.goto(BASE + p, {waitUntil: 'load', timeout: 60000});
    await page.evaluate(() => document.fonts.ready);
    await wait(400);
    await page.evaluate(() => (document.documentElement.style.scrollBehavior = 'auto'));
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < total; y += Math.round(s.h * 0.5)) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await wait(90);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await wait(700);
    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      const wide = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const b = el.getBoundingClientRect();
          return b.width > 0 && (b.right > doc.clientWidth + 1 || b.left < -1) && !el.closest('svg, .hero, .closing, .pagehero');
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
      return {
        overflow: doc.scrollWidth > doc.clientWidth,
        wide,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
        noAlt: [...document.images].filter((i) => !i.getAttribute('alt')).map((i) => i.src),
        h1: document.querySelectorAll('h1').length,
        small: [...document.querySelectorAll('a, button')]
          .filter((el) => {
            const b = el.getBoundingClientRect();
            return b.width > 0 && b.height > 0 && (b.height < 24 || b.width < 24) && !el.closest('.skip, p, .prose'); // inline text links are exempt
          })
          .map((el) => el.textContent.trim().slice(0, 24)),
      };
    });
    const name = `${s.w}-${p === '/' ? 'home' : p.replace(/\//g, '') || 'home'}`;
    const issues = [];
    if (r.overflow) issues.push(`horizontal overflow ${r.wide.join(', ')}`);
    if (r.broken.length) issues.push(`broken images ${r.broken.join(', ')}`);
    if (r.noAlt.length) issues.push(`images without alt ${r.noAlt.join(', ')}`);
    if (r.h1 !== 1) issues.push(`${r.h1} h1`);
    if (r.small.length) issues.push(`small targets: ${r.small.join(' | ')}`);
    // Expected: /api/prices answers 503 when the desk is not reachable (local dev), and the 404 page itself.
    const real = errors.filter((e) => !(LOCAL && /status of 503/.test(e)) && !(p === '/nope' && /status of 404/.test(e)));
    if (real.length) issues.push(`console: ${real.join(' | ')}`);
    problems += issues.length;
    console.log(`${res.status()} ${name}${issues.length ? '\n   ' + issues.join('\n   ') : ''}`);
    // Chrome cannot capture more than about 16,000 px in one go, so tall pages are saved in parts.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const CHUNK = 8000;
    for (let y = 0, i = 0; y < height; y += CHUNK, i++) {
      const file = height > CHUNK ? `${name}-${i + 1}.png` : `${name}.png`;
      await page.screenshot({path: path.join(OUT, file), clip: {x: 0, y, width: s.w, height: Math.min(CHUNK, height - y)}, captureBeyondViewport: true});
    }
    await page.close();
  }
}
await browser.close();
console.log(problems ? `${problems} problem(s)` : 'no problems found');
process.exitCode = problems ? 1 : 0;
