// SpaceX Starship flying from Starbase on the globe: liftoff from the launch mount beside the
// tower, hot staging, Super Heavy flipping and boosting back to be caught by the tower's
// chopsticks, and the ship flying on (or, now and then, blowing up). Sizes keep Starship's real
// proportions but are hugely exaggerated against the Earth so it reads at globe scale.
// Everything is placed in the site's own frame (up, east, north), so the flight follows the globe
// when it is spun mid-launch.
import * as THREE from 'three';

export type Site = { n: THREE.Vector3; e: THREE.Vector3 }; // unit "up" at the site and unit east
export type Stage = 'sep' | 'catch' | 'boom' | 'coast' | 'done';

// 1 m of rocket in globe radii: 123 m of stack become 0.5.
const M = 0.5 / 123;
const RAD = 4.5 * M, BOOSTER = 71 * M, SHIP = 52 * M, TOWER = 146 * M, ARMS = 118 * M;
const PAD = { k: 22 * M };                 // launch mount sits this far north of the tower
const IGN = 1.6, SEP = IGN + 8, CATCH = SEP + 9.5, END = SEP + 12;

const soft = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d')!, r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.45, 'rgba(255,255,255,0.45)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();
const add = () => ({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });

// Exhaust plume: tip trails below the engines. Colour and width follow the altitude: orange and
// tight near the ground, a wide pale-violet methalox plume higher up.
function plume(len: number, rad: number) {
  const g = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.ConeGeometry(rad, len, 18, 1, true), new THREE.MeshBasicMaterial({ color: 0xff9a3c, opacity: 0.8, ...add() }));
  const core = new THREE.Mesh(new THREE.ConeGeometry(rad * 0.55, len * 0.55, 14, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff3d6, opacity: 0.95, ...add() }));
  outer.rotation.x = core.rotation.x = Math.PI;
  outer.position.y = -len / 2; core.position.y = -len * 0.275;
  g.add(outer, core);
  const ground = new THREE.Color(0xff9a3c), high = new THREE.Color(0xc9a6ff);
  return Object.assign(g, {
    set(on: boolean, power: number, alt: number) {
      g.visible = on && power > 0;
      const k = Math.min(1, alt / 0.25), fl = 0.88 + 0.24 * Math.random();
      (outer.material as THREE.MeshBasicMaterial).color.copy(ground).lerp(high, k);
      g.scale.set(1 + 1.4 * k, power * fl * (1 + 0.6 * k), 1 + 1.4 * k);
    },
  });
}

// Engine bells as a ring pattern of small dark cones under a stage.
function engines(n: number[], ringR: number[], bell: number) {
  const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: 0x2b2d33, roughness: 0.5, metalness: 0.6, transparent: true });
  n.forEach((count, i) => {
    for (let j = 0; j < count; j++) {
      const a = (j / count) * Math.PI * 2 + i * 0.3;
      const c = new THREE.Mesh(new THREE.CylinderGeometry(bell * 0.35, bell, bell * 1.4, 10, 1, true), mat);
      c.position.set(Math.cos(a) * ringR[i], -bell * 0.7, Math.sin(a) * ringR[i]); g.add(c);
    }
  });
  return g;
}

const steelMat = () => new THREE.MeshStandardMaterial({ color: 0xd8dce2, metalness: 0.55, roughness: 0.3, transparent: true });
const tileMat = () => new THREE.MeshStandardMaterial({ color: 0x1f2126, roughness: 0.85, transparent: true });
const darkMat = () => new THREE.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.6, metalness: 0.3, transparent: true });

function superHeavy() {
  const g = new THREE.Group(), steel = steelMat(), dark = darkMat();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(RAD, RAD, BOOSTER, 28), steel); body.position.y = BOOSTER / 2; g.add(body);
  // Vented hot-staging ring on top, four big grid fins just below it, chines along the sides.
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(RAD * 1.01, RAD * 1.01, 2.4 * M, 28), dark); ring.position.y = BOOSTER + 1.2 * M; g.add(ring);
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2 + Math.PI / 4;
    const fin = new THREE.Mesh(new THREE.BoxGeometry(5.5 * M, 4 * M, 0.5 * M), dark);
    fin.position.set(Math.cos(a) * (RAD + 2.6 * M), BOOSTER - 4 * M, Math.sin(a) * (RAD + 2.6 * M)); fin.rotation.y = -a + Math.PI / 2; g.add(fin);
    const chine = new THREE.Mesh(new THREE.BoxGeometry(0.6 * M, 14 * M, 1.2 * M), steel);
    chine.position.set(Math.cos(a) * RAD, 8 * M, Math.sin(a) * RAD); chine.rotation.y = -a; g.add(chine);
  }
  g.add(engines([3, 10, 20], [1 * M, 2.6 * M, 3.9 * M], 0.55 * M));
  return g;
}

