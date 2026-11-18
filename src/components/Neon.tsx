import {neonGlyphs} from '../neon-glyphs';

/**
 * A short phrase drawn as a bent neon tube (single-stroke EMS Allure script, see scripts/make-neon.mjs).
 * Layers, back to front: the light it throws on the wall, the tube, the bright core. When `lit` is false
 * it is clear unlit glass. `state` lets a parent drive it ("off" | "on" | "igniting"); CSS does the rest.
 * The SVG is decorative: the words are repeated for screen readers unless `decorative` is set.
 */

const SPACE = 280;
const LINE = 1120;

/** x, y and the angle (degrees) the tube leaves in. */
type Point = [number, number, number];

function layoutLine(text: string) {
  let x = 0;
  let d = '';
  let first: Point | null = null;
  let last: Point | null = null;
  let top = 0;
  let bottom = 0;
  for (const raw of text.replace(/₹/g, 'Rs ')) {
    const g = neonGlyphs[raw];
    if (!g) {
      x += SPACE;
      continue;
    }
    const [adv, path, a, b, box] = g;
    if (box) {
      top = Math.min(top, box[0]);
      bottom = Math.max(bottom, box[1]);
    }
    if (path) d += `<path transform="translate(${x} 0)" d="${path}"/>`;
    if (a && !first) first = [a[0] + x, a[1], a[2]];
    if (b) last = [b[0] + x, b[1], b[2]];
    x += adv;
  }
  return {width: x, d, first, last, top, bottom};
}

export type NeonState = 'off' | 'on' | 'igniting';

export function Neon({
  text,
  lines,
  state = 'on',
  tone = 'red',
  electrodes = false,
  decorative = false,
  className = '',
  height,
}: {
  text: string;
  /** Explicit line breaks; defaults to one line. */
  lines?: string[];
  state?: NeonState;
  tone?: 'red' | 'argon';
  electrodes?: boolean;
  decorative?: boolean;
  className?: string;
  /** Rendered height of one line of lettering, in px (CSS can override with --neon-h). */
  height?: number;
}) {
  const rows = (lines ?? [text]).map(layoutLine);
  const width = Math.max(...rows.map((r) => r.width));
  // Box the ink, not the font's full ascent: lowercase words would otherwise float under empty space.
  const pad = 70;
  const top = Math.min(...rows.map((r, i) => r.top + i * LINE)) - pad;
  const h = Math.max(...rows.map((r, i) => r.bottom + i * LINE)) + pad - top;
  const body = rows.map((r, i) => `<g transform="translate(0 ${i * LINE})">${r.d}</g>`).join('');
  const ends: Point[] = [];
  if (electrodes) {
    const f = rows[0].first;
    const l = rows[rows.length - 1].last;
    if (f) ends.push(f);
    if (l) ends.push([l[0], l[1] + (rows.length - 1) * LINE, l[2]]);
  }
  return (
    <span className={`neon neon--${tone} ${className}`} data-state={state} style={height ? {['--neon-h' as string]: `${height}px`} : undefined}>
      <svg
        className="neon__svg"
        viewBox={`${-pad} ${top} ${width + pad * 2} ${h}`}
        aria-hidden="true"
        focusable="false"
        style={{aspectRatio: `${width + pad * 2} / ${h}`, ['--k' as string]: (h / 1000).toFixed(3)}}
      >
        <g className="neon__spill" dangerouslySetInnerHTML={{__html: body}} />
        <g className="neon__tube" dangerouslySetInnerHTML={{__html: body}} />
        <g className="neon__core" dangerouslySetInnerHTML={{__html: body}} />
        {ends.map(([x, y, a], i) => (
          // A metal sleeve sealed onto the tube end, hot where the glass meets the metal.
          <g key={i} className="neon__electrode" transform={`translate(${x} ${y}) rotate(${a})`}>
            <rect className="neon__sleeve" x="10" y="-26" width="96" height="52" rx="18" />
            <rect className="neon__band" x="66" y="-30" width="14" height="60" rx="5" />
            <circle className="neon__tip" r="22" />
          </g>
        ))}
      </svg>
      {!decorative && <span className="sr-only">{lines ? lines.join(' ') : text}</span>}
    </span>
  );
}
