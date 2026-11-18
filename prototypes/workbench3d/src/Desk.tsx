import {Canvas, useFrame, type ThreeEvent} from '@react-three/fiber';
import {ContactShadows, Environment, Lightformer, useGLTF} from '@react-three/drei';
import {Suspense, useEffect, useMemo, useRef, useState} from 'react';
import * as THREE from 'three';
import {DecalGeometry} from 'three/examples/jsm/geometries/DecalGeometry.js';

/** Prints a label onto the curved top of a key: a decal projected straight down, then parented to the key so it travels with it. */
function printOn(key: THREE.Mesh, tex: THREE.Texture, local: [number, number, number], size: [number, number]) {
  key.updateWorldMatrix(true, false);
  const at = key.localToWorld(new THREE.Vector3(...local));
  const geom = new DecalGeometry(key, at, new THREE.Euler(-Math.PI / 2, 0, 0), new THREE.Vector3(size[0], size[1], 0.03));
  geom.applyMatrix4(key.matrixWorld.clone().invert());
  const decal = new THREE.Mesh(geom, new THREE.MeshPhysicalMaterial({map: tex, transparent: true, roughness: 0.55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4}));
  key.add(decal);
}

/**
 * The Halo Workbench: a desk device modelled in Blender (prototypes/workbench3d/blender/make_workbench.py).
 * Keys are spring-loaded switches, the knob turns in detents with momentum and sets the team's weekly hours of
 * repeated work, and the readout is a seven-segment display that rolls to an example estimate of hours given back.
 */

const SERVICES = [
  {name: 'Websites', live: 'LIVE IN 3-5 DAYS'},
  {name: 'Web apps', live: 'LIVE IN 3-4 WEEKS'},
  {name: 'Automations', live: 'LIVE IN 2-3 WEEKS'},
  {name: 'Company brain', live: 'SCOPED ON A CALL'},
  {name: 'Integrations', live: 'LIVE IN 2-3 WEEKS'},
  {name: 'APIs & reels', live: 'LIVE IN 2-3 WEEKS'},
];
const KEY_TRAVEL = 0.0038; // metres: about 4 mm of travel
const DETENTS = 30; // knob steps per turn
const HOURS_PER_STEP = 5; // team hours of repeated work per week, per detent
const START_STEP = 7; // 35 h a week to start
const SHARE = 0.5; // half of it automated, as in the estimate copy
const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hoursBack = (step: number) => Math.round((step * HOURS_PER_STEP + HOURS_PER_STEP) * (52 / 12) * SHARE);

/* ------------------------------------------------------------------ canvas textures */

function labelTexture(text: string) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 160;
  const g = c.getContext('2d')!;
  g.fillStyle = '#1b1a18';
  g.font = '500 58px Rubik, sans-serif';
  g.textBaseline = 'middle';
  g.fillText(text, 40, 84, 452);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// seven-segment glyphs: segments a b c d e f g
const SEG: Record<string, string> = {
  '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', ' ': '',
};

function drawDigit(g: CanvasRenderingContext2D, ch: string, x: number, y: number, w: number, h: number, lit: boolean) {
  const t = w * 0.16; // segment thickness
  const on = SEG[ch] ?? '';
  const seg = (k: string, sx: number, sy: number, horiz: boolean, len: number) => {
    const active = on.includes(k);
    if (!active && lit) return;
    if (active && !lit) return;
    g.beginPath();
    if (horiz) {
      g.moveTo(sx, sy); g.lineTo(sx + t / 2, sy - t / 2); g.lineTo(sx + len - t / 2, sy - t / 2); g.lineTo(sx + len, sy); g.lineTo(sx + len - t / 2, sy + t / 2); g.lineTo(sx + t / 2, sy + t / 2);
    } else {
      g.moveTo(sx, sy); g.lineTo(sx - t / 2, sy + t / 2); g.lineTo(sx - t / 2, sy + len - t / 2); g.lineTo(sx, sy + len); g.lineTo(sx + t / 2, sy + len - t / 2); g.lineTo(sx + t / 2, sy + t / 2);
    }
    g.closePath();
    g.fill();
  };
  const sk = w * 0.12; // italic skew, like a real display
  g.save();
  g.transform(1, 0, -sk / h, 1, sk / 2, 0);
  const half = h / 2;
  seg('a', x + t * 0.6, y, true, w - t * 1.2);
  seg('g', x + t * 0.6, y + half, true, w - t * 1.2);
  seg('d', x + t * 0.6, y + h, true, w - t * 1.2);
  seg('f', x, y + t * 0.6, false, half - t * 1.2);
  seg('b', x + w, y + t * 0.6, false, half - t * 1.2);
  seg('e', x, y + half + t * 0.6, false, half - t * 1.2);
  seg('c', x + w, y + half + t * 0.6, false, half - t * 1.2);
  g.restore();
}