function ship() {
  const g = new THREE.Group(), steel = steelMat(), tiles = tileMat();
  const barrel = SHIP - 12 * M;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(RAD, RAD, barrel, 28), steel); body.position.y = barrel / 2; g.add(body);
  // Ogive nose.
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(new THREE.Vector2(RAD * Math.sqrt(Math.max(0, 1 - t * t)) * (1 - 0.05 * t), barrel + t * 12 * M)); }
  const nose = new THREE.Mesh(new THREE.LatheGeometry(pts, 28), steel); g.add(nose);
  // Heat-shield tiles on the windward half, two small forward flaps and two big aft flaps.
  const shield = new THREE.Mesh(new THREE.CylinderGeometry(RAD * 1.01, RAD * 1.01, barrel, 28, 1, true, Math.PI * 0.5, Math.PI), tiles);
  shield.position.y = barrel / 2; g.add(shield);
  const shieldNose = new THREE.Mesh(new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p.x * 1.01, p.y)), 28, Math.PI * 0.5, Math.PI), tiles); g.add(shieldNose);
  for (const side of [-1, 1]) {
    const aft = new THREE.Mesh(new THREE.BoxGeometry(3.2 * M, 9 * M, 0.5 * M), tiles); aft.position.set(side * (RAD + 1.4 * M), 5 * M, RAD * 0.35); g.add(aft);
    const fwd = new THREE.Mesh(new THREE.BoxGeometry(2 * M, 6 * M, 0.5 * M), tiles); fwd.position.set(side * (RAD * 0.85 + 0.8 * M), barrel + 4 * M, RAD * 0.35); fwd.rotation.z = -side * 0.12; g.add(fwd);
  }
  g.add(engines([3, 3], [1.1 * M, 2.9 * M], 0.75 * M));
  return g;
}

// The launch tower ("Mechazilla") with its two catch arms, next to the launch mount.
function tower() {
  const g = new THREE.Group(), dark = new THREE.MeshStandardMaterial({ color: 0x8a8f99, roughness: 0.7, metalness: 0.3, transparent: true });
  const mast = new THREE.Mesh(new THREE.BoxGeometry(7 * M, TOWER, 7 * M), dark); mast.position.y = TOWER / 2; g.add(mast);
  const crane = new THREE.Mesh(new THREE.BoxGeometry(2 * M, 2 * M, 20 * M), dark); crane.position.set(0, TOWER + 1 * M, 6 * M); g.add(crane);
  const arms: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(side * 3.5 * M, ARMS, 4.5 * M);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.6 * M, 3 * M, 30 * M), dark); arm.position.z = 15 * M; pivot.add(arm);
    g.add(pivot); arms.push(pivot);
  }
  const mount = new THREE.Mesh(new THREE.CylinderGeometry(RAD * 1.6, RAD * 1.8, 6 * M, 20), dark); mount.position.set(0, 3 * M, PAD.k); g.add(mount);
  return Object.assign(g, {
    // 0 = arms wide open, 1 = closed around a booster on the mount's axis.
    close(k: number) { arms.forEach((p, i) => { p.rotation.y = (i ? 1 : -1) * (0.55 - 0.435 * k); }); },
  });
}

// One launch in three blows up: a shuffled bag of three outcomes, kept per visitor so a streak
// of good luck can't hide the explosion.
function nextIsBoom() {
  let bag: boolean[] = [];
  try { bag = JSON.parse(localStorage.getItem('starship-bag') || '[]'); } catch {}
  if (!Array.isArray(bag) || !bag.length) bag = [true, false, false].sort(() => Math.random() - 0.5);
  const b = !!bag.shift();
  try { localStorage.setItem('starship-bag', JSON.stringify(bag)); } catch {}
  return b;
}

