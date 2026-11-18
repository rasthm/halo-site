import {useCallback, useEffect, useRef} from 'react';
import {systems} from '../content';
import {clamp01, easeBack, easeInOut, easeOut, loadGsap, prefersReduced} from '../motion';

/**
 * The signature visual: your systems drift as scattered tiles, then connect into the company brain
 * and the halo ring settles on top. One drawing, three uses:
 *   scattered  the hero (your business today)
 *   scroll     driven by the page scroll through setProgress (home, "The company brain")
 *   intro      starts scattered and assembles once the page has loaded (The Brain page header)
 *   connected  plays the assembly when it scrolls into view; if already on screen, stays connected (closing band)
 * Without JavaScript, or with reduced motion, it shows a still state.
 */

const W = 640;
const H = 600;
const C = {x: 320, y: 332};

type Spot = {x: number; y: number; r: number};
const CONNECTED: Record<string, Spot> = {
  crm: {x: 80, y: 236, r: 0},
  erp: {x: 80, y: 428, r: 0},
  docs: {x: 560, y: 236, r: 0},
  email: {x: 560, y: 428, r: 0},
  chats: {x: 196, y: 548, r: 0},
  sheets: {x: 444, y: 548, r: 0},
};
const SCATTERED: Record<string, Spot> = {
  crm: {x: 128, y: 96, r: -11},
  erp: {x: 84, y: 486, r: 7},
  docs: {x: 534, y: 118, r: 9},
  email: {x: 566, y: 372, r: -8},
  chats: {x: 250, y: 556, r: 6},
  sheets: {x: 486, y: 524, r: -13},
};
const RING = {connected: {cy: 196, rx: 112, ry: 23}, scattered: {cy: 92, rx: 150, ry: 30}};