function useReadout() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1536;
    c.height = 410;
    const g = c.getContext('2d')!;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const draw = (value: number, line1: string, line2: string, line3: string, glow: number) => {
      g.clearRect(0, 0, c.width, c.height);
      const digits = String(Math.max(0, Math.min(999, value))).padStart(3, ' ');
      const dw = 150, dh = 250, gap = 54, x0 = 640, y0 = 80;
      // ghost segments first, then the lit ones with a soft glow
      g.fillStyle = 'rgba(255, 90, 31, 0.07)';
      for (let i = 0; i < 3; i++) drawDigit(g, '8', x0 + i * (dw + gap), y0, dw, dh, false);
      g.shadowColor = 'rgba(255, 96, 40, 0.9)';
      g.shadowBlur = 26 * glow;
      g.fillStyle = '#ff6a2a';
      for (let i = 0; i < 3; i++) drawDigit(g, digits[i], x0 + i * (dw + gap), y0, dw, dh, true);
      g.font = '700 92px "JetBrains Mono", monospace';
      g.fillText('h', x0 + 3 * (dw + gap) + 4, y0 + dh);
      g.shadowBlur = 0;
      g.fillStyle = '#ff8a5c';
      g.font = '700 46px "JetBrains Mono", monospace';
      g.fillText(line1, 70, 130, 540);
      g.fillStyle = 'rgba(255, 138, 92, 0.75)';
      g.font = '500 36px "JetBrains Mono", monospace';
      g.fillText(line2, 70, 200, 540);
      g.fillText(line3, 70, 330, 540);
      tex.needsUpdate = true;
    };
    return {tex, draw};
  }, []);
}

/* ------------------------------------------------------------------ the device */

type Spring = {x: number; v: number; target: number};
const springStep = (s: Spring, k: number, c: number, dt: number) => {
  const a = k * (s.target - s.x) - c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
};

