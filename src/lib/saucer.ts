// Rick's space cruiser as a small three.js model, flying a tilted circular orbit around a
// sphere that is drawn elsewhere (the SVG globe on Travels, the Travels ball on the home page).
// An invisible sphere of the same radius writes depth only, so the far half of the orbit
// disappears behind whatever the page draws there.
import * as THREE from 'three';
import { makeStarship, type Site, type Stage } from './starship';

export type OrbitGeom = { w: number; h: number; cx: number; cy: number; R: number };
export type OrbitOpts = {
  a?: number;      // orbit radius, in sphere radii
  incl?: number;   // orbit inclination towards the viewer, degrees
  tilt?: number;   // orbit tilt in the picture plane, degrees
  T?: number;      // period, seconds
  size?: number;   // ship radius, in sphere radii
  ph?: number;     // starting phase, radians
  wander?: boolean; // drift to a new random orbit every lap
  onFrame?: (p: { x: number; y: number; r: number; front: boolean }) => void; // after each frame
};

const stripMat = new THREE.MeshStandardMaterial({ color: 0xffb21c, emissive: 0xff9a00, emissiveIntensity: 0.9, side: THREE.DoubleSide });

function buildShip(crewUrl: string) {
  const ship = new THREE.Group();
  const grey = new THREE.MeshStandardMaterial({ color: 0x7d8496, metalness: 0.3, roughness: 0.5 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x3a3f4b, metalness: 0.2, roughness: 0.7 });

  // Hull: a lathed saucer, forward is +z.
  const hullPts = [[0, -0.2], [0.55, -0.24], [0.9, -0.12], [1.0, -0.02], [0.96, 0.06], [0.75, 0.16], [0.56, 0.22], [0.5, 0.23]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d')!, r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,250,215,1)'); r.addColorStop(0.35, 'rgba(255,240,170,0.55)'); r.addColorStop(1, 'rgba(255,240,170,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  ship.add(new THREE.Mesh(new THREE.LatheGeometry(hullPts, 64), grey));

  // Glowing strips running from the cockpit down to the rim, as in the cartoon.
  const upper = hullPts.slice(3).reverse().map((p) => new THREE.Vector2(p.x * 1.004, p.y + 0.006));
  for (let i = 0; i < 7; i++) {
    const phi = Math.PI * 0.12 + i * (Math.PI * 2 / 7);
    ship.add(new THREE.Mesh(new THREE.LatheGeometry(upper, 2, phi, 0.11), stripMat));
  }

  // Cockpit rim, crew, glass dome and the arch over it.
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.035, 10, 48), grey);
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.24; ship.add(rim);

  const tex = new THREE.TextureLoader().load(crewUrl);
  tex.colorSpace = THREE.SRGBColorSpace;
  const crew = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: 0.25 }));
  crew.scale.set(0.84, 0.84 * 380 / 447, 1);
  crew.position.set(0.02, 0.5, 0);
  ship.add(crew);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshPhysicalMaterial({ color: 0xcfe9ff, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0, depthWrite: false, side: THREE.DoubleSide }),
  );
  dome.position.y = 0.24; dome.renderOrder = 2; ship.add(dome);

  const arch = new THREE.Mesh(new THREE.TorusGeometry(0.51, 0.022, 8, 40, Math.PI), grey);
  arch.position.y = 0.24; arch.rotation.y = 0.5; ship.add(arch);

  // The trash-can thruster at the back, on a ribbed hose.
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.4, 24), dark);
  can.rotation.x = Math.PI / 2; can.position.set(-0.32, 0.16, -0.86); ship.add(can);
  for (let i = 0; i < 4; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.022, 6, 16), dark);
    rib.position.set(-0.26, 0.15, -0.6 + i * 0.06); ship.add(rib);
  }
  const lid = new THREE.Mesh(new THREE.CircleGeometry(0.17, 24), new THREE.MeshBasicMaterial({ color: 0x14161c }));
  lid.position.set(-0.32, 0.16, -1.065); lid.rotation.y = Math.PI; ship.add(lid);

  // Two taped-on headlights.
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xd9c98a, emissive: 0xfff3b0, emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.4 });
  for (const x of [-0.32, 0.3]) {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 0.12, 16), lampMat);
    lamp.rotation.x = Math.PI / 2; lamp.position.set(x, 0.1, 0.86); ship.add(lamp);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.set(0.32, 0.32, 1); glow.position.set(x, 0.1, 0.95); ship.add(glow);
  }
  return ship;
}

