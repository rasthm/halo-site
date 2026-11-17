import {useEffect, useState} from 'react';
import {DEFAULT_PRICES, type Prices} from './content';

export type PublicInfo = {prices: Prices; bookingUrl: string};

const FALLBACK: PublicInfo = {prices: DEFAULT_PRICES, bookingUrl: ''};
let pending: Promise<PublicInfo> | null = null;

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;

/** Merges whatever valid numbers the API sent over the build-time defaults, so a partial or odd reply never breaks the page. */
function merge(raw: unknown): PublicInfo {
  const r = (raw && typeof raw === 'object' ? raw : {}) as {prices?: Partial<Omit<Prices, 'addons'>> & {addons?: Partial<Prices['addons']>}; bookingUrl?: unknown};
  const p = r.prices ?? {};
  const a = p.addons ?? {};
  const d = DEFAULT_PRICES;
  const pick = (v: unknown, fallback: number) => (isNum(v) ? v : fallback);
  const url = typeof r.bookingUrl === 'string' && /^https:\/\//.test(r.bookingUrl) ? r.bookingUrl : '';
  return {
    prices: {
      launch: pick(p.launch, d.launch),
      mvp: pick(p.mvp, d.mvp),
      ai: pick(p.ai, d.ai),
      addons: {
        logins: pick(a.logins, d.addons.logins),
        database: pick(a.database, d.addons.database),
        payments: pick(a.payments, d.addons.payments),
        aiAgent: pick(a.aiAgent, d.addons.aiAgent),
        mcp: pick(a.mcp, d.addons.mcp),
        email: pick(a.email, d.addons.email),
      },
      carePlan: pick(p.carePlan, d.carePlan),
      foundingDiscountPct: Math.min(90, pick(p.foundingDiscountPct, d.foundingDiscountPct)),
    },
    bookingUrl: url,
  };
}

function load(): Promise<PublicInfo> {
  pending ??= fetch('/api/prices', {headers: {accept: 'application/json'}})
    .then((res) => (res.ok ? res.json() : null))
    .then(merge)
    .catch(() => FALLBACK);
  return pending;
}

/** Live prices and booking link from the desk. Renders the build-time defaults first (as in the static HTML), then updates. */
export function usePublicInfo(): PublicInfo {
  const [info, setInfo] = useState<PublicInfo>(FALLBACK);
  useEffect(() => {
    let on = true;
    load().then((i) => on && setInfo(i));
    return () => {
      on = false;
    };
  }, []);
  return info;
}

export const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
