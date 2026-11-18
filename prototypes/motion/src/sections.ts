/** Home page sections: How we work (odometer), Everything we build (pinned tabs), founder video, pricing rig. */
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import {play} from './sound';

const clamp = gsap.utils.clamp(0, 1);

/** How we work: the time label rolls like an odometer while the four steps light in turn. */
export function initHow(section: HTMLElement, reduce: boolean) {
  const roll = section.querySelector<HTMLElement>('.how-roll')!;
  const steps = [...section.querySelectorAll<HTMLElement>('.how-steps li')];
  const n = steps.length;
  let last = -1;
  const set = (p: number, instant = false) => {
    const i = Math.min(n - 1, Math.floor(p * n));
    if (i === last) return;
    last = i;
    steps.forEach((s, k) => { s.classList.toggle('on', k <= i); s.classList.toggle('now', k === i); });
    // the time label clicks over like an odometer, one step at a time
    gsap.to(roll, {yPercent: (-100 * i) / n, duration: instant ? 0 : 0.7, ease: 'expo.out', overwrite: true});
  };
  if (reduce) { set(0, true); ScrollTrigger.create({trigger: section, start: 'top 60%', end: 'bottom 60%', onUpdate: (st) => set(st.progress, true)}); return; }
  const mm = gsap.matchMedia();
  mm.add('(min-width: 981px)', () => {
    set(0, true);
    ScrollTrigger.create({trigger: section, start: 'top top', end: '+=180%', pin: section.querySelector<HTMLElement>('.how-pin'), onUpdate: (st) => set(st.progress)});
  });
  mm.add('(max-width: 980px)', () => {
    set(0, true);
    ScrollTrigger.create({trigger: section, start: 'top 60%', end: 'bottom 60%', onUpdate: (st) => set(st.progress)});
  });
}

/** Everything we build: pinned; each service wipes in over the last, tabs fill like progress bars. */
export function initBuild(section: HTMLElement, getLenis: () => Lenis | null, reduce: boolean) {
  const tabs = [...section.querySelectorAll<HTMLButtonElement>('[role=tab]')];
  const panels = [...section.querySelectorAll<HTMLElement>('.panel')];
  const n = panels.length;
  panels.forEach((p, i) => {
    p.id = `svc-${i}`;
    tabs[i].id = `tab-${i}`;
    tabs[i].setAttribute('aria-controls', p.id);
    p.setAttribute('aria-labelledby', tabs[i].id);
  });
  let current = -1;
  const select = (i: number) => {
    if (i === current) return;
    current = i;
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
  };
  const render = (pos: number) => {
    panels.forEach((p, i) => {
      const d = pos - i;
      const vis = p.querySelector<HTMLElement>('.pvis')!;
      const txt = p.querySelector<HTMLElement>('.ptext')!;
      const img = vis.querySelector<HTMLElement>('img, .flow, .brainvis');
      const cut = d >= 0 ? 0 : d > -1 ? -d : 1;
      vis.style.clipPath = `inset(${(cut * 100).toFixed(2)}% 0 0 0 round 14px)`;
      vis.style.zIndex = String(i);
      if (img) img.style.transform = `scale(${(1.12 - 0.12 * clamp(d + 1)).toFixed(4)})`;
      const o = clamp(1 - Math.abs(d) * 2.4);
      txt.style.opacity = o.toFixed(3);
      txt.style.transform = `translateY(${(-d * 28).toFixed(1)}px)`;
      txt.style.visibility = o < 0.01 ? 'hidden' : 'visible';
      p.inert = o < 0.5;
    });
    tabs.forEach((t, i) => t.style.setProperty('--fill', clamp(pos - i + 1).toFixed(3)));
    select(Math.min(n - 1, Math.round(pos)));
  };

  if (reduce) { section.classList.add('static'); select(0); return; }
  const mm = gsap.matchMedia();
  mm.add('(min-width: 981px)', () => {
    const st = ScrollTrigger.create({
      trigger: section, start: 'top top', end: `+=${(n - 1) * 70}%`, pin: section.querySelector('.build-pin'), scrub: true,
      onUpdate: (s) => render(s.progress * (n - 1)),
    });
    render(0);
    const go = (i: number) => {
      const y = st.start + ((st.end - st.start) * i) / (n - 1) + 2;
      const l = getLenis();
      if (l) l.scrollTo(y, {duration: 1.1}); else scrollTo({top: y, behavior: 'smooth'});
    };
    tabs.forEach((t, i) => t.addEventListener('click', () => go(i)));
    // arrow keys move between tabs, as a tablist should
    section.querySelector('[role=tablist]')!.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      if (k !== 'ArrowRight' && k !== 'ArrowLeft') return;
      e.preventDefault();
      const i = (current + (k === 'ArrowRight' ? 1 : n - 1)) % n;
      tabs[i].focus();
      go(i);
    });
    return () => { st.kill(); panels.forEach((p) => { p.querySelector<HTMLElement>('.pvis')!.style.clipPath = ''; p.querySelector<HTMLElement>('.ptext')!.removeAttribute('style'); p.inert = false; }); };
  });
  mm.add('(max-width: 980px)', () => { section.classList.add('static'); return () => section.classList.remove('static'); });
}

