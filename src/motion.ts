import {useEffect, useState} from 'react';

type Gsap = typeof import('gsap').gsap;
type ST = typeof import('gsap/ScrollTrigger').ScrollTrigger;

let loading: Promise<{gsap: Gsap; ScrollTrigger: ST}> | null = null;

/** GSAP is loaded on demand, after the page has painted, so it never delays the first view. */
export function loadGsap() {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, s]) => {
    g.gsap.registerPlugin(s.ScrollTrigger);
    return {gsap: g.gsap, ScrollTrigger: s.ScrollTrigger};
  });
  return loading;
}

export const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** False on the server and in the first client render (matches the static HTML), then the real preference. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/**
 * Fades [data-reveal] elements in once they scroll into view. Nothing is hidden until this runs: elements already
 * on screen are marked shown first, then html.reveal-on lets CSS hide the rest, so nothing visible ever blinks.
 */
export function useReveal(key: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    if (!('IntersectionObserver' in window) || prefersReduced()) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const h = window.innerHeight;
    els.forEach((el) => el.getBoundingClientRect().top < h && el.classList.add('is-in'));
    document.documentElement.classList.add('reveal-on');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
      },
      {rootMargin: '0px 0px -6% 0px', threshold: 0.06},
    );
    els.forEach((el) => io.observe(el));
    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.matches('[data-reveal]')) io.observe(n);
          n.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => io.observe(el));
        });
    });
    mo.observe(document.body, {childList: true, subtree: true});
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [key]);
}

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
