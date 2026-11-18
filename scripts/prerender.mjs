// After `vite build` and the SSR build: render every page into its own static HTML file with its own
// title, description, canonical and Open Graph tags, plus 404.html, sitemap.xml, robots.txt and llms.txt.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const ssr = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const {SITE, brand, founder, pages, projects, packages, DEFAULT_PRICES} = ssr;

// Inner pages are rendered into the React template; the home page is its own entry (the motion design) and only
// gets its head filled in.
const templateFile = path.resolve('dist/page.html');
const homeBuilt = fs.readFileSync(path.resolve('dist/index.html'), 'utf8').replaceAll('__SITE__', SITE);
const template = fs.readFileSync(templateFile, 'utf8').replaceAll('__SITE__', SITE);
if (!template.includes('<div id="root"></div>')) throw new Error('root placeholder not found');

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const ldTag = (data) => `    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>\n  </head>`;

const org = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE}/#org`,
  name: brand.name,
  description: brand.what,
  url: `${SITE}/`,
  logo: `${SITE}/logo-ink.svg`,
  image: `${SITE}/og.jpg`,
  areaServed: ['IN', 'AE', 'SA', 'QA', 'GB', 'US'],
  founder: {'@type': 'Person', name: founder.name, jobTitle: 'Founder', url: founder.portfolio},
  sameAs: [founder.github.url],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Packages',
    itemListElement: packages.map((p) => ({
      '@type': 'Offer',
      itemOffered: {'@type': 'Service', name: p.name, description: p.text},
      priceSpecification: {'@type': 'PriceSpecification', price: DEFAULT_PRICES[p.id], priceCurrency: 'USD', minPrice: DEFAULT_PRICES[p.id]},
    })),
  },
};
const website = {'@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE}/#website`, name: brand.name, url: `${SITE}/`, publisher: {'@id': `${SITE}/#org`}, inLanguage: 'en'};

function page({title, description, url, html, ld, noindex, base = template}) {
  let out = base
    .replace(/<title>.*?<\/title>/, `<title>${attr(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${attr(description)}`)
    .replace(/(<meta (?:name="twitter:title"|property="og:title") content=")[^"]*/g, `$1${attr(title)}`)
    .replace(/(<meta (?:name="twitter:description"|property="og:description") content=")[^"]*/g, `$1${attr(description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace('<div id="root"></div>', () => `<div id="root">${html}</div>`);
  if (html == null && out.includes('<div id="root"></div>')) throw new Error('page without html');
  if (noindex) out = out.replace(/\s*<link rel="canonical"[^>]*>/, '').replace(/(<meta name="robots" content=")[^"]*/, '$1noindex, follow');
  if (ld) out = out.replace('</head>', () => ldTag(ld));
  return out;
}

const written = [];
for (const p of pages) {
  const url = `${SITE}${p.path}`;
  const ld = [
    {'@context': 'https://schema.org', '@type': 'WebPage', '@id': `${url}#webpage`, url, name: p.title, description: p.description, isPartOf: {'@id': `${SITE}/#website`}, inLanguage: 'en'},
  ];
  if (p.id === 'home') ld.push(org, website);
  else
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {'@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/`},
        {'@type': 'ListItem', position: 2, name: p.title.split(' · ')[0], item: url},
      ],
    });
  if (p.id === 'work')
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Projects',
      itemListElement: projects.map((x, i) => ({'@type': 'ListItem', position: i + 1, item: {'@type': 'CreativeWork', name: x.title, description: x.oneLiner, url: x.live ?? x.code ?? `${url}#${x.id}`, keywords: x.tags.join(', ')}})),
    });
  const file = p.path === '/' ? 'dist/index.html' : `dist${p.path}index.html`;
  fs.mkdirSync(path.dirname(path.resolve(file)), {recursive: true});
  const html = p.id === 'home' ? null : ssr.render(p.path);
  fs.writeFileSync(path.resolve(file), page({title: p.title, description: p.description, url, html, ld, base: p.id === 'home' ? homeBuilt : template}));
  written.push(file);
}

// Cloudflare serves this with a 404 status for any unknown address (not_found_handling: 404-page).
fs.writeFileSync(
  path.resolve('dist/404.html'),
  page({title: 'Page not found · Halo Automations', description: 'This page doesn’t exist. Go to the home page or see our work.', url: `${SITE}/`, html: ssr.render('/404'), noindex: true}),
);
written.push('dist/404.html');

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.resolve('dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.path === '/' ? '1.0' : p.id === 'privacy' ? '0.3' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`,
);
fs.writeFileSync(path.resolve('dist/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

// A plain-text summary for AI assistants (llmstxt.org), from the same content as the pages.
fs.writeFileSync(
  path.resolve('dist/llms.txt'),
  [
    `# ${brand.name}`,
    '',
    `> ${brand.what}`,
    '',
    '## Pages',
    '',
    ...pages.map((p) => `- [${p.title.split(' · ')[0]}](${SITE}${p.path}): ${p.description}`),
    '',
    '## Work',
    '',
    ...projects.map((x) => `- [${x.title}](${x.live ?? x.code ?? `${SITE}/work/#${x.id}`}): ${x.oneLiner}`),
    '',
    '## Contact',
    '',
    `- Enquiry form: ${SITE}/contact/`,
    `- WhatsApp: ${founder.whatsapp.handle}`,
    '',
  ].join('\n'),
);

// The README in public/founder is for whoever adds photos, not for visitors.
fs.writeFileSync(path.resolve('dist/.assetsignore'), 'founder/README.md\n');

for (const f of written) {
  const html = fs.readFileSync(path.resolve(f), 'utf8');
  if (html.includes('__SITE__')) throw new Error(`__SITE__ left in ${f}`);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) throw new Error(`${f} has ${h1} h1 elements`);
  if (/<img(?![^>]*\balt=)[^>]*>/.test(html) || /\balt=""/.test(html)) throw new Error(`${f} has an image without alt text`);
}
fs.rmSync(path.resolve('dist-ssr'), {recursive: true, force: true});
fs.rmSync(path.resolve('dist/page.html'), {force: true}); // the template itself is not a page
console.log(`prerendered ${written.length} pages (${written.join(', ')}), sitemap.xml, robots.txt, llms.txt`);
