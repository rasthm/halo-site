import './fonts.css';
import './style.css';
import './sections.css';
import './entry.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {initIntro} from './intro';
import {runEntry} from './entry';
import {initCore} from './core';
import {initWork} from './work';
import {initBuild, initFounder, initHow, initPricing} from './sections';
import {grainMove, grainStop, initSound, musicFrame, play, setHum} from './sound';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s);

// smooth scroll drives ScrollTrigger from GSAP's single clock
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({lerp: 0.1, autoRaf: false, anchors: true});
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

initSound();

// entrance first; the page stays still under it, then the hero plays its own entrance
if (document.documentElement.classList.contains('is-entering')) lenis?.stop();
const entered = runEntry(reduce);
entered.then(() => {
  lenis?.start();
  const root = document.documentElement;
  const lines = gsap.utils.toArray<HTMLElement>('.hero h1 .ln > span');
  if (reduce) { root.classList.add('ready'); return; }
  // clear the CSS start offset (GSAP would read it as a fixed y) and own the motion from here
  if (lines.length) gsap.set(lines, {y: 0, yPercent: 110});
  root.classList.add('ready');
  if (lines.length) gsap.to(lines, {yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09});
  const rest = gsap.utils.toArray<HTMLElement>('.hero .lede, .hero .acts');
  if (rest.length) gsap.fromTo(rest, {opacity: 0, y: 18}, {opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.25});
  gsap.fromTo('.nav', {opacity: 0, y: -12}, {opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1});
});

// music follows the scroll: speed opens the sound, the section sets the colour
gsap.ticker.add(() => musicFrame(lenis?.velocity ?? 0, document.body.dataset.theme ?? 'sweep'));

// live India time in the nav
const clock = $('[data-clock]')!;
const tick = () => (clock.textContent = 'India ' + new Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit'}).format(new Date()));
tick();
setInterval(tick, 15000);

(async () => {
  await document.fonts.ready;
  // create pinned sections top to bottom so ScrollTrigger measures them in page order
  const photo = $('.photo');
  if (photo) await initIntro(photo, reduce, entered).catch((e) => console.warn('intro', e));
  // the device dissolving into dots (and re-forming on the way back) gets its granular sweep
  if (photo) ScrollTrigger.create({trigger: '.hero', start: '18% top', onEnter: () => play('assemble', {volume: 0.7}), onLeaveBack: () => play('assemble', {volume: 0.5, rate: 0.9})});
  // the cursor over the device: the grain follows how fast it moves
  if (photo && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let lx = 0, ly = 0, lt = 0;
    photo.addEventListener('pointermove', (e) => {
      const now = performance.now(), dt = Math.max(8, now - lt);
      const speed = lt ? (Math.hypot(e.clientX - lx, e.clientY - ly) / dt) * 1000 : 0; // px per second
      lx = e.clientX; ly = e.clientY; lt = now;
      grainMove(speed);
    });
    photo.addEventListener('pointerleave', () => { lt = 0; grainStop(); });
  }
  if ($('#how')) initHow($('#how')!, reduce);
  if ($('#build')) initBuild($('#build')!, () => lenis, reduce);
  if ($('#core')) {
    initCore($('#core')!, reduce);
    ScrollTrigger.create({trigger: '#core', start: 'top 60%', end: 'bottom 40%', onToggle: (s) => setHum(s.isActive)});
  }
  if ($('#work')) initWork($('#work')!, () => lenis?.velocity ?? 0, reduce);
  if ($('#founder')) initFounder($('#founder')!, reduce);
  if ($('#pricing')) initPricing($('#pricing')!, reduce);

  // body theme follows the section in the middle of the screen
  document.querySelectorAll<HTMLElement>('main > section[data-theme]').forEach((sec) => {
    ScrollTrigger.create({trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => {
      if (!s.isActive || document.body.dataset.theme === sec.dataset.theme) return;
      document.body.dataset.theme = sec.dataset.theme;
      play('whoosh');
    }});
  });

  // scroll ruler 000 -> 100
  const ruler = $('[data-ruler]')!;
  ScrollTrigger.create({start: 0, end: 'max', onUpdate: (s) => {
    ruler.textContent = String(Math.round(s.progress * 100)).padStart(3, '0');
    ruler.parentElement!.style.setProperty('--p', s.progress.toFixed(3));
  }});
  ScrollTrigger.refresh();
})();
