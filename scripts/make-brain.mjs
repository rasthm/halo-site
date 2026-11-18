// Draws the Halo brain: a side view (front to the left) with a folded cortex, cerebellum and brain stem.
// The folds are the zero-contours of a smooth wave field, clipped to the cerebrum, so they meander like gyri.
// Output: src/brain-art.ts (path strings only, so the drawing is identical on the server and in the browser).
// Run: node scripts/make-brain.mjs
import fs from 'node:fs';

const r1 = (n) => Math.round(n * 10) / 10;

/** Closed Catmull-Rom spline through the points, as SVG cubic Béziers. */
function smoothClosed(pts, t = 0.5) {
  const n = pts.length;
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + ((p2[0] - p0[0]) * t) / 3, p1[1] + ((p2[1] - p0[1]) * t) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * t) / 3, p2[1] - ((p3[1] - p1[1]) * t) / 3];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d + 'Z';
}
/** Open Catmull-Rom spline. */
function smoothOpen(pts, t = 0.5) {
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + ((p2[0] - p0[0]) * t) / 3, p1[1] + ((p2[1] - p0[1]) * t) / 3];
    const c2 = [p2[0] - ((p3[0] - p1[0]) * t) / 3, p2[1] - ((p3[1] - p1[1]) * t) / 3];
    d += `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d;
}

// ---- shapes, in a 400 × 300 box
const CEREBRUM = [
  [72, 170], [50, 146], [42, 112], [54, 78], [82, 50], [122, 31], [170, 20], [224, 18], [276, 27], [319, 47],
  [350, 78], [367, 112], [367, 146], [352, 172], [326, 188], [298, 196], [268, 206], [236, 220], [198, 226],
  [160, 220], [132, 206], [114, 190], [100, 180],
];
const CEREBELLUM = [[270, 196], [306, 178], [344, 176], [366, 192], [366, 220], [342, 240], [304, 242], [278, 226]];
const STEM = [[236, 206], [268, 200], [276, 236], [280, 282], [262, 292], [250, 258], [240, 230]];

// Point-in-polygon on the control polygon (close enough to the smooth outline for choosing what to keep).
function inside(poly, x, y) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

// ---- gyri: contours of a wave field
const f = (x, y) =>
  Math.sin(x * 0.13 + 1.6 * Math.sin(y * 0.09 + 0.4)) +
  Math.sin(y * 0.15 + 1.4 * Math.sin(x * 0.085 + 1.1)) +
  0.6 * Math.sin((x * 0.6 + y) * 0.11 + 2.0);

const STEP = 2.5;
const segs = [];
for (let x = 30; x < 380; x += STEP)
  for (let y = 8; y < 236; y += STEP) {
    const a = f(x, y), b = f(x + STEP, y), c = f(x + STEP, y + STEP), d = f(x, y + STEP);
    const pts = [];
    const edge = (v1, v2, p1, p2) => {
      if (v1 > 0 === v2 > 0) return;
      const t = v1 / (v1 - v2);
      pts.push([p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t]);
    };
    edge(a, b, [x, y], [x + STEP, y]);
    edge(b, c, [x + STEP, y], [x + STEP, y + STEP]);
    edge(c, d, [x + STEP, y + STEP], [x, y + STEP]);
    edge(d, a, [x, y + STEP], [x, y]);
    if (pts.length === 2) segs.push(pts);
    else if (pts.length === 4) segs.push([pts[0], pts[1]], [pts[2], pts[3]]);
  }

// Join segments into polylines.
const key = (p) => `${Math.round(p[0] * 100)},${Math.round(p[1] * 100)}`;
const ends = new Map();
segs.forEach((s, i) => s.forEach((p) => (ends.get(key(p)) ?? ends.set(key(p), []).get(key(p))).push(i)));
const used = new Set();
const lines = [];
for (let i = 0; i < segs.length; i++) {
  if (used.has(i)) continue;
  used.add(i);
  const line = [...segs[i]];
  for (const dir of [1, -1]) {
    for (;;) {
      const tip = dir === 1 ? line[line.length - 1] : line[0];
      const next = (ends.get(key(tip)) || []).find((j) => !used.has(j));
      if (next === undefined) break;
      used.add(next);
      const s = segs[next];
      const other = key(s[0]) === key(tip) ? s[1] : s[0];
      dir === 1 ? line.push(other) : line.unshift(other);
    }
  }
  lines.push(line);
}

// Keep the parts of each line that sit inside the cerebrum (with a margin from the edge), split where they leave it.
const margin = (x, y) => inside(CEREBRUM, x, y) && [[4, 0], [-4, 0], [0, 4], [0, -4]].every(([dx, dy]) => inside(CEREBRUM, x + dx, y + dy));
const pieces = [];
for (const l of lines) {
  let cur = [];
  for (const p of l) {
    if (margin(p[0], p[1])) cur.push(p);
    else {
      if (cur.length > 4) pieces.push(cur);
      cur = [];
    }
  }
  if (cur.length > 4) pieces.push(cur);
}
// Thin each piece (every 3rd point) and smooth it.
const folds = pieces
  .map((p) => p.filter((_, i) => i % 3 === 0 || i === p.length - 1))
  .filter((p) => p.length >= 3)
  .map((p) => smoothOpen(p));

// Longest pieces carry the "signal" pulses.
const byLength = pieces
  .map((p) => ({p, len: p.reduce((s, q, i) => (i ? s + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0)}))
  .sort((a, b) => b.len - a.len);
const signals = byLength.slice(0, 7).map(({p}) => smoothOpen(p.filter((_, i) => i % 3 === 0 || i === p.length - 1)));

// Two landmark fissures drawn by hand.
const sylvian = smoothOpen([[100, 180], [132, 166], [170, 152], [210, 140], [242, 130], [262, 112]]);
const central = smoothOpen([[228, 20], [222, 40], [228, 58], [216, 78], [220, 98], [206, 118], [198, 136]]);

// Cerebellum folia: arcs clipped by a clipPath in the component.
const folia = Array.from({length: 9}, (_, i) => {
  const y = 180 + i * 6.6;
  return smoothOpen([[276, y + 6], [310, y - 2], [345, y + 1], [374, y + 10]]);
});
const stemLines = [smoothOpen([[250, 210], [258, 248], [262, 286]]), smoothOpen([[262, 206], [268, 246], [272, 286]])];

// A bumpy cortex edge: sample the smooth outline densely and push it in and out a little, like gyri meeting the edge.
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t, t3 = t2 * t;
  return [0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3));
}
function bumpy(pts, amp, per) {
  const n = pts.length, dense = [];
  for (let i = 0; i < n; i++) for (let s = 0; s < 8; s++) dense.push(catmull(pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n], s / 8));
  const m = dense.length;
  return dense.map((p, i) => {
    const a = dense[(i - 1 + m) % m], b = dense[(i + 1) % m];
    const nx = b[1] - a[1], ny = -(b[0] - a[0]), l = Math.hypot(nx, ny) || 1;
    const k = amp * Math.sin((i / m) * Math.PI * per) ** 2;
    return [p[0] - (nx / l) * k, p[1] - (ny / l) * k];
  });
}
const cortexEdge = smoothClosed(bumpy(CEREBRUM, 3, 24), 0.5);

const out = `// Generated by scripts/make-brain.mjs. Do not edit by hand.
export const BRAIN_VIEW = {w: 400, h: 300};
export const brainArt = {
  cerebrum: ${JSON.stringify(cortexEdge)},
  cerebellum: ${JSON.stringify(smoothClosed(CEREBELLUM))},
  stem: ${JSON.stringify(smoothClosed(STEM))},
  folds: ${JSON.stringify(folds.join(''))},
  signals: ${JSON.stringify(signals)},
  fissures: ${JSON.stringify(sylvian + central)},
  folia: ${JSON.stringify(folia.join(''))},
  stemLines: ${JSON.stringify(stemLines.join(''))},
};
`;
fs.writeFileSync('src/brain-art.ts', out);
console.log(`brain-art.ts: ${folds.length} folds, ${(out.length / 1024).toFixed(1)} KB`);