export function mountSaucer(canvas: HTMLCanvasElement, geom: () => OrbitGeom, opts: OrbitOpts = {}) {
  const { a: a0 = 1.35, incl = 72, tilt = -14, T = 14, size = 0.26, ph = 0, wander = false } = opts;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-3, 5, 6); scene.add(sun);

  const occ = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.MeshBasicMaterial({ colorWrite: false }));
  occ.renderOrder = -1; scene.add(occ);

  const crewUrl = new URL('/home/rm-crew.png', location.href).href;
  const ship = buildShip(crewUrl);
  // Orbit plane: start flat (xz), lean it towards the viewer, then tilt it in the picture.
  const orbit = new THREE.Group(); scene.add(orbit); orbit.add(ship);
  // The orbit's shape, eased towards a new random target every lap when wandering.
  const cur = { incl, tilt, a: a0 }, tgt = { ...cur };
  let lap = 0, lastT = 0, a = a0;
  const setOrbit = () => orbit.rotation.set(((90 - cur.incl) * Math.PI) / 180, 0, (cur.tilt * Math.PI) / 180, 'ZXY');
  setOrbit();
  const rocket = makeStarship(scene);

  let g = geom();
  const resize = () => {
    g = geom();
    renderer.setSize(g.w, g.h, false);
    canvas.style.width = `${g.w}px`; canvas.style.height = `${g.h}px`;
    // One scene unit = one sphere radius, centred on the sphere.
    const s = g.R;
    cam.left = -g.cx / s; cam.right = (g.w - g.cx) / s; cam.top = g.cy / s; cam.bottom = -(g.h - g.cy) / s;
    cam.position.set(0, 0, 20); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
  };
  resize();
  ship.scale.setScalar(size);

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const up = new THREE.Vector3(0, 1, 0);
  let phase = ph;           // shifted when the ship is let go, so the orbit resumes from there
  let held: THREE.Vector3 | null = null, back = 0, from = new THREE.Vector3();
  const place = (t: number) => {
    const dt = Math.min(0.1, (t - (lastT || t)) / 1000); lastT = t;
    if (wander) {
      const k = 1 - Math.exp(-dt * 0.45);
      for (const key of ['incl', 'tilt', 'a'] as const) cur[key] += (tgt[key] - cur[key]) * k;
      a = cur.a; setOrbit();
    }
    if (held) {
      // Dangling from the cursor: hold position, shake a little.
      ship.position.lerp(held, 0.35);
      ship.rotation.set(0.25 * Math.sin(t / 90), t / 600, 0.3 * Math.sin(t / 70));
      return;
    }
    const th = (t / 1000) * (2 * Math.PI / T) + phase;
    const n = Math.floor(th / (2 * Math.PI));
    if (wander && n !== lap) {
      lap = n;
      tgt.incl = 50 + Math.random() * 38;       // from steep to nearly edge-on
      tgt.tilt = -40 + Math.random() * 80;
      tgt.a = 1.18 + Math.random() * 0.4;
    }
    // Counter-clockwise seen from above; the ship's nose (+z) points along its motion.
    const on = new THREE.Vector3(a * Math.cos(th), 0.03 * Math.sin(t / 500), -a * Math.sin(th));
    const fwd = new THREE.Vector3(-Math.sin(th), 0, -Math.cos(th));
    ship.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(), fwd.negate(), up));
    ship.rotateZ(0.18 + 0.06 * Math.sin(t / 700)); // a little bank and wobble
    if (back > t) { const k = 1 - (back - t) / 700; ship.position.lerpVectors(from, on, k * k * (3 - 2 * k)); }
    else ship.position.copy(on);
  };

  // Screen position of the ship (canvas pixels) and whether it is on the near side.
  const v = new THREE.Vector3();
  const screen = () => {
    ship.getWorldPosition(v);
    const front = v.z > -0.05 || Math.hypot(v.x, v.y) > 1;
    return { x: g.cx + v.x * g.R, y: g.cy - v.y * g.R, r: size * g.R * 1.1, front };
  };
  // Canvas pixels to a point in the orbit's own frame, a little in front of the sphere.
  const toLocal = (x: number, y: number) => orbit.worldToLocal(new THREE.Vector3((x - g.cx) / g.R, (g.cy - y) / g.R, 1.6));

  let raf = 0, alive = true;
  const frame = (t: number) => {
    if (!alive) return;
    place(t); rocket.update(t); renderer.render(scene, cam);
    opts.onFrame?.(screen());
    if (!still || held || back > t || rocket.active) raf = requestAnimationFrame(frame);
  };
  const start = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  start();
  return {
    resize: () => { resize(); if (still) start(); }, start, stop, screen,
    // Starship from a launch site; `on` hears each stage of the flight.
    launch: (site: () => Site | null, on?: (stage: Stage) => void) => { rocket.go(site, on); start(); },
    destroy: () => { alive = false; stop(); renderer.dispose(); },
    // Grab with the cursor: true when (x, y) is on the ship.
    grab: (x: number, y: number) => {
      const p = screen();
      if (!p.front || Math.hypot(x - p.x, y - p.y) > p.r) return false;
      held = toLocal(x, y); start(); return true;
    },
    drag: (x: number, y: number) => { if (held) held = toLocal(x, y); },
    release: () => {
      if (!held) return;
      // Rejoin the orbit at the angle the ship was dropped at.
      const t = performance.now(), q = ship.position;
      phase = Math.atan2(-q.z, q.x) - (t / 1000) * (2 * Math.PI / T);
      from = q.clone(); back = t + 700; held = null; start();
    },
  };
}
