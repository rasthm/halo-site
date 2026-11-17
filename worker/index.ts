/**
 * Serves the static site and two API routes:
 *   GET  /api/prices   the live package prices and booking link, read from the desk
 *   POST /api/enquiry  the contact form, checked and handed to the desk (rasthm-desk) as a [Halo] enquiry
 * The desk is reached through a private service binding (DESK → rasthm-desk, entrypoint DeskRPC).
 */

type DeskEnquiry = {name: string; email: string; needs: string[]; message: string; country: string};
type DeskPrices = {
  launch: number;
  mvp: number;
  ai: number;
  addons: {logins: number; database: number; payments: number; aiAgent: number; mcp: number; email: number};
  carePlan: number;
  foundingDiscountPct: number;
};

interface Env {
  ASSETS: Fetcher;
  DESK?: {
    addEnquiry(e: DeskEnquiry): Promise<{id: string}>;
    publicInfo(): Promise<{prices: DeskPrices; bookingUrl: string}>;
  };
}

// Must match NEEDS in src/content.ts.
const NEEDS = ['Company brain', 'AI agents & automations', 'Integrations & data sync', 'Web app or MVP', 'Website or launch page', 'APIs & MCP servers', 'Something else'];
const BASES: Record<string, string> = {launch: 'Launch page', mvp: 'MVP sprint', ai: 'AI agents & API build'};
const ADDONS: Record<string, string> = {
  logins: 'Logins & user accounts',
  database: 'Database & admin panel',
  payments: 'Payments',
  aiAgent: 'AI chat or agent',
  mcp: 'MCP server',
  email: 'Email & notifications',
};

// Per-isolate rate limit: a few enquiries per address per hour is plenty for a real person.
const recent = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW = 60 * 60 * 1000;

const json = (body: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(body), {status, headers: {'content-type': 'application/json; charset=utf-8', 'cache-control': cache}});
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const oneLine = (v: unknown, max: number) => clean(v, max).replace(/[\r\n]+/g, ' ');

type Enquiry = {name: string; email: string; company: string; needs: string[]; message: string; pkg: string; website: string; startedAt: number};

/** Builds the package line from known ids only, so the desk never sees free text pretending to be a package. */
function packageLine(raw: unknown): string {
  if (!raw || typeof raw !== 'object') return '';
  const p = raw as {base?: unknown; addons?: unknown; care?: unknown};
  const base = typeof p.base === 'string' ? BASES[p.base] : undefined;
  if (!base) return '';
  const extras = Array.isArray(p.addons) ? [...new Set(p.addons.filter((a): a is string => typeof a === 'string' && a in ADDONS))].map((a) => ADDONS[a]) : [];
  return [base, ...extras].join(' + ') + (p.care === true ? ' · with care plan' : '');
}

function validate(raw: Record<string, unknown>): Enquiry | string {
  const e: Enquiry = {
    name: oneLine(raw.name, 100),
    email: oneLine(raw.email, 200),
    company: oneLine(raw.company, 120),
    needs: Array.isArray(raw.needs) ? [...new Set(raw.needs.filter((n): n is string => typeof n === 'string' && NEEDS.includes(n)))] : [],
    message: clean(raw.message, 4000),
    pkg: packageLine(raw.package),
    website: clean(raw.website, 200),
    startedAt: typeof raw.startedAt === 'number' ? raw.startedAt : 0,
  };
  if (e.name.length < 2) return 'Please add your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.email)) return 'Please add a valid email so we can reply.';
  if (e.message.length < 10) return 'Please tell us a little more about what you need (at least 10 characters).';
  return e;
}

async function handleEnquiry(request: Request, env: Env) {
  if (request.method !== 'POST') return json({error: 'Method not allowed'}, 405);
  if (!env.DESK) return json({error: 'Enquiries are not set up yet. Please message us on WhatsApp.'}, 503);
  const len = Number(request.headers.get('content-length') || 0);
  if (len > 20_000) return json({error: 'That message is too long.'}, 413);

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({error: 'Something went wrong reading the form.'}, 400);
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return json({error: 'Please send a valid enquiry form.'}, 400);
  const result = validate(raw as Record<string, unknown>);
  if (typeof result === 'string') return json({error: result}, 400);

  // The honeypot silently discards bots. A fast real visitor gets an honest retry message,
  // so the page never claims an unsent enquiry was delivered.
  if (result.website) return json({ok: true});
  if (Date.now() - result.startedAt < 3000) return json({error: 'Please wait a moment, then send your enquiry again.'}, 400);

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < WINDOW);
  if (hits.length >= LIMIT) return json({error: 'You’ve sent a few already. Please message us on WhatsApp.'}, 429);
  recent.set(ip, [...hits, now]);

  const lines = [`Company: ${result.company || 'Not given'}`, `Package: ${result.pkg || 'None chosen'}`];
  const message = `[Halo] ${lines.join('\n')}\n\n${result.message}`;
  const country = (request as Request & {cf?: {country?: string}}).cf?.country || '';
  try {
    const {id} = await env.DESK.addEnquiry({name: result.name, email: result.email, needs: result.needs, message, country});
    return json({ok: true, id});
  } catch (err) {
    console.error('desk addEnquiry', String(err));
    return json({error: 'Sending failed. Please try again, or message us on WhatsApp.'}, 502);
  }
}

async function handlePrices(request: Request, env: Env) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return json({error: 'Method not allowed'}, 405);
  try {
    if (!env.DESK) throw new Error('no desk binding');
    const info = await env.DESK.publicInfo();
    return json({prices: info.prices, bookingUrl: info.bookingUrl}, 200, 'public, max-age=300');
  } catch (err) {
    // The page already shows build-time prices; tell it to keep them.
    console.error('desk publicInfo', String(err));
    return json({error: 'Live prices are unavailable right now.'}, 503);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const {pathname} = new URL(request.url);
    if (pathname === '/api/enquiry') return handleEnquiry(request, env);
    if (pathname === '/api/prices') return handlePrices(request, env);
    if (pathname.startsWith('/api/')) return json({error: 'Not found'}, 404);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
