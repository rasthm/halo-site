import {useEffect, useRef, useState, type RefObject} from 'react';
import {brainArt} from '../brain-art';
import {projectById, services} from '../content';
import {prefersReduced} from '../motion';
import {ArrowRight} from './Icons';
import {Neon, type NeonState} from './Neon';

/** Lit by default (what the static HTML shows). Below the fold it goes dark, then ignites with a start-up flicker on arrival. */
export function useIgnite<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<NeonState>('on');
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced() || !('IntersectionObserver' in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setState('off');
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setState('igniting');
        t = window.setTimeout(() => setState('on'), 900);
      },
      {threshold},
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [threshold]);
  return [ref, state] as const;
}

/* ------------------------------------------------------------------ shared glass */

/** One run of clear glass: a soft wall shadow, two bright edges around a hollow bore, and a glint. */
function Glass({d, className = ''}: {d: string; className?: string}) {
  return (
    <g className={`glass ${className}`}>
      <path className="glass__shadow" d={d} />
      <path className="glass__edge" d={d} />
      <path className="glass__bore" d={d} />
      <path className="glass__glint" d={d} />
    </g>
  );
}

/** A metal sleeve on a tube end; `a` is the direction the tube leaves in. */
function Sleeve({x, y, a, className = ''}: {x: number; y: number; a: number; className?: string}) {
  return (
    <g className={`sleeve ${className}`} transform={`translate(${x} ${y}) rotate(${a})`}>
      <rect className="sleeve__body" x="2" y="-5" width="18" height="10" rx="3.5" />
      <rect className="sleeve__band" x="13" y="-6" width="3" height="12" rx="1" />
      <circle className="sleeve__tip" r="3.6" />
    </g>
  );
}

/** A standoff clip holding the tube off the wall. */
function Clip({x, y, on}: {x: number; y: number; on?: boolean}) {
  return (
    <g className={`clip${on ? ' is-on' : ''}`} transform={`translate(${x} ${y})`}>
      <ellipse className="clip__shadow" cx="2" cy="7" rx="9" ry="3.5" />
      <rect className="clip__post" x="-5" y="-8" width="10" height="16" rx="3" />
      <rect className="clip__bracket" x="-7" y="-2.5" width="14" height="5" rx="2.5" />
      <circle className="clip__screw" cy="5" r="1.4" />
    </g>
  );
}

/* ------------------------------------------------------------------ hero circuit */

type P = [number, number];
/** Smooth path through points (Catmull-Rom as cubic Béziers). */
function through(pts: P[]) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const HV = {w: 520, h: 600};
const ANCHORS: P[] = [
  [56, 78],
  [244, 168],
  [72, 258],
  [244, 348],
  [72, 438],
  [244, 528],
];
const START: P = [20, 14];
const END: P = [500, 590];
const ROUTE = through([
  START,
  [32, 50],
  ANCHORS[0],
  [300, 94],
  [470, 128],
  [300, 168],
  ANCHORS[1],
  [120, 194],
  [40, 236],
  ANCHORS[2],
  [300, 274],
  [470, 310],
  [300, 348],
  ANCHORS[3],
  [120, 374],
  [40, 416],
  ANCHORS[4],
  [300, 454],
  [470, 490],
  [300, 528],
  ANCHORS[5],
  [130, 552],
  [300, 574],
  END,
]);
const LOOP = 8; // seconds for the current to run the whole tube
const HEAD = 0.12; // the lit dash's length, as a share of the tube

