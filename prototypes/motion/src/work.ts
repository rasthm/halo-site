/**
 * Work images drawn as WebGL planes that track their DOM boxes. Scroll speed bows them like paper
 * and splits the colour channels slightly; they straighten when the scroll stops. Hover zooms in.
 * The DOM images stay as the fallback (no WebGL, reduced motion) and for screen readers.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

const vertex = /* glsl */ `
  uniform float uVel;   // smoothed scroll speed, -1..1
  uniform vec2 uPlane;  // plane size in px
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.y += sin(uv.x * 3.14159) * uVel * 0.16;                            // bow along the width
    p.z = cos((uv.x - 0.5) * 3.14159) * abs(uVel) * 0.32 * uPlane.x;     // wrap like a cylinder: the middle comes forward
    p.z += (uv.y - 0.5) * uPlane.y * sin(uVel * 0.5);                    // tilt toward the scroll direction
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uPlane, uImg, uAlign;
  uniform float uVel, uHover, uRadius, uAlpha;
  varying vec2 vUv;
  void main() {
    // object-fit: cover, honouring object-position
    float pa = uPlane.x / uPlane.y, ia = uImg.x / uImg.y;
    vec2 s = pa > ia ? vec2(1.0, ia / pa) : vec2(pa / ia, 1.0);
    vec2 uv = (vUv - uAlign) * s + uAlign;
    uv = (uv - 0.5) * (1.0 - uHover * 0.06) + 0.5;
    float shift = uVel * 0.012;
    vec4 c = vec4(texture2D(uTex, uv + vec2(0.0, shift)).r, texture2D(uTex, uv).g, texture2D(uTex, uv - vec2(0.0, shift)).b, 1.0);
    // rounded corners in pixels
    vec2 q = abs(vUv - 0.5) * uPlane - (uPlane * 0.5 - uRadius);
    float d = length(max(q, 0.0)) - uRadius;
    c.a = (1.0 - smoothstep(-1.0, 0.5, d)) * uAlpha;
    gl_FragColor = c;
  }
`;

export function initWork(section: HTMLElement, getVelocity: () => number, reduce: boolean) {
  const items = [...section.querySelectorAll<HTMLAnchorElement>('.witem')];
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  cursor(section, fine);
  if (reduce) return;

  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.domElement.className = 'gl-work';
  document.body.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  // perspective sized so z = 0 maps 1:1 to CSS pixels
  const FOV = 30;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 10000);
  const size = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.position.z = innerHeight / 2 / Math.tan(((FOV / 2) * Math.PI) / 180);
    camera.updateProjectionMatrix();
  };
  addEventListener('resize', size);
  size();

  const loader = new THREE.TextureLoader();
  const planes = items.map((a) => {
    const box = a.querySelector<HTMLElement>('.wimg')!;
    const img = box.querySelector('img')!;
    const align = getComputedStyle(img).objectPosition.includes('left') ? new THREE.Vector2(0, 1) : new THREE.Vector2(0.5, 0.5);
    const u = {
      uTex: {value: null as THREE.Texture | null}, uPlane: {value: new THREE.Vector2(1, 1)}, uImg: {value: new THREE.Vector2(1, 1)},
      uAlign: {value: align}, uVel: {value: 0}, uHover: {value: 0}, uRadius: {value: 14}, uAlpha: {value: 0},
    };
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 48, 48), new THREE.ShaderMaterial({uniforms: u, vertexShader: vertex, fragmentShader: fragment, transparent: true}));
    mesh.visible = false;
    scene.add(mesh);
    loader.load(img.currentSrc || img.src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      u.uTex.value = tex;
      u.uImg.value.set(tex.image.width, tex.image.height);
      box.classList.add('gl');
      gsap.to(u.uAlpha, {value: 1, duration: 0.4, ease: 'power2.out'});
    });
    if (fine) {
      a.addEventListener('pointerenter', () => gsap.to(u.uHover, {value: 1, duration: 0.6, ease: 'power3.out', overwrite: true}));
      a.addEventListener('pointerleave', () => gsap.to(u.uHover, {value: 0, duration: 0.6, ease: 'power3.out', overwrite: true}));
    }
    return {box, mesh, u};
  });

  let active = false, vel = 0;
  ScrollTrigger.create({trigger: section, start: 'top bottom', end: 'bottom top', onToggle: (s) => {
    active = s.isActive;
    if (!active) { renderer.clear(); planes.forEach((p) => (p.mesh.visible = false)); }
  }});
  gsap.ticker.add(() => {
    if (!active) return;
    // smoothed scroll speed (Lenis px per frame) mapped to -1..1
    vel += (gsap.utils.clamp(-1, 1, getVelocity() * 0.03) - vel) * 0.1;
    for (const p of planes) {
      const r = p.box.getBoundingClientRect();
      const on = r.bottom > -50 && r.top < innerHeight + 50 && !!p.u.uTex.value;
      p.mesh.visible = on;
      if (!on) continue;
      p.mesh.scale.set(r.width, r.height, 1);
      p.mesh.position.set(r.left + r.width / 2 - innerWidth / 2, innerHeight / 2 - r.top - r.height / 2, 0);
      p.u.uPlane.value.set(r.width, r.height);
      p.u.uVel.value = -vel;
    }
    renderer.render(scene, camera);
  });
}

// a round "Open" badge follows the pointer over project links
function cursor(section: HTMLElement, fine: boolean) {
  const el = document.querySelector<HTMLElement>('.cursor');
  if (!el || !fine) return;
  const pos = {x: -200, y: -200}, sm = {x: -200, y: -200, s: 0.6};
  let on = false;
  section.querySelectorAll('.witem').forEach((a) => {
    a.addEventListener('pointerenter', () => { on = true; el.classList.add('on'); });
    a.addEventListener('pointerleave', () => { on = false; el.classList.remove('on'); });
  });
  addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; });
  gsap.ticker.add(() => {
    sm.x += (pos.x - sm.x) * 0.2; sm.y += (pos.y - sm.y) * 0.2; sm.s += ((on ? 1 : 0.6) - sm.s) * 0.2;
    el.style.transform = `translate3d(${sm.x}px, ${sm.y}px, 0) scale(${sm.s})`;
  });
}
