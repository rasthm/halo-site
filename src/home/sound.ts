/**
 * Sound kit: effects and music behind one switch. Always off when a page loads; only the visitor turns it on
 * (browsers block audio before a gesture anyway, and surprise sound is rude). Nothing is remembered.
 */
type Name = 'key' | 'switch' | 'tick' | 'beep' | 'whoosh' | 'hum' | 'assemble' | 'hover';
const NAMES: Name[] = ['key', 'switch', 'tick', 'beep', 'whoosh', 'hum', 'assemble', 'hover'];
const VOLUME: Record<Name, number> = {key: 0.75, switch: 0.65, tick: 0.55, beep: 0.5, whoosh: 0.4, hum: 0.2, assemble: 0.5, hover: 0.22};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
const buffers = new Map<Name, AudioBuffer>();
let on = false;
let hum: {src: AudioBufferSourceNode; gain: GainNode} | null = null;
let humWanted = false;
const lastPlayed = new Map<Name, number>();

async function load() {
  if (!ctx) return;
  await Promise.all(NAMES.map(async (n) => {
    if (buffers.has(n)) return;
    try {
      const r = await fetch(`/sfx/${n}.mp3`);
      if (!r.ok) return; // a missing file just means silence for that effect
      buffers.set(n, await ctx!.decodeAudioData(await r.arrayBuffer()));
    } catch { /* undecodable file: stay silent */ }
  }));
}

export function play(n: Name, opts: {rate?: number; volume?: number} = {}) {
  if (!on || !ctx || !master) return;
  const b = buffers.get(n);
  if (!b) return;
  // the same effect fired in a burst (dragging across switches, fast scroll) is thinned out
  const now = performance.now();
  if (now - (lastPlayed.get(n) ?? 0) < 45) return;
  lastPlayed.set(n, now);
  const src = ctx.createBufferSource();
  src.buffer = b;
  src.playbackRate.value = opts.rate ?? 1 + (Math.random() - 0.5) * 0.08; // small detune so repeats don't sound mechanical
  const g = ctx.createGain();
  g.gain.value = (opts.volume ?? 1) * VOLUME[n];
  src.connect(g).connect(master);
  src.start();
}

/** The data hum loops only while its section is on screen; it fades rather than cuts. */
export function setHum(want: boolean) {
  humWanted = want;
  if (!on || !ctx || !master) return;
  const b = buffers.get('hum');
  if (!b) return;
  const t = ctx.currentTime;
  if (want && !hum) {
    const src = ctx.createBufferSource();
    src.buffer = b;
    src.loop = true;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(VOLUME.hum, t + 1.2);
    src.connect(gain).connect(master);
    src.start();
    hum = {src, gain};
  } else if (!want && hum) {
    const h = hum;
    hum = null;
    h.gain.gain.cancelScheduledValues(t);
    h.gain.gain.setValueAtTime(h.gain.gain.value, t);
    h.gain.gain.linearRampToValueAtTime(0, t + 0.8);
    h.src.stop(t + 0.85);
  }
}

/* ---------------------------------------------------------------- music
 * Three looping layers (pad, soft beat, arpeggio, all A minor around 100 BPM) mixed live.
 * Standing still: only the pad, muffled. Scrolling: a low-pass filter opens and the beat comes in.
 * Dark sections add the arpeggio; the orange close keeps it. Everything moves with setTargetAtTime, so no step is heard.
 */
type Layer = 'pad' | 'pulse' | 'arp';
const LAYERS: Layer[] = ['pad', 'pulse', 'arp'];
// music sits under the effects; halved on 19 Nov at the owner's request (was 0.55)
const MUSIC_LEVEL = 0.275;
const musicBuf = new Map<Layer, AudioBuffer>();
let music: {bus: GainNode; filter: BiquadFilterNode; gains: Record<Layer, GainNode>; srcs: AudioBufferSourceNode[]} | null = null;
let energy = 0;
let theme = 'sweep';

async function loadMusic() {
  if (!ctx) return;
  await Promise.all(LAYERS.map(async (n) => {
    if (musicBuf.has(n)) return;
    try {
      const r = await fetch(`/sfx/music-${n}.mp3`);
      if (r.ok) musicBuf.set(n, await ctx!.decodeAudioData(await r.arrayBuffer()));
    } catch { /* silent if missing */ }
  }));
}

function startMusic() {
  if (!ctx || !master || music || !musicBuf.size) return;
  const t = ctx.currentTime + 0.05;
  const bus = ctx.createGain();
  bus.gain.setValueAtTime(0, t);
  bus.gain.linearRampToValueAtTime(MUSIC_LEVEL, t + 2.5); // fade in, never a jump
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  filter.Q.value = 0.7;
  bus.connect(filter).connect(master);
  const gains = {} as Record<Layer, GainNode>;
  const srcs: AudioBufferSourceNode[] = [];
  for (const n of LAYERS) {
    const g = ctx.createGain();
    g.gain.value = n === 'pad' ? 0.45 : 0;
    g.connect(bus);
    gains[n] = g;
    const b = musicBuf.get(n);
    if (!b) continue;
    const s = ctx.createBufferSource();
    s.buffer = b;
    s.loop = true;
    s.connect(g);
    s.start(t); // beat and arpeggio start on the same sample so they stay together
    srcs.push(s);
  }
  music = {bus, filter, gains, srcs};
}