export function HeroCircuit() {
  const path = useRef<SVGPathElement>(null);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  // Light the sign the head of the current has reached: the anchors' positions along the tube, measured once.
  useEffect(() => {
    const el = path.current;
    if (!el || prefersReduced()) return;
    const total = el.getTotalLength();
    const at = ANCHORS.map(([ax, ay]) => {
      let best = 0;
      let bestD = Infinity;
      for (let s = 0; s <= total; s += 4) {
        const p = el.getPointAtLength(s);
        const d = (p.x - ax) ** 2 + (p.y - ay) ** 2;
        if (d < bestD) [bestD, best] = [d, s];
      }
      return best / total;
    });
    const t0 = performance.now();
    let raf = 0;
    // One clock moves the current and picks the lit sign, so the two can never drift apart.
    const tick = (now: number) => {
      const t = (((now - t0) / 1000) % LOOP) / LOOP;
      el.style.strokeDashoffset = String(1 - t);
      const head = (t + HEAD) % 1;
      let i = at.length - 1;
      while (i > 0 && head < at[i]) i--;
      setActive(head < at[0] ? at.length - 1 : i);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const lit = hover ?? active;
  const s = services[lit];
  return (
    <div className="hc">
      <svg className="hc__svg" viewBox={`0 0 ${HV.w} ${HV.h}`} aria-hidden="true" focusable="false">
        <Glass d={ROUTE} />
        <path ref={path} className="hc__current" d={ROUTE} pathLength={1} />
        {ANCHORS.map(([x, y], i) => (
          <Clip key={i} x={x} y={y} on={i === lit} />
        ))}
        <Sleeve x={START[0]} y={START[1]} a={-100} className="hc__start" />
        <Sleeve x={END[0]} y={END[1]} a={30} />
      </svg>
      <ul className="hc__signs">
        {services.map((x, i) => (
          <li key={x.id} style={{left: `${((ANCHORS[i][0] + 24) / HV.w) * 100}%`, top: `${(ANCHORS[i][1] / HV.h) * 100}%`}}>
            <a href={`#svc-${x.id}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}>
              <Neon text={x.short} state={i === lit ? 'on' : 'off'} />
            </a>
          </li>
        ))}
      </ul>
      <p className="hc__plate">
        <span>{s.short}</span>
        <span className="mono">live in {s.live.toLowerCase()}</span>
        <span className="mono">you measure: {s.measure.toLowerCase()}</span>
      </p>
    </div>
  );
}

/**
 * The lead: one glass tube from the sleeve on "one team." to the start of the circuit, so the word and the circuit
 * read as one hand-bent run. Measured from the real elements, so it follows any layout; desktop only.
 */
export function HeroLead({stage}: {stage: RefObject<HTMLElement | null>}) {
  const [d, setD] = useState('');
  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const mq = window.matchMedia('(min-width: 1000px)');
    let raf = 0;
    const measure = () => {
      raf = 0;
      const from = root.querySelectorAll('.hero__neon .neon__tip');
      const to = root.querySelector('.hc__start .sleeve__tip');
      if (!mq.matches || from.length < 2 || !to) return setD('');
      const o = root.getBoundingClientRect();
      const a = from[from.length - 1].getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const x1 = a.left + a.width / 2 - o.left;
      const y1 = a.top + a.height / 2 - o.top;
      const x2 = b.left + b.width / 2 - o.left;
      const y2 = b.top + b.height / 2 - o.top;
      // Out of the sleeve to the right, a soft bend up the gap, into the circuit's first sleeve from below.
      setD(`M${x1.toFixed(1)} ${y1.toFixed(1)} C${(x1 + 70).toFixed(1)} ${y1.toFixed(1)} ${(x2 - 6).toFixed(1)} ${(y2 + 160).toFixed(1)} ${x2.toFixed(1)} ${(y2 + 22).toFixed(1)}`);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    document.fonts?.ready.then(on);
    const ro = new ResizeObserver(on);
    ro.observe(root);
    mq.addEventListener('change', on);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', on);
      cancelAnimationFrame(raf);
    };
  }, [stage]);
  if (!d) return null;
  return (
    <svg className="hero__lead" aria-hidden="true" focusable="false">
      <Glass d={d} />
    </svg>
  );
}

/* ------------------------------------------------------------------ the service circuit */

/** A gently bent run down a tall, narrow column (stretched to the list's height; strokes keep their width). */
const RAIL = (() => {
  const pts: P[] = [];
  for (let y = 0; y <= 1000; y += 50) pts.push([20 + (y % 100 === 0 ? -6 : 6), y]);
  return through(pts);
})();

/** Every service hangs on one tube down the left edge; the current fills it as you scroll and ignites each name it reaches. */
export function ServiceCircuit() {
  const list = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(1);
  const [reached, setReached] = useState(services.length);

  useEffect(() => {
    const el = list.current;
    if (!el || prefersReduced()) return;
    let raf = 0;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(':scope > li'));
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const line = window.innerHeight * 0.62;
      const prog = Math.max(0, Math.min(1, (line - r.top) / r.height));
      setP(prog);
      setReached(rows.filter((row) => row.offsetTop + 40 <= prog * r.height).length);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', on, {passive: true});
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="circuit">
      <svg className="circuit__rail" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          {/* The lit length is a clip in the rail's own units: dash lengths don't survive the stretched, non-scaling stroke. */}
          <clipPath id="rail-lit">
            <rect x="-20" y="-20" width="80" height={(p * 1000 + 20).toFixed(1)} />
          </clipPath>
        </defs>
        <Glass d={RAIL} />
        {/* The glow sits on the group, outside the clip, so the light is never cut square. */}
        <g className="circuit__litg">
          <path className="circuit__lit" d={RAIL} clipPath="url(#rail-lit)" />
        </g>
      </svg>
      {p > 0.002 && p < 0.998 && (
        <span
          className="circuit__head"
          aria-hidden="true"
          // Rides the bend: the rail swings 6px either side of centre every 100 units.
          style={{top: `${(p * 100).toFixed(3)}%`, left: `${(4 + 20 - 6 * Math.cos((Math.PI * p * 1000) / 50)).toFixed(1)}px`}}
        />
      )}
      <ol ref={list} className="circuit__list">
        {services.map((x, i) => {
          const on = i < reached;
          const proof = projectById(x.proof);
          return (
            <li key={x.id} id={`svc-${x.id}`} className={`circuit__row${on ? ' is-on' : ''}`}>
              <svg className="circuit__clip" viewBox="-12 -12 24 24" aria-hidden="true" focusable="false">
                <Clip x={0} y={0} on={on} />
              </svg>
              <h3 className="circuit__name">
                <Neon text={x.short} state={on ? 'on' : 'off'} decorative />
                <span className="sr-only">{x.name}</span>
              </h3>
              <div className="circuit__body">
                <p className="circuit__line">{x.line}</p>
                <ul className="circuit__gets">
                  {x.gets.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
              <dl className="plate">
                <div>
                  <dt>Live in</dt>
                  <dd>{x.live}</dd>
                </div>
                <div>
                  <dt>You measure</dt>
                  <dd>{x.measure}</dd>
                </div>
              </dl>
              <a className="circuit__proof" href={x.href}>
                <span>{x.id === 'brain' ? 'How the company brain works' : x.id === 'automations' ? 'The agents we build' : `Built before: ${proof.title}`}</span>
                <ArrowRight width={16} height={16} />
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ a brain bent from tube */

export function NeonBrain({className = '', label}: {className?: string; label?: string}) {
  const [ref, state] = useIgnite<HTMLDivElement>(0.3);
  const tube = (d: string, k: string) => (
    <g className={`nb__${k}`}>
      <path className="nb__spill" d={d} />
      <path className="nb__tube" d={d} />
      <path className="nb__core" d={d} />
    </g>
  );
  return (
    <div ref={ref} className={`nb ${className}`} data-state={state} {...(label ? {role: 'img', 'aria-label': label} : {'aria-hidden': true})}>
      <svg viewBox="20 0 380 300" focusable="false">
        {tube(brainArt.stem, 'stem')}
        {tube(brainArt.cerebellum, 'cere')}
        {tube(brainArt.signals.slice(0, 5).join(''), 'fold')}
        {tube(brainArt.fissures, 'fissure')}
        {tube(brainArt.cerebrum, 'edge')}
        {brainArt.signals.slice(0, 5).map((d, i) => (
          <path key={i} className="nb__pulse" d={d} pathLength={1} style={{animationDelay: `${(i * 1.1).toFixed(1)}s`}} />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ the open sign */

/** Hung from two wires on a clear backer held off the wall by four standoffs, fed by one wire at the top. */
export function OpenSign({text}: {text: string}) {
  const [ref, state] = useIgnite<HTMLDivElement>(0.5);
  return (
    <div ref={ref} className="open">
      <span className="open__hook" aria-hidden="true" />
      <span className="open__hook open__hook--r" aria-hidden="true" />
      <span className="open__feed" aria-hidden="true" />
      <span className="open__standoff open__standoff--tl" aria-hidden="true" />
      <span className="open__standoff open__standoff--tr" aria-hidden="true" />
      <span className="open__standoff open__standoff--bl" aria-hidden="true" />
      <span className="open__standoff open__standoff--br" aria-hidden="true" />
      <Neon text={text} state={state} electrodes className="open__neon" />
    </div>
  );
}
