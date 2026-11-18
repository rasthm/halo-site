/**
 * The entrance: once per visit, a dark "boot" screen. The halo ring draws, the amber counter climbs with the
 * real loading (fonts, hero photo), the services report OK one by one, then the screen wipes up over an orange
 * band and the hero plays its own entrance. Any click or key skips it. Reduced motion: a short fade only.
 * Resolves when the hero should start its entrance.
 */
import gsap from 'gsap';

export function runEntry(reduce: boolean): Promise<void> {
  const root = document.documentElement;
  const el = document.querySelector<HTMLElement>('.entry');
  if (!el || !root.classList.contains('is-entering')) { el?.remove(); return Promise.resolve(); }
  try { sessionStorage.setItem('halo-entered', '1'); } catch { /* private mode: plays each load */ }

  const done = () => { root.classList.remove('is-entering'); el.remove(); };
  if (reduce) {
    return new Promise((resolve) => {
      gsap.to(el, {opacity: 0, duration: 0.3, delay: 0.4, onStart: resolve, onComplete: done});
    });
  }

  const ring = el.querySelector<SVGEllipseElement>('.entry-ring ellipse')!;
  const count = el.querySelector<HTMLElement>('[data-count]')!;
  const logs = [...el.querySelectorAll<HTMLElement>('.entry-log li')];
  const inner = el.querySelector<HTMLElement>('.entry-in')!;
  const dark = el.querySelector<HTMLElement>('.entry-dark')!;
  const band = el.querySelector<HTMLElement>('.entry-band')!;
  const len = ring.getTotalLength();
  gsap.set(ring, {strokeDasharray: len, strokeDashoffset: len});

  // real loading: the counter may run ahead to 80, then waits for the assets before it reaches 100
  const hero = document.querySelector<HTMLImageElement>('.photo img');
  const assets = Promise.all([document.fonts.ready, hero ? hero.decode().catch(() => {}) : null]);
  const state = {p: 0};
  const show = () => {
    const p = Math.round(state.p);
    count.textContent = String(p).padStart(3, '0');
    logs.forEach((li, i) => li.classList.toggle('on', p >= ((i + 1) / (logs.length + 1)) * 100));
  };

  return new Promise((resolve) => {
    const tl = gsap.timeline();
    tl.to(ring, {strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut'}, 0)
      .from('.entry-word span', {yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.05}, 0.2)
      .to(state, {p: 80, duration: 1.5, ease: 'power1.inOut', onUpdate: show}, 0.1)
      .addPause('+=0', () => { assets.then(() => tl.resume()); });
    tl.to(state, {p: 100, duration: 0.4, ease: 'power2.out', onUpdate: show})
      .to(count, {opacity: 0.25, duration: 0.06, repeat: 3, yoyo: true, ease: 'none'})
      // exit: content lifts, the dark screen wipes up, the orange band follows a beat later
      .to(inner, {y: -40, opacity: 0, duration: 0.5, ease: 'power3.in'}, '+=0.05')
      .to(dark, {clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut'}, '-=0.2')
      .add(() => resolve(), '-=0.45')
      .to(band, {clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut'}, '-=0.75')
      .add(done);

    // skip: jump straight to the exit (but never before the assets are ready)
    const skip = () => {
      removeEventListener('pointerdown', skip);
      removeEventListener('keydown', skip);
      assets.then(() => tl.timeScale(4).resume());
    };
    addEventListener('pointerdown', skip);
    addEventListener('keydown', skip);
  });
}