/** Founder clip plays only while it is on screen; with reduced motion the poster stays. */
export function initFounder(section: HTMLElement, reduce: boolean) {
  const v = section.querySelector('video');
  if (!v || reduce) return;
  v.preload = 'metadata';
  new IntersectionObserver(([en]) => { if (en.isIntersecting) v.play().catch(() => {}); else v.pause(); }, {threshold: 0.3}).observe(v);
}

/** Pricing rig: package keys, add-on switches and a currency switch drive the amber readout. */
const USD = {launch: 400, mvp: 2500, ai: 1500, logins: 300, database: 500, payments: 400, aiAgent: 800, mcp: 600, email: 200, care: 150} as const;
const INR = {launch: 35000, mvp: 210000, ai: 125000, logins: 25000, database: 42000, payments: 34000, aiAgent: 68000, mcp: 50000, email: 17000, care: 12500} as const;
type Item = keyof typeof USD;
const FOUNDING_PCT = 30;
const price = (item: Item, cur: string) =>
  cur === 'INR' ? INR[item] : cur === 'AED' ? Math.round((USD[item] * 3.67) / 50) * 50 : cur === 'GBP' ? Math.round((USD[item] * 0.79) / 10) * 10 : USD[item];
const fmt = (v: number, cur: string) =>
  cur === 'INR' ? '₹' + Math.round(v).toLocaleString('en-IN') : cur === 'AED' ? 'AED ' + Math.round(v).toLocaleString('en-US') : (cur === 'GBP' ? '£' : '$') + Math.round(v).toLocaleString('en-US');

export function initPricing(section: HTMLElement, reduce: boolean) {
  const total = section.querySelector<HTMLElement>('[data-total]')!;
  const care = section.querySelector<HTMLElement>('[data-care]')!;
  const found = section.querySelector<HTMLElement>('[data-found]')!;
  const shown = {v: price('launch', 'INR')};
  let cur = 'INR';
  const update = () => {
    cur = section.querySelector<HTMLInputElement>('input[name=cur]:checked')!.value;
    const pkg = section.querySelector<HTMLInputElement>('input[name=pkg]:checked')!.value as Item;
    const adds = [...section.querySelectorAll<HTMLInputElement>('.adds input:checked')].map((i) => i.value as Item);
    const sum = price(pkg, cur) + adds.filter((a) => a !== 'care').reduce((s, a) => s + price(a, cur), 0);
    care.textContent = adds.includes('care') ? `+ ${fmt(price('care', cur), cur)} / month care plan` : '';
    found.textContent = `Founding clients: ${FOUNDING_PCT}% off · ${fmt(sum * (1 - FOUNDING_PCT / 100), cur)}`;
    gsap.to(shown, {v: sum, duration: reduce ? 0 : 0.5, ease: 'power3.out', overwrite: true, onUpdate: () => (total.textContent = fmt(shown.v, cur))});
    // service panels show "from" prices in the same currency
    document.querySelectorAll<HTMLElement>('[data-price]').forEach((d) => (d.textContent = fmt(price(d.dataset.price as Item, cur), cur)));
  };
  section.addEventListener('change', () => { update(); play('beep', {volume: 0.8}); });
  update();
}