// The brain's inner network: fixed pseudo-random points, identical on the server and in the browser.
const NODES = (() => {
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts: {x: number; y: number}[] = [];
  while (pts.length < 15) {
    const a = rnd() * Math.PI * 2;
    const d = Math.sqrt(rnd()) * 64;
    pts.push({x: C.x + Math.cos(a) * d, y: C.y + Math.sin(a) * d * 0.92});
  }
  const links: [number, number][] = [];
  pts.forEach((p, i) => {
    const near = pts
      .map((q, j) => ({j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2}))
      .filter((n) => n.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    near.forEach((n) => i < n.j && links.push([i, n.j]));
  });
  return {pts, links};
})();

const linePath = (s: Spot) => {
  const mx = (s.x + C.x) / 2;
  return `M ${s.x} ${s.y} C ${mx} ${s.y}, ${mx} ${C.y}, ${C.x} ${C.y}`;
};
const tf = (s: Spot) => `translate(${s.x.toFixed(1)} ${s.y.toFixed(1)}) rotate(${s.r.toFixed(2)})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type Mode = 'scattered' | 'intro' | 'connected' | 'scroll';

export function HaloField({mode, className = '', onReady, label}: {mode: Mode; className?: string; onReady?: (set: (p: number) => void) => void; label?: string}) {
  const svg = useRef<SVGSVGElement>(null);
  const tiles = useRef<(SVGGElement | null)[]>([]);
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const brain = useRef<SVGGElement>(null);
  const ring = useRef<SVGGElement>(null);
  const ringShape = useRef<(SVGEllipseElement | null)[]>([]);

  const start = mode === 'scattered' || mode === 'intro' ? 0 : 1;

  /** Draws the whole scene at progress p (0 = scattered, 1 = connected). */
  const setProgress = useCallback((p: number) => {
    const el = svg.current;
    if (!el) return;
    systems.forEach((s, i) => {
      const t = easeInOut(clamp01((p - i * 0.045) / 0.55));
      const a = SCATTERED[s.id];
      const b = CONNECTED[s.id];
      tiles.current[i]?.setAttribute('transform', tf({x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), r: lerp(a.r, b.r, t)}));
      const l = lines.current[i];
      if (l) l.style.strokeDashoffset = String(1 - easeOut(clamp01((p - 0.32 - i * 0.035) / 0.36)));
    });
    const lit = easeOut(clamp01((p - 0.28) / 0.42));
    if (brain.current) {
      brain.current.style.opacity = String(0.55 + 0.45 * lit);
      brain.current.setAttribute('transform', `translate(${C.x} ${C.y}) scale(${0.86 + 0.14 * lit}) translate(${-C.x} ${-C.y})`);
    }
    const rt = easeBack(clamp01((p - 0.55) / 0.45));
    const cy = lerp(RING.scattered.cy, RING.connected.cy, rt);
    const rx = lerp(RING.scattered.rx, RING.connected.rx, Math.min(1, rt));
    const ry = lerp(RING.scattered.ry, RING.connected.ry, Math.min(1, rt));
    ringShape.current.forEach((e) => {
      if (!e) return;
      e.setAttribute('cy', cy.toFixed(1));
      e.setAttribute('rx', rx.toFixed(1));
      e.setAttribute('ry', ry.toFixed(1));
    });
    if (ring.current) ring.current.style.opacity = String(0.45 + 0.55 * clamp01(rt));
    el.classList.toggle('is-live', p >= 0.97);
    el.style.setProperty('--glow', clamp01((p - 0.7) / 0.3).toFixed(3));
  }, []);

  useEffect(() => {
    if (mode === 'scroll') {
      onReady?.(setProgress);
      return;
    }
    if (mode === 'scattered') return;
    if (prefersReduced()) {
      setProgress(1);
      return;
    }
    const el = svg.current!;
    let tween: {kill(): void} | undefined;
    const play = (delay: number) =>
      loadGsap().then(({gsap}) => {
        const state = {p: 0};
        tween = gsap.to(state, {p: 1, duration: 2.4, ease: 'none', delay, onUpdate: () => setProgress(state.p)});
      }).catch(() => setProgress(1));
    if (mode === 'intro') {
      play(0.35);
      return () => tween?.kill();
    }
    // connected: if it is already on screen, leave it whole; otherwise take it apart and assemble it on arrival.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setProgress(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        play(0.15);
      },
      {threshold: 0.45},
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, [mode, onReady, setProgress]);

  const ringInit = start ? RING.connected : RING.scattered;

  return (
    <svg
      ref={svg}
      className={`field field--${mode} ${start ? 'is-live' : ''} ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label ?? 'Illustration: CRM, ERP, docs, email, chats and sheets connected into one company brain, with the Halo ring above it'}
      style={{['--glow' as string]: start}}
    >
      <defs>
        <radialGradient id="field-core" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#3a1820" />
          <stop offset="55%" stopColor="#1a1217" />
          <stop offset="100%" stopColor="#120f14" />
        </radialGradient>
        <radialGradient id="field-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff3045" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ff3045" stopOpacity="0" />
        </radialGradient>
        <filter id="field-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <g className="field__orbits" aria-hidden="true">
        <ellipse cx={C.x} cy={C.y} rx="172" ry="150" />
        <ellipse cx={C.x} cy={C.y} rx="252" ry="226" />
      </g>

      <circle className="field__aura" cx={C.x} cy={C.y} r="190" fill="url(#field-aura)" />

      <g className="field__lines" aria-hidden="true">
        {systems.map((s, i) => {
          const d = linePath(CONNECTED[s.id]);
          return (
            <g key={s.id}>
              <path ref={(e) => void (lines.current[i] = e)} className="field__line" d={d} pathLength={1} style={{strokeDashoffset: 1 - start}} />
              <circle className="field__pulse" r="3.2">
                <animateMotion dur="2.8s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={d} />
              </circle>
            </g>
          );
        })}
      </g>

      <g ref={brain} className="field__brain" style={{opacity: start ? 1 : 0.55}} transform={start ? undefined : `translate(${C.x} ${C.y}) scale(0.86) translate(${-C.x} ${-C.y})`}>
        <circle cx={C.x} cy={C.y} r="98" fill="url(#field-core)" className="field__core" />
        <circle cx={C.x} cy={C.y} r="78" className="field__dots" />
        {NODES.links.map(([a, b]) => (
          <line key={`${a}-${b}`} className="field__synapse" x1={NODES.pts[a].x} y1={NODES.pts[a].y} x2={NODES.pts[b].x} y2={NODES.pts[b].y} />
        ))}
        {NODES.pts.map((p, i) => (
          <circle key={i} className={`field__node${i % 5 === 0 ? ' is-hot' : ''}`} cx={p.x} cy={p.y} r={i % 5 === 0 ? 3.4 : 2.2} />
        ))}
        <text className="field__brainlabel" x={C.x} y={C.y + 124} textAnchor="middle">
          COMPANY BRAIN
        </text>
      </g>

      <g ref={ring} className="field__ring" style={{opacity: start ? 1 : 0.45}}>
        <g className="field__ringfloat">
          <ellipse ref={(e) => void (ringShape.current[0] = e)} className="field__ringglow" cx={C.x} cy={ringInit.cy} rx={ringInit.rx} ry={ringInit.ry} filter="url(#field-blur)" />
          <ellipse ref={(e) => void (ringShape.current[1] = e)} className="field__ringline" cx={C.x} cy={ringInit.cy} rx={ringInit.rx} ry={ringInit.ry} />
        </g>
      </g>

      {systems.map((s, i) => (
        <g key={s.id} ref={(e) => void (tiles.current[i] = e)} className="field__tile" transform={tf(start ? CONNECTED[s.id] : SCATTERED[s.id])}>
          <g className="field__float" style={{animationDelay: `${-i * 1.3}s`}}>
            <rect x="-72" y="-29" width="144" height="58" rx="11" />
            <circle className="field__status" cx="-52" cy="-8" r="4" />
            <text className="field__tilelabel" x="-40" y="-2">
              {s.label}
            </text>
            <text className="field__tilenote" x="-52" y="17">
              {s.note}
            </text>
          </g>
        </g>
      ))}
    </svg>
  );
}