export function makeStarship(scene: THREE.Scene) {
  const booster = superHeavy(), shipG = ship(), pad = tower();
  const bPlume = plume(40 * M, RAD * 0.9), sPlume = plume(22 * M, RAD * 0.55);
  booster.add(bPlume); shipG.add(sPlume);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: 0xffd08a, ...add() }));
  const all = new THREE.Group(); all.add(booster, shipG, pad, flash); all.visible = false; scene.add(all);

  // Smoke, exhaust trail and fireball puffs: a pool of soft sprites in site coordinates.
  type Puff = { s: THREE.Sprite; u: number; d: number; k: number; vu: number; vd: number; vk: number; born: number; life: number; size: number; grow: number; op: number };
  const puffs: Puff[] = [];
  for (let i = 0; i < 420; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, transparent: true, depthWrite: false }));
    s.visible = false; all.add(s);
    puffs.push({ s, u: 0, d: 0, k: 0, vu: 0, vd: 0, vk: 0, born: -1, life: 1, size: 0, grow: 0, op: 0 });
  }
  let pi = 0;
  const puff = (o: Partial<Puff> & { u: number; d: number }, now: number, color = 0xc9ccd3, blend = false) => {
    const p = puffs[pi++ % puffs.length];
    Object.assign(p, { k: 0, vu: 0, vd: 0, vk: 0, life: 2, size: 0.01, grow: 0.04, op: 0.6 }, o, { born: now });
    const m = p.s.material as THREE.SpriteMaterial;
    m.color.setHex(color); m.blending = blend ? THREE.AdditiveBlending : THREE.NormalBlending;
  };
  // Debris for the bad days.
  const debris: { m: THREE.Mesh; u: number; d: number; k: number; vu: number; vd: number; vk: number; spin: THREE.Vector3 }[] = [];
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry((1 + Math.random() * 3) * M, (1 + Math.random() * 5) * M, 0.6 * M), i % 3 ? steelMat() : tileMat());
    m.visible = false; all.add(m);
    debris.push({ m, u: 0, d: 0, k: 0, vu: 0, vd: 0, vk: 0, spin: new THREE.Vector3() });
  }

  // Ascent in site coordinates (u = height above the mount, d = east), and its slope.
  const asc = (tau: number) => ({ u: 0.006 * tau * tau, d: 0.00032 * tau * tau * tau });
  const ascV = (tau: number) => ({ u: 0.012 * tau, d: 0.00096 * tau * tau });

  let site: (() => Site | null) | null = null, t0 = 0, cb: ((s: Stage) => void) | undefined;
  let fired = new Set<Stage>(), boom = false, last = 0, boomFlash = -1;
  const once = (s: Stage) => { if (!fired.has(s)) { fired.add(s); cb?.(s); } };

  const api = {
    active: false,
    go(s: () => Site | null, on?: (s: Stage) => void) {
      site = s; cb = on; t0 = performance.now(); last = t0; fired = new Set(); api.active = true; all.visible = true;
      boom = nextIsBoom();
      for (const p of puffs) { p.born = -1; p.s.visible = false; }
      for (const d of debris) d.m.visible = false;
      boomFlash = -1;
      shipG.visible = booster.visible = true; pad.close(0);
    },
    update(now: number) {
      if (!api.active || !site) return;
      const S = site(), t = (now - t0) / 1000, dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!S) return;
      if (t > END) { api.active = false; all.visible = false; once('done'); return; }
      const north = new THREE.Vector3().crossVectors(S.n, S.e).normalize();
      const world = (u: number, d: number, k = 0) => S.n.clone().multiplyScalar(1 + u).addScaledVector(S.e, d).addScaledVector(north, k);
      const dirOf = (du: number, dd: number) => S.n.clone().multiplyScalar(du).addScaledVector(S.e, dd).normalize();
      const aim = (o: THREE.Object3D, dir: THREE.Vector3) => {
        // Keep the tiles facing north-ish so the ship does not spin about its own axis.
        const up = dir.clone(), side = new THREE.Vector3().crossVectors(up, north).normalize();
        const fwd = new THREE.Vector3().crossVectors(side, up);
        o.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(side, up, fwd));
      };
      const fade = (o: THREE.Object3D, a: number) => o.traverse((m: any) => { if (m.material && m.material.blending === THREE.NormalBlending) m.material.opacity = a; });
      const endFade = Math.max(0, Math.min(1, (END - t) / 1.5));

      pad.position.copy(world(0, 0)); aim(pad, S.n.clone()); fade(pad, endFade);
      const padK = PAD.k;
      if (t < SEP) {
        // On the mount, then climbing and pitching east (the rocket clears the tower first).
        const tau = Math.max(0, t - IGN), p = asc(tau), v = tau > 0.05 ? ascV(tau) : { u: 1, d: 0 };
        const dir = dirOf(v.u, v.d);
        booster.position.copy(world(6 * M + p.u, p.d, padK)); aim(booster, dir);
        shipG.position.copy(booster.position).addScaledVector(dir, BOOSTER + 2.4 * M); shipG.quaternion.copy(booster.quaternion);
        const power = Math.min(1, t / IGN);
        bPlume.set(t > IGN * 0.5, power, p.u); sPlume.set(false, 0, 0);
        fade(booster, 1); fade(shipG, 1); flash.visible = false;
        if (t > IGN * 0.5) {
          if (tau < 2) for (let i = 0; i < 3; i++) {
            const a = Math.random() * Math.PI * 2, sp = 0.02 + Math.random() * 0.03;
            puff({ u: 0.004, d: 0, k: padK, vd: Math.cos(a) * sp, vk: Math.sin(a) * sp, vu: 0.004, life: 3, size: 0.012, grow: 0.06, op: 0.75 }, now, 0xd6d8dc);
          } else puff({ u: 6 * M + p.u - 0.03, d: p.d - 0.03 * v.d / Math.hypot(v.u, v.d), k: padK, life: 2.2, size: 0.008, grow: 0.035, op: 0.5 }, now, 0xe4e5e8);
        }
      } else {
        once('sep');
        const s = t - SEP, tauS = SEP - IGN;
        const p0 = asc(tauS), v0 = ascV(tauS), dir0 = dirOf(v0.u, v0.d);
        const sep = { u: 6 * M + p0.u, d: p0.d };

        // Ship: lights through the hot-staging ring and flies on, or breaks up a few seconds later.
        const tau = tauS + s, p = asc(tau), v = ascV(tau), extra = 0.012 * s * s;
        const sp = { u: 6 * M + p.u + BOOSTER + extra * 0.5, d: p.d + extra };
        const sdir = dirOf(v.u + 0.004 * s, v.d + 0.02 * s);
        const BOOM_AT = 2.4;
        if (boom && s > BOOM_AT) {
          if (shipG.visible) {
            shipG.visible = false; once('boom');
            for (let i = 0; i < 40; i++) {
              const a = Math.random() * Math.PI * 2, b = (Math.random() - 0.5) * Math.PI, r = 0.03 + Math.random() * 0.08;
              puff({ u: sp.u, d: sp.d, vu: Math.sin(b) * r, vd: Math.cos(a) * Math.cos(b) * r + 0.02, vk: Math.sin(a) * Math.cos(b) * r, life: 1 + Math.random() * 1.2, size: 0.05, grow: 0.26, op: 0.95 }, now, i % 3 ? 0xff7a1a : 0xffd23a);
            }
            for (let i = 0; i < 18; i++) puff({ u: sp.u, d: sp.d, vu: (Math.random() - 0.5) * 0.04, vd: (Math.random() - 0.3) * 0.04, vk: (Math.random() - 0.5) * 0.04, life: 3, size: 0.03, grow: 0.12, op: 0.55 }, now, 0x55575d);
            boomFlash = now;
            for (const d of debris) {
              Object.assign(d, { u: sp.u, d: sp.d, k: 0, vu: (Math.random() - 0.3) * 0.08, vd: 0.03 + (Math.random() - 0.5) * 0.08, vk: (Math.random() - 0.5) * 0.08 });
              d.spin.set(Math.random() * 6, Math.random() * 6, Math.random() * 6); d.m.visible = true;
            }
          }
          for (const d of debris) {
            if (!d.m.visible) continue;
            d.vu -= 0.025 * dt; d.u += d.vu * dt; d.d += d.vd * dt; d.k += d.vk * dt;
            d.m.position.copy(world(d.u, d.d, d.k));
            d.m.rotation.x += d.spin.x * dt; d.m.rotation.y += d.spin.y * dt; d.m.rotation.z += d.spin.z * dt;
            fade(d.m, Math.max(0, 1 - (s - BOOM_AT) / 4));
            if (Math.random() < 0.3) puff({ u: d.u, d: d.d, k: d.k, life: 1, size: 0.004, grow: 0.015, op: 0.4 }, now, 0x6d6f75);
          }
        } else if (shipG.visible) {
          shipG.position.copy(world(sp.u, sp.d)); aim(shipG, sdir);
          sPlume.set(s > 0.2, 1, sp.u);
          fade(shipG, Math.min(endFade, Math.max(0, 1 - (s - 7) / 3)));
          if (s > CATCH - SEP + 0.4 && !boom) once('coast'); // after the catch, so the comments come in order
          if (s > 0.2 && s < 8) puff({ u: sp.u - 0.02 * sdir.dot(S.n), d: sp.d - 0.02, life: 1.4, size: 0.006, grow: 0.03, op: 0.4 }, now, 0xe4e5e8);
        }

        // Super Heavy: flip, boostback towards the pad, coast, then a landing burn into the arms.
        const west = dirOf(0.35, -1), upright = S.n.clone();
        let dir: THREE.Vector3, pos: { u: number; d: number; k: number }, power = 0;
        const catchU = ARMS + 3 * M - BOOSTER; // booster base when the arms close just under its grid fins
        if (s < 2) {
          dir = dir0.clone().lerp(west, s / 2).normalize();
          pos = { u: sep.u + 0.012 * s, d: sep.d + 0.006 * s, k: padK };
        } else {
          // One smooth curve from the flip point back over the tower, eased in time.
          const k = Math.min(1, (s - 2) / (CATCH - SEP - 2)), e = 1 - Math.pow(1 - k, 2.2);
          const P0 = { u: sep.u + 0.024, d: sep.d + 0.012 }, P1 = { u: sep.u + 0.06, d: sep.d * 0.15 }, P2 = { u: catchU, d: 0 };
          const q = (a: number, b: number, c: number) => (1 - e) * (1 - e) * a + 2 * (1 - e) * e * b + e * e * c;
          pos = { u: q(P0.u, P1.u, P2.u), d: q(P0.d, P1.d, P2.d), k: padK };
          // Boostback burn pointing west, then swing upright for the descent.
          dir = k < 0.3 ? west : west.clone().lerp(upright, Math.min(1, (k - 0.3) / 0.35)).normalize();
          power = k < 0.3 ? 0.8 : k > 0.82 && k < 1 ? 0.65 : 0;
          if (k >= 1) { once('catch'); dir = upright; }
          pad.close(Math.min(1, Math.max(0, (k - 0.9) / 0.1)));
        }
        booster.position.copy(world(pos.u, pos.d, pos.k)); aim(booster, dir);
        bPlume.set(power > 0, power, pos.u);
        fade(booster, endFade);

        const fb = boomFlash > 0 ? (now - boomFlash) / 700 : 2;
        flash.visible = s < 0.9 || fb < 1;
        flash.material.blending = fb < 1 ? THREE.NormalBlending : THREE.AdditiveBlending;
        flash.material.color.setHex(fb < 1 ? 0xffb347 : 0xffd08a);
        if (fb < 1) {
          flash.position.copy(world(sp.u, sp.d)); flash.scale.setScalar(0.1 + 0.45 * fb); flash.material.opacity = 1 - fb;
        } else if (flash.visible) {
          flash.position.copy(world(sep.u + BOOSTER, sep.d));
          const f = s / 0.9; flash.scale.setScalar(0.05 + 0.22 * f); flash.material.opacity = 1 - f;
        }
      }
      for (const p of puffs) {
        if (p.born < 0) continue;
        const age = (now - p.born) / 1000 / p.life;
        if (age >= 1) { p.born = -1; p.s.visible = false; continue; }
        p.u += p.vu * dt; p.d += p.vd * dt; p.k += p.vk * dt;
        p.vd *= 1 - dt * 1.2; p.vk *= 1 - dt * 1.2;
        p.s.visible = true;
        p.s.position.copy(world(p.u, p.d, p.k));
        p.s.scale.setScalar(p.size + p.grow * age);
        p.s.material.opacity = p.op * (1 - age) * endFade;
      }
    },
  };
  return api;
}