function stopMusic() {
  if (!ctx || !music) return;
  const m = music;
  music = null;
  const t = ctx.currentTime;
  m.bus.gain.cancelScheduledValues(t);
  m.bus.gain.setValueAtTime(m.bus.gain.value, t);
  m.bus.gain.linearRampToValueAtTime(0, t + 0.8);
  m.srcs.forEach((s) => s.stop(t + 0.85));
}

/** Called every frame with the smooth-scroll speed (px per frame) and the current section theme. */
export function musicFrame(velocity: number, sectionTheme: string) {
  theme = sectionTheme;
  if (!on || !ctx || !music) return;
  const target = Math.min(1, Math.abs(velocity) / 28);
  energy += (target - energy) * (target > energy ? 0.12 : 0.015); // quick to rise, slow to settle
  const dark = theme === 'dark', orange = theme === 'orange';
  const t = ctx.currentTime;
  const freq = 900 * Math.pow(12, energy) + (dark ? 900 : 0) + (orange ? 1600 : 0); // ~900 Hz idle to ~11 kHz at speed
  music.filter.frequency.setTargetAtTime(Math.min(16000, freq), t, 0.12);
  music.gains.pulse.gain.setTargetAtTime(0.08 + 0.55 * energy + (dark ? 0.12 : 0), t, 0.25);
  music.gains.arp.gain.setTargetAtTime(dark ? 0.32 : orange ? 0.28 : 0.06 + 0.12 * energy, t, 0.6);
}

/* ---------------------------------------------------------------- cursor grain
 * While the cursor moves over the hero device, the granular sweep loops under it, louder the faster you move.
 */
let grain: {src: AudioBufferSourceNode; gain: GainNode} | null = null;
export function grainMove(speed: number) {
  if (!on || !ctx || !master) return;
  const b = buffers.get('assemble');
  if (!b) return;
  if (!grain) {
    const src = ctx.createBufferSource();
    src.buffer = b;
    src.loop = true;
    src.loopStart = 0.2;
    src.loopEnd = Math.max(0.4, b.duration - 0.2);
    const gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(gain).connect(master);
    src.start(ctx.currentTime, Math.random() * (b.duration - 0.4)); // start somewhere inside the texture
    grain = {src, gain};
  }
  const t = ctx.currentTime;
  grain.gain.gain.cancelScheduledValues(t);
  grain.gain.gain.setTargetAtTime(Math.min(0.7, 0.08 + speed / 900) * VOLUME.assemble, t, 0.05);
  grain.gain.gain.setTargetAtTime(0, t + 0.15, 0.2); // a resting cursor lets the grain fade
  grain.src.playbackRate.setTargetAtTime(0.85 + Math.min(0.4, speed / 3000), t, 0.1);
}
export function grainStop() {
  if (!ctx || !grain) return;
  const g = grain;
  grain = null;
  const t = ctx.currentTime;
  g.gain.gain.cancelScheduledValues(t);
  g.gain.gain.setTargetAtTime(0, t, 0.08);
  g.src.stop(t + 0.5);
}

async function enable(btn: HTMLButtonElement) {
  ctx ??= new AudioContext();
  if (!master) { master = ctx.createGain(); master.connect(ctx.destination); }
  await ctx.resume();
  on = true;
  btn.setAttribute('aria-checked', 'true');
  await load();
  play('beep');
  if (humWanted) setHum(true);
  await loadMusic();
  if (on) startMusic();
}

function disable(btn: HTMLButtonElement) {
  setHum(false);
  stopMusic();
  grainStop();
  on = false;
  btn.setAttribute('aria-checked', 'false');
}

export function initSound() {
  const btn = document.querySelector<HTMLButtonElement>('.snd');
  if (!btn) return;
  btn.addEventListener('click', () => { if (btn.getAttribute('aria-checked') === 'true') disable(btn); else enable(btn); });

  // interface sounds, wired by delegation so every page gets them
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.addEventListener('pointerdown', (e) => {
    const t = e.target as Element;
    if (t.closest('.btn, .key, .pause, .witem')) play('key');
  });
  document.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.closest('.sw')) play('switch', {rate: t.checked ? 1.05 : 0.92});
    else if (t.closest('.cur')) play('tick');
  });
  document.addEventListener('click', (e) => {
    if ((e.target as Element).closest('[role=tab], summary')) play('tick');
  });
  if (fine) {
    document.addEventListener('pointerover', (e) => {
      const t = (e.target as Element).closest('.links a, .tabs button');
      if (t && !t.contains(e.relatedTarget as Node)) play('hover');
    });
  }
}
