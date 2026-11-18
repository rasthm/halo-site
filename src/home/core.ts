/**
 * "Every system. One core." A pinned, scroll-scrubbed diagram: six sources stream into the Halo core,
 * the core learns, work flows out, and the readout counts the hours given back.
 * Chapters: CONNECT, LEARN, ACT, MEASURE, with a timecode like a signal log.
 */
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

type Strand = {pts: Float32Array; len: number; phase: number; amp: number; freq: number; group: 'in' | 'out'; packet: number};
const CHAPTERS = ['01 — Connect · six sources', '02 — Learn · one core', '03 — Act · work flows out', '04 — Measure · hours back'];
const HOURS = 152; // 10 people × 7 h a week × 52/12 × half automated

export function initCore(section: HTMLElement, reduce: boolean) {
  const pin = section.querySelector<HTMLElement>('.core-pin')!;
  const canvas = section.querySelector<HTMLCanvasElement>('.core-canvas')!;
  const ctx = canvas.getContext('2d')!;
  const srcs = [...section.querySelectorAll<HTMLElement>('.src')];
  const outs = [...section.querySelectorAll<HTMLElement>('.out')];
  const dev = section.querySelector<HTMLElement>('.dev')!;
  const keys = [...section.querySelectorAll<HTMLElement>('.dev-keys i')];
  const lcd = section.querySelector<HTMLElement>('[data-lcd]')!;
  const chapter = section.querySelector<HTMLElement>('[data-chapter]')!;
  const tc = section.querySelector<HTMLElement>('[data-tc]')!;
  const hoursEl = section.querySelector<HTMLElement>('[data-hours]')!;
  const pause = section.querySelector<HTMLButtonElement>('.pause')!;

  const state = {conn: 0, learn: 0, act: 0, measure: 0};
  let strands: Strand[] = [];
  let W = 0, H = 0, dpr = 1;

  const rel = (el: Element) => {
    const r = el.getBoundingClientRect(), p = pin.getBoundingClientRect();
    return {l: r.left - p.left, t: r.top - p.top, w: r.width, h: r.height};
  };

  // build dotted strands along cubic curves, 3 per connection, sampled by arc length
  const layout = () => {
    dpr = Math.min(devicePixelRatio, 2);
    W = pin.clientWidth; H = pin.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const d = rel(dev);
    const cx = d.l + d.w / 2, cy = d.t + d.h / 2;
    const make = (ax: number, ay: number, bx: number, by: number, group: 'in' | 'out', seed: number): Strand[] =>
      [0, 1, 2].map((k) => {
        const horiz = Math.abs(bx - ax) > Math.abs(by - ay);
        const c1 = horiz ? [ax + (bx - ax) * 0.5, ay] : [ax, ay + (by - ay) * 0.5];
        const c2 = horiz ? [bx - (bx - ax) * 0.35, by] : [bx, by - (by - ay) * 0.35];
        const n = 220;
        const raw: number[] = [];
        for (let i = 0; i <= n; i++) {
          const t = i / n, mt = 1 - t;
          raw.push(mt * mt * mt * ax + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t * t * t * bx,
            mt * mt * mt * ay + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t * t * t * by);
        }
        let len = 0;
        for (let i = 2; i < raw.length; i += 2) len += Math.hypot(raw[i] - raw[i - 2], raw[i + 1] - raw[i - 1]);
        return {pts: new Float32Array(raw), len, phase: seed * 1.7 + k * 2.1, amp: 6 + k * 7, freq: 2 + k * 1.3, group, packet: Math.random()};
      });
    strands = [];
    srcs.forEach((s, i) => { const r = rel(s); const horiz = W > 980; strands.push(...make(horiz ? r.l + r.w : r.l + r.w / 2, horiz ? r.t + r.h / 2 : r.t + r.h, cx, cy, 'in', i)); });
    outs.forEach((o, i) => { const r = rel(o); const horiz = W > 980; strands.push(...make(cx, cy, horiz ? r.l : r.l + r.w / 2, horiz ? r.t + r.h / 2 : r.t, 'out', i + 7)); });
  };

  // point at fraction s along a strand, with a wobble that is zero at both ends
  const at = (st: Strand, s: number, time: number) => {
    const f = s * (st.pts.length / 2 - 1);
    const i = Math.floor(f), t = f - i, j = i * 2;
    const x0 = st.pts[j], y0 = st.pts[j + 1], x1 = st.pts[j + 2] ?? x0, y1 = st.pts[j + 3] ?? y0;
    const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
    const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny) || 1;
    const wob = Math.sin(s * Math.PI * st.freq + st.phase + time * 0.6) * st.amp * Math.sin(s * Math.PI);
    return [x + (nx / nl) * wob, y + (ny / nl) * wob];
  };

  let time = 0, paused = false;
  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (const st of strands) {
      const reach = st.group === 'in' ? state.conn : state.act;
      if (reach <= 0) continue;
      const spacing = 7, count = Math.floor(st.len / spacing);
      const flow = ((time * 34) % spacing) / st.len;
      ctx.fillStyle = 'rgba(241,235,226,0.5)';
      for (let k = 0; k < count; k++) {
        const s = k / count + flow;
        if (s > reach || s > 1) continue;
        const [x, y] = at(st, s, time);
        ctx.fillRect(x - 0.8, y - 0.8, 1.6, 1.6);
      }
      // amber packets travel only once the line is fully drawn
      if (reach >= 1) {
        const s = (st.packet + time * (st.group === 'in' ? 0.18 : 0.26)) % 1;
        const [x, y] = at(st, s, time);
        ctx.fillStyle = 'rgba(255,138,31,0.18)';
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ff8a1f';
        ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
      }
    }
  };

  // DOM states that follow the scrub
  const apply = (p: number) => {
    const ch = Math.min(3, Math.floor(p * 4.0001));
    chapter.textContent = CHAPTERS[ch];
    tc.textContent = `T+${(p * 6).toFixed(1).padStart(4, '0')}`;
    srcs.forEach((s, i) => s.classList.toggle('lit', state.conn > (i + 1) / 7));
    keys.forEach((k, i) => k.classList.toggle('lit', state.learn > (i + 1) / 7));
    dev.classList.toggle('on', state.learn > 0.05);
    dev.classList.toggle('go', state.measure > 0.5);
    outs.forEach((o, i) => o.classList.toggle('lit', state.measure > (i + 1) / 4));
    const hrs = Math.round(HOURS * state.measure);
    hoursEl.textContent = String(hrs);
    lcd.textContent = state.learn > 0.05 ? String(Math.round(6 * Math.min(1, state.learn * 1.2))).padStart(3, '0') + (state.measure > 0 ? '' : '') : '000';
    if (state.measure > 0) lcd.textContent = String(hrs).padStart(3, '0');
  };

  layout();
  addEventListener('resize', () => { layout(); draw(); });

  if (reduce) {
    Object.assign(state, {conn: 1, learn: 1, act: 1, measure: 1});
    gsap.set([...srcs, ...outs], {opacity: 1});
    apply(1);
    draw();
    pause.hidden = true;
    return;
  }

  // DOM follows the scrubbed timeline (not the raw scroll), so labels and numbers settle with the drawing
  const tl = gsap.timeline({
    defaults: {ease: 'none'},
    onUpdate: () => apply(tl.progress()),
    scrollTrigger: {trigger: section, start: 'top top', end: '+=320%', pin: pin, scrub: 0.6, onRefresh: layout},
  });
  // CONNECT: sources arrive one by one, their lines draw into the core
  tl.fromTo(srcs, {opacity: 0, x: -24}, {opacity: 1, x: 0, stagger: 0.04, duration: 0.12, ease: 'power2.out'}, 0)
    .to(state, {conn: 1, duration: 0.3}, 0.02)
    // LEARN: the core lights up key by key
    .to(state, {learn: 1, duration: 0.22}, 0.3)
    // ACT: work flows out to three outcomes
    .fromTo(outs, {opacity: 0, x: 24}, {opacity: 1, x: 0, stagger: 0.04, duration: 0.1, ease: 'power2.out'}, 0.52)
    .to(state, {act: 1, duration: 0.24}, 0.54)
    // MEASURE: the readout counts the hours back
    .to(state, {measure: 1, duration: 0.2, ease: 'power2.out'}, 0.78)
    .to({}, {duration: 0.04});

  pause.addEventListener('click', () => {
    paused = !paused;
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Signal: paused · play' : 'Signal: live · pause';
  });

  let visible = false;
  ScrollTrigger.create({trigger: section, start: 'top bottom', end: 'bottom top', onToggle: (s) => (visible = s.isActive)});
  gsap.ticker.add((_t, dt) => {
    if (!visible) return;
    if (!paused) time += dt / 1000;
    draw();
  });
}