function Device({onSelect}: {onSelect: (i: number) => void}) {
  const {scene} = useGLTF('/workbench.glb');
  const group = useRef<THREE.Group>(null);
  const readout = useReadout();

  // parts by name, with their resting heights and springs
  const parts = useMemo(() => {
    const keys: THREE.Mesh[] = [];
    let knob: THREE.Object3D | null = null;
    let go: THREE.Mesh | null = null;
    let glass: THREE.Mesh | null = null;
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
      if (/^key_\d$/.test(o.name)) keys[+o.name.slice(4)] = o as THREE.Mesh;
      if (o.name === 'key_go') go = o as THREE.Mesh;
      if (o.name === 'knob') knob = o;
      if (o.name === 'display_glass') glass = o as THREE.Mesh;
    });
    const mat = (name: string, p: THREE.MeshPhysicalMaterialParameters) => {
      const o = scene.getObjectByName(name) as THREE.Mesh | undefined;
      if (o) o.material = new THREE.MeshPhysicalMaterial(p);
    };
    mat('chassis', {color: '#e8e3d9', roughness: 0.62, clearcoat: 0.08, clearcoatRoughness: 0.6});
    mat('plate', {color: '#d6cfc2', roughness: 0.74});
    const keyMat = new THREE.MeshPhysicalMaterial({color: '#f8f5ee', roughness: 0.5, sheen: 0.35, sheenColor: new THREE.Color('#ffffff'), clearcoat: 0.12, clearcoatRoughness: 0.5});
    keys.forEach((k) => (k.material = keyMat));
    mat('key_go', {color: '#ff5a1f', roughness: 0.42, clearcoat: 0.3, clearcoatRoughness: 0.4, envMapIntensity: 0.7});
    mat('display_glass', {color: '#0d0d0e', roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.35});
    mat('knob', {color: '#c9c6c0', metalness: 1, roughness: 0.27, anisotropy: 0.75});
    mat('knob_mark', {color: '#121212', roughness: 0.5});
    // printed legends and a status LED on each key, all children of the key so they ride its travel
    const leds: THREE.Mesh[] = [];
    if (!scene.userData.dressed) {
      keys.forEach((k, i) => {
        printOn(k, labelTexture(SERVICES[i].name), [0, 0.017, 0.012], [0.066, 0.0206]);
        const led = new THREE.Mesh(new THREE.CylinderGeometry(0.0031, 0.0031, 0.001, 32), new THREE.MeshStandardMaterial({color: '#cfc8bb', emissive: '#ff5a1f', emissiveIntensity: 0.15, roughness: 0.4}));
        led.position.set(0.0255, 0.0166, -0.0225);
        led.name = 'led';
        k.add(led);
      });
      if (go) printOn(go, goTexture(), [0, 0.017, 0.002], [0.13, 0.038]);
      scene.userData.dressed = true;
    }
    keys.forEach((k) => leds.push(k.getObjectByName('led') as THREE.Mesh));
    const all = [...keys, go!].map((m) => ({mesh: m, base: m.position.y, s: {x: 0, v: 0, target: 0} as Spring, tilt: {x: 0, v: 0, target: 0} as Spring}));
    return {keys, go: go as THREE.Mesh | null, knob: knob as THREE.Object3D | null, glass: glass as THREE.Mesh | null, all, leds};
  }, [scene]);

  // knob state: continuous angle, detent-snapping spring, momentum
  const knob = useRef({angle: 0, v: 0, target: (START_STEP * Math.PI * 2) / DETENTS, dragging: false, last: 0, lastT: 0, step: 0});
  const shown = useRef({value: 0, target: hoursBack(START_STEP), service: -1, glow: 1, lastDrawn: -1, lastService: -2});
  const ledLevel = useRef(SERVICES.map(() => 0));
  const lit = useRef(-1);
  const interacted = useRef(0);

  const press = (i: number, user: boolean) => {
    const p = parts.all[i];
    if (!p) return;
    p.s.target = -KEY_TRAVEL;
    p.tilt.target = (Math.random() - 0.5) * 0.035;
    setTimeout(() => {
      p.s.target = 0;
      p.tilt.target = 0;
    }, user ? 120 : 110);
    if (i < SERVICES.length) {
      lit.current = i;
      shown.current.service = i;
      onSelect(i);
    }
    if (user) interacted.current = performance.now();
  };

  // keyboard 1–6, and an idle demo that presses keys until someone interacts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 6) press(n - 1, true);
    };
    window.addEventListener('keydown', onKey);
    let i = -1;
    const demo = reduce
      ? 0
      : window.setInterval(() => {
          if (performance.now() - interacted.current < 8000) return;
          i = (i + 1) % SERVICES.length;
          press(i, false);
        }, 2100);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearInterval(demo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts]);

  // knob dragging: angle of the pointer around the knob's centre, on the plane of its top face
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const centre = useMemo(() => new THREE.Vector3(), []);
  const pointerAngle = (e: ThreeEvent<PointerEvent>) => {
    const k = parts.knob!;
    k.getWorldPosition(centre);
    plane.constant = -centre.y - 0.02;
    if (!e.ray.intersectPlane(plane, hit)) return null;
    return Math.atan2(hit.x - centre.x, hit.z - centre.z);
  };
  const onKnobDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const a = pointerAngle(e);
    if (a === null) return;
    Object.assign(knob.current, {dragging: true, last: a, lastT: performance.now(), v: 0});
    interacted.current = performance.now();
  };
  const onKnobMove = (e: ThreeEvent<PointerEvent>) => {
    const k = knob.current;
    if (!k.dragging) return;
    const a = pointerAngle(e);
    if (a === null) return;
    let d = a - k.last;
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    const now = performance.now();
    k.angle += d; // a clockwise drag on screen turns the value up
    k.v = (d / Math.max(1, now - k.lastT)) * 1000;
    k.last = a;
    k.lastT = now;
    interacted.current = now;
  };
  const onKnobUp = () => {
    const k = knob.current;
    if (!k.dragging) return;
    k.dragging = false;
    const step = (Math.PI * 2) / DETENTS;
    // carry a little momentum, then settle on the nearest detent within the dial's range
    const projected = k.angle + THREE.MathUtils.clamp(k.v, -12, 12) * 0.12;
    k.target = THREE.MathUtils.clamp(Math.round(projected / step), 0, DETENTS - 1) * step;
    k.v = 0;
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    // switches: stiff spring, damping ratio ~0.55, so a key comes back with a small overshoot
    const k = reduce ? 2400 : 1600;
    const c = reduce ? 98 : 44;
    parts.all.forEach((p) => {
      springStep(p.s, k, c, dt);
      springStep(p.tilt, 900, 30, dt);
      p.mesh.position.y = p.base + p.s.x;
      p.mesh.rotation.x = p.tilt.x;
    });
    // LEDs fade in fast and out slowly
    ledLevel.current = ledLevel.current.map((v, i) => {
      const target = i === lit.current ? 1 : 0;
      return v + (target - v) * (1 - Math.exp(-dt * (target ? 18 : 4)));
    });
    parts.leds.forEach((m, i) => {
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.12 + ledLevel.current[i] * 5;
      mat.color.setRGB(0.55 + ledLevel.current[i] * 0.45, 0.5 - ledLevel.current[i] * 0.15, 0.46 - ledLevel.current[i] * 0.3);
    });
    // knob: free while dragged, spring to the detent once let go
    const kn = knob.current;
    const step = (Math.PI * 2) / DETENTS;
    if (!kn.dragging) {
      const s: Spring = {x: kn.angle, v: kn.v, target: kn.target};
      springStep(s, reduce ? 900 : 260, reduce ? 60 : 26, dt);
      kn.angle = s.x;
      kn.v = s.v;
    } else {
      kn.angle = THREE.MathUtils.clamp(kn.angle, -step * 0.4, (DETENTS - 1) * step + step * 0.4);
    }
    if (parts.knob) parts.knob.rotation.y = -kn.angle;
    const detent = THREE.MathUtils.clamp(Math.round(kn.angle / step), 0, DETENTS - 1);
    if (detent !== kn.step) {
      kn.step = detent;
      shown.current.target = hoursBack(detent);
    }
    // readout: numbers roll towards the target; redraw only when something visible changed
    const sh = shown.current;
    sh.value += (sh.target - sh.value) * (1 - Math.exp(-dt * (reduce ? 60 : 7)));
    const v = Math.round(sh.value);
    if (v !== sh.lastDrawn || sh.service !== sh.lastService) {
      const s = SERVICES[sh.service];
      const team = (detent * HOURS_PER_STEP + HOURS_PER_STEP) + ' H/WEEK REPEATED';
      readout.draw(v, s ? s.name.toUpperCase() : 'HOURS BACK', s ? s.live : 'EACH MONTH, EXAMPLE', 'KNOB: ' + team, 1);
      sh.lastDrawn = v;
      sh.lastService = sh.service;
    }
    // prototype-only test hook: where the knob is on screen (0..1 of the canvas), for the Playwright drag test
    if (parts.knob) {
      const p = parts.knob.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.024, 0)).project(state.camera);
      (window as unknown as {__knob: {x: number; y: number; hours: number}}).__knob = {x: (p.x + 1) / 2, y: (1 - p.y) / 2, hours: detent * HOURS_PER_STEP + HOURS_PER_STEP};
    }
    // the desk leans a little toward the pointer
    if (group.current && !reduce) {
      const g = group.current;
      const ry = state.pointer.x * 0.16;
      const rx = -state.pointer.y * 0.07;
      g.rotation.y += (ry - g.rotation.y) * (1 - Math.exp(-dt * 3));
      g.rotation.x += (rx - g.rotation.x) * (1 - Math.exp(-dt * 3));
    }
  });

  const glassPos = useMemo(() => {
    const v = new THREE.Vector3();
    parts.glass?.getWorldPosition(v);
    return v;
  }, [parts]);

  return (
    <group ref={group}>
      <primitive
        object={scene}
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          const i = keyIndex(e.object);
          if (i === null) return;
          e.stopPropagation();
          press(i, true);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (keyIndex(e.object) !== null) document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => (document.body.style.cursor = '')}
      />
      {/* readout: digits just above the dark glass, and a clear cover catching reflections */}
      <mesh position={[glassPos.x, 0.0288, glassPos.z]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.244, 0.0652]} />
        <meshBasicMaterial map={readout.tex} transparent toneMapped={false} />
      </mesh>
      <mesh position={[glassPos.x, 0.0292, glassPos.z]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.256, 0.068]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.04} roughness={0.04} clearcoat={1} envMapIntensity={0.7} />
      </mesh>
      {/* an invisible, generous grab area over the knob */}
      {parts.knob && (
        <mesh
          position={parts.knob.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.014, 0))}
          onPointerDown={onKnobDown}
          onPointerMove={onKnobMove}
          onPointerUp={onKnobUp}
          onPointerCancel={onKnobUp}
          onPointerOver={() => (document.body.style.cursor = 'grab')}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <cylinderGeometry args={[0.05, 0.05, 0.03, 32]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

/** Which key an event hit: walks up from a legend or LED to its key. 0–5 are services, 6 is the orange key. */
function keyIndex(o: THREE.Object3D | null): number | null {
  while (o) {
    if (/^key_\d$/.test(o.name)) return +o.name.slice(4);
    if (o.name === 'key_go') return SERVICES.length;
    o = o.parent;
  }
  return null;
}

function goTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 300;
  const g = c.getContext('2d')!;
  g.fillStyle = '#1a0f0a';
  g.font = '700 120px Rubik, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('Book a call', 512, 158);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function Desk() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [, setSelected] = useState(-1);
  useEffect(() => {
    const el = host.current?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {threshold: 0.05});
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={host} style={{position: 'absolute', inset: 0}}>
      <Canvas
        shadows="percentage"
        dpr={[1, 2]}
        frameloop={visible ? 'always' : 'never'}
        camera={{position: [0, 0.6, 0.52], fov: 28, near: 0.01, far: 5}}
        gl={{antialias: true, alpha: true}}
        onCreated={({camera, gl}) => {
          camera.lookAt(0, -0.02, 0.012);
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={2.4} position={[0, 1.2, 0.3]} rotation-x={Math.PI / 2} scale={[1.6, 0.9, 1]} />
            <Lightformer form="rect" intensity={1.4} position={[-1.2, 0.5, 0.4]} rotation-y={Math.PI / 2} scale={[1.2, 0.35, 1]} />
            <Lightformer form="rect" intensity={1.1} position={[1.2, 0.4, -0.2]} rotation-y={-Math.PI / 2} scale={[1.2, 0.3, 1]} />
            <Lightformer form="ring" color="#ffd9c7" intensity={0.8} position={[0, 0.6, -1.2]} scale={0.8} />
            {/* a big panel behind and above, so the knob top reflects light from any tilt */}
            <Lightformer form="rect" intensity={0.9} position={[-0.35, 0.9, -1]} rotation-x={Math.PI / 4} scale={[0.9, 0.7, 1]} />
            {/* low panels round the horizon, so polished metal reflects light along its sides instead of black */}
            <Lightformer form="rect" intensity={1.3} position={[0, 0.08, 1.2]} scale={[2.4, 0.5, 1]} />
            <Lightformer form="rect" intensity={0.9} position={[-1.2, 0.08, 0]} rotation-y={Math.PI / 2} scale={[2.4, 0.4, 1]} />
            <Lightformer form="rect" intensity={0.9} position={[1.2, 0.08, 0]} rotation-y={-Math.PI / 2} scale={[2.4, 0.4, 1]} />
            <Lightformer form="rect" intensity={0.6} color="#f3eee6" position={[0, -0.6, 0]} rotation-x={-Math.PI / 2} scale={[3, 3, 1]} />
          </Environment>
          <ambientLight intensity={0.25} />
          <directionalLight
            castShadow
            position={[0.35, 0.7, 0.25]}
            intensity={1.6}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0002}
            shadow-normalBias={0.02}
            shadow-radius={6}
            shadow-camera-left={-0.3}
            shadow-camera-right={0.3}
            shadow-camera-top={0.3}
            shadow-camera-bottom={-0.3}
            shadow-camera-near={0.1}
            shadow-camera-far={2}
          />
          <Device onSelect={setSelected} />
          <ContactShadows position={[0, -0.0005, 0]} scale={0.9} blur={2.6} opacity={0.5} far={0.12} resolution={1024} color="#3a2c22" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/workbench.glb');
