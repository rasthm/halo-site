/**
 * The hero device as particles. On load the dots fly in and assemble the photo, which then resolves.
 * The cursor "x-rays" the photo back into dots; scrolling away scatters the device into data.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

const SAMPLE_W = 300;
const SAMPLE_H = 200;
const BACKDROP = [230, 218, 214]; // the photo's sweep colour; pixels this close are not part of the device

const vertex = /* glsl */ `
  attribute vec2 aTarget;
  attribute vec3 aColor;
  attribute vec4 aRnd;
  uniform vec2 uSize;
  uniform float uIntro, uScatter, uShow, uMouseOn, uDpr;
  uniform vec2 uMouse;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 target = aTarget * uSize;
    // a left-to-right sweep with a little scatter in the timing
    float delay = aTarget.x * 0.45 + aRnd.x * 0.25;
    float t = clamp((uIntro - delay) / 0.55, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - t, 4.0);
    vec2 start = target + vec2(aRnd.y * 0.9 + 0.1, aRnd.z - 0.5) * uSize * 0.8;
    vec2 p = mix(start, target, e);

    vec2 dm = p - uMouse;
    float inf = uMouseOn * smoothstep(150.0, 0.0, length(dm));
    p += normalize(dm + 0.0001) * inf * 38.0 * (0.5 + aRnd.w);

    vec2 dir = vec2(aRnd.y - 0.3, aRnd.z * 0.9 + 0.35);
    p += dir * uScatter * uSize.y * (0.5 + aRnd.w);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
    gl_PointSize = (1.5 + aRnd.w * 1.5) * uDpr * (1.0 + inf * 0.9);
    vColor = mix(aColor, vec3(1.0, 0.42, 0.14), inf * 0.45); // dots warm toward orange near the cursor
    vAlpha = e * max(uShow, inf) * (1.0 - uScatter * 0.85);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(vColor, vAlpha * smoothstep(0.5, 0.3, r));
  }
`;

export async function initIntro(box: HTMLElement, reduce: boolean, gate: Promise<void> = Promise.resolve()) {
  const img = box.querySelector('img')!;
  if (reduce) return;
  await img.decode();

  const c = document.createElement('canvas');
  c.width = SAMPLE_W;
  c.height = SAMPLE_H;
  const g = c.getContext('2d', {willReadFrequently: true})!;
  g.drawImage(img, 0, 0, SAMPLE_W, SAMPLE_H);
  const px = g.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
  const target: number[] = [], color: number[] = [], rnd: number[] = [];
  for (let y = 0; y < SAMPLE_H; y++) {
    for (let x = 0; x < SAMPLE_W; x++) {
      const i = (y * SAMPLE_W + x) * 4;
      const r = px[i], gg = px[i + 1], b = px[i + 2];
      if (Math.hypot(r - BACKDROP[0], gg - BACKDROP[1], b - BACKDROP[2]) < 22) continue;
      target.push(x / SAMPLE_W, 1 - y / SAMPLE_H);
      color.push(r / 255, gg / 255, b / 255);
      rnd.push(Math.random(), Math.random(), Math.random(), Math.random());
    }
  }

  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: false, powerPreference: 'high-performance'});
  const dpr = Math.min(devicePixelRatio, 2);
  renderer.setPixelRatio(dpr);
  box.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array((target.length / 2) * 3), 3));
  geo.setAttribute('aTarget', new THREE.Float32BufferAttribute(target, 2));
  geo.setAttribute('aColor', new THREE.Float32BufferAttribute(color, 3));
  geo.setAttribute('aRnd', new THREE.Float32BufferAttribute(rnd, 4));
  const u = {
    uSize: {value: new THREE.Vector2(1, 1)}, uIntro: {value: 0}, uScatter: {value: 0}, uShow: {value: 1},
    uMouse: {value: new THREE.Vector2(-999, -999)}, uMouseOn: {value: 0}, uDpr: {value: dpr},
  };
  const points = new THREE.Points(geo, new THREE.ShaderMaterial({uniforms: u, vertexShader: vertex, fragmentShader: fragment, transparent: true, depthTest: false}));
  points.frustumCulled = false;
  scene.add(points);

  let w = 1, h = 1;
  const size = () => {
    const r = box.getBoundingClientRect();
    w = r.width; h = r.height;
    renderer.setSize(w, h, false);
    camera.right = w; camera.top = h; camera.updateProjectionMatrix();
    u.uSize.value.set(w, h);
    dirty = true;
  };
  let dirty = true;
  new ResizeObserver(size).observe(box);
  size();

  // intro: dots assemble, then the photo resolves over them
  // waits for the entrance screen to lift before the dots fly in
  const intro = gsap.timeline({paused: true, onUpdate: () => (dirty = true)});
  gate.then(() => intro.play());
  intro.to(u.uIntro, {value: 1.25, duration: 1.7, ease: 'none'})
    .to(img, {opacity: 1, duration: 0.5, ease: 'power2.out'}, '-=0.25')
    .to(u.uShow, {value: 0, duration: 0.6, ease: 'power2.out'}, '<0.15');

  // cursor x-ray: the photo opens a hole, the dots inside push outward
  const mouse = {x: -999, y: -999, on: 0, r: 0};
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) {
    box.style.pointerEvents = 'auto';
    box.addEventListener('pointermove', (e) => {
      const r = box.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      gsap.to(mouse, {on: 1, r: 150, duration: 0.5, ease: 'power3.out', overwrite: 'auto'});
    });
    box.addEventListener('pointerleave', () => gsap.to(mouse, {on: 0, r: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto'}));
  }
  const sm = {x: -999, y: -999};

  // scroll: the device dissolves into data on its way to the next section
  ScrollTrigger.create({
    trigger: box.closest('section')!, start: 'top top', end: 'bottom top', scrub: true,
    onUpdate: (st) => {
      const s = gsap.utils.clamp(0, 1, (st.progress - 0.08) / 0.75);
      u.uScatter.value = s;
      img.style.opacity = intro.progress() < 1 ? img.style.opacity : String(1 - gsap.utils.clamp(0, 1, s * 4));
      if (intro.progress() === 1) u.uShow.value = gsap.utils.clamp(0, 1, s * 4);
      dirty = true;
    },
  });

  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(box);
  gsap.ticker.add(() => {
    if (!visible) return;
    sm.x += (mouse.x - sm.x) * 0.25; sm.y += (mouse.y - sm.y) * 0.25;
    const moving = mouse.on > 0.001 || Math.abs(mouse.x - sm.x) > 0.5;
    if (!dirty && !moving) return;
    u.uMouse.value.set(sm.x, h - sm.y);
    u.uMouseOn.value = mouse.on;
    box.style.setProperty('--mx', `${sm.x}px`);
    box.style.setProperty('--my', `${sm.y}px`);
    box.style.setProperty('--mr', `${mouse.r}px`);
    renderer.render(scene, camera);
    dirty = false;
  });
}
