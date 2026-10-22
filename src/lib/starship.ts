// SpaceX Starship lifting off from a launch site on the globe, up to hot staging: Super Heavy
// flips and boosts back, the ship flies on. Heights are wildly exaggerated so it reads at
// globe scale. Positions are kept in the site's own frame (up, east), so the flight follows the
// globe when it is spun mid-launch.
import * as THREE from 'three';

export type Site = { n: THREE.Vector3; e: THREE.Vector3 }; // unit "up" at the site and unit east

const R = 0.022;            // rocket radius, in globe radii
const BOOSTER = 0.24, SHIP = 0.14;
const IGN = 1.2, SEP = 8.2, END = 14.5; // seconds after go

const soft = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d')!, r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.45, 'rgba(255,255,255,0.45)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();

function flame(len: number, rad: number) {
  const g = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.ConeGeometry(rad, len, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xff9a3c, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }));
  const inner = new THREE.Mesh(new THREE.ConeGeometry(rad * 0.55, len * 0.6, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfff1c8, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
  // Cones point up by default; flip so the tip trails below the engines.
  outer.rotation.x = inner.rotation.x = Math.PI;
  outer.position.y = -len / 2; inner.position.y = -len * 0.3;
  g.add(outer, inner);
  return g;
}

function stage(height: number, nose: boolean) {
  const g = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0xd9dde3, metalness: 0.45, roughness: 0.32, transparent: true });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(R, R, height, 20), steel);
  body.position.y = height / 2; g.add(body);
  if (nose) {
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.003, R, 0.055, 20), steel);
    cone.position.y = height + 0.0275; g.add(cone);
    // Black heat-shield tiles on the belly and four flaps.
    const tiles = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.01, R * 1.01, height, 20, 1, true, Math.PI * 0.5, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x23252b, roughness: 0.8, transparent: true }));
    tiles.position.y = height / 2; g.add(tiles);
    for (const [y, s] of [[0.012, 1], [height + 0.004, 0.6]]) for (const side of [-1, 1]) {
      const flap = new THREE.Mesh(new THREE.BoxGeometry(0.015 * s, 0.04 * s, 0.003), tiles.material);
      flap.position.set(side * R * 1.25, y + 0.02 * s, 0); g.add(flap);
    }
  } else {
    // Grid fins near the top and the hot-staging ring.
    const dark = new THREE.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.6, transparent: true });
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.016, 0.003), dark);
      const a = i * Math.PI / 2 + Math.PI / 4;
      fin.position.set(Math.cos(a) * R * 1.35, height - 0.022, Math.sin(a) * R * 1.35); fin.rotation.y = -a + Math.PI / 2; g.add(fin);
    }
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.02, R * 1.02, 0.01, 20), dark);
    ring.position.y = height + 0.005; g.add(ring);
  }
  return g;
}

export function makeStarship(scene: THREE.Scene) {
  const booster = stage(BOOSTER, false), ship = stage(SHIP, true);
  const bFlame = flame(0.13, R * 0.95), sFlame = flame(0.07, R * 0.7);
  booster.add(bFlame); ship.add(sFlame);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: 0xffd08a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  const all = new THREE.Group(); all.add(booster, ship, flash); all.visible = false; scene.add(all);

  // Exhaust and launch-pad smoke: a pool of soft sprites in site coordinates.
  type Puff = { s: THREE.Sprite; u: number; d: number; k: number; born: number; life: number; grow: number };
  const puffs: Puff[] = [];
  for (let i = 0; i < 90; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: 0xc9ccd3, transparent: true, depthWrite: false }));
    s.visible = false; all.add(s);
    puffs.push({ s, u: 0, d: 0, k: 0, born: -1, life: 1, grow: 1 });
  }
  let pi = 0;
  const puff = (u: number, d: number, k: number, now: number, life: number, grow: number) => {
    const p = puffs[pi++ % puffs.length];
    Object.assign(p, { u, d, k, born: now, life, grow });
  };

  // Flight path in site coordinates: u = height, d = distance east (globe radii).
  const path = (tau: number) => ({ u: 0.0075 * tau * tau, d: 0.00045 * tau * tau * tau });
  const slope = (tau: number) => ({ u: 0.015 * tau, d: 0.00135 * tau * tau });

  let site: (() => Site | null) | null = null, t0 = 0, cb: ((s: 'sep' | 'done') => void) | undefined, sepDone = false;
  let sepAt = { u: 0, d: 0 };
  const api = {
    active: false,
    go(s: () => Site | null, on?: (s: 'sep' | 'done') => void) {
      site = s; cb = on; t0 = performance.now(); sepDone = false; api.active = true; all.visible = true;
      for (const p of puffs) { p.born = -1; p.s.visible = false; }
    },
    update(now: number) {
      if (!api.active || !site) return;
      const S = site(), t = (now - t0) / 1000;
      if (!S || t > END) { if (t > END) { api.active = false; all.visible = false; cb?.('done'); } return; }
      const north = new THREE.Vector3().crossVectors(S.n, S.e).normalize();
      const world = (u: number, d: number, k = 0) => S.n.clone().multiplyScalar(1 + u).addScaledVector(S.e, d).addScaledVector(north, k);
      const aim = (o: THREE.Object3D, du: number, dd: number) => {
        const dir = S.n.clone().multiplyScalar(du).addScaledVector(S.e, dd).normalize();
        o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      };
      const fade = (o: THREE.Object3D, a: number) => o.traverse((m: any) => { if (m.material && !m.material.blending) m.material.opacity = a; });
      const tau = Math.max(0, t - IGN);
      const flick = 0.85 + 0.3 * Math.random();

      if (t < SEP) {
        // Stacked: on the pad, then climbing and pitching east.
        const p = path(tau), v = tau > 0.05 ? slope(tau) : { u: 1, d: 0 };
        booster.position.copy(world(p.u, p.d)); aim(booster, v.u, v.d);
        ship.position.copy(booster.position).addScaledVector(new THREE.Vector3(0, 1, 0).applyQuaternion(booster.quaternion), BOOSTER + 0.01);
        ship.quaternion.copy(booster.quaternion);
        bFlame.visible = t > IGN * 0.6; bFlame.scale.set(1, flick * Math.min(1, t / IGN), 1); sFlame.visible = false;
        fade(booster, 1); fade(ship, 1); flash.visible = false;
        if (t > IGN * 0.6) {
          if (tau < 1.5) for (let i = 0; i < 2; i++) puff(0.006, (Math.random() - 0.5) * 0.09, (Math.random() - 0.5) * 0.09, now, 2.4, 4);
          else puff(p.u - 0.04, p.d - 0.04 * v.d / Math.hypot(v.u, v.d), 0, now, 2, 2);
        }
        sepAt = p;
      } else {
        if (!sepDone) { sepDone = true; cb?.('sep'); }
        const s = t - SEP;
        // Ship: keeps going, lighting its own engines through the hot-staging ring.
        const ts = (SEP - IGN) + s, p = path(ts), v = slope(ts);
        const boost = 0.02 * s * s; // a bit faster than the stack would have been
        ship.position.copy(world(p.u + boost * 0.6, p.d + boost)); aim(ship, v.u + 0.012 * s, v.d + 0.04 * s);
        sFlame.visible = s > 0.15; sFlame.scale.set(1, flick, 1);
        fade(ship, Math.max(0, Math.min(1, (END - 1 - t) / 2.5)));
        if (s > 0.15 && t < END - 2) puff(p.u + boost * 0.6 - 0.02, p.d + boost - 0.02, 0, now, 1.4, 1.4);
        // Booster: coasts, flips over and boosts back towards the site.
        const k = Math.min(1, s / 4.5), e = k * k * (3 - 2 * k);
        const bu = sepAt.u + 0.1 * Math.sin(Math.PI * Math.min(1, s / 2.2)) - 0.25 * e;
        const bd = sepAt.d + 0.08 * Math.min(1, s / 1.2) - (sepAt.d * 0.55) * e;
        booster.position.copy(world(bu, bd));
        const flip = Math.min(1, s / 1.8) * Math.PI;
        const v0 = slope(SEP - IGN);
        aim(booster, v0.u * Math.cos(flip) - v0.d * Math.sin(flip) * 0.4, v0.d * Math.cos(flip) + v0.u * Math.sin(flip) * 0.4);
        bFlame.visible = s > 1.8 && s < 4; bFlame.scale.set(0.7, 0.6 * flick, 0.7);
        fade(booster, Math.max(0, 1 - Math.max(0, s - 3.2) / 2));
        // The hot-staging flash.
        flash.visible = s < 0.8;
        if (flash.visible) {
          flash.position.copy(ship.position);
          const f = s / 0.8; flash.scale.setScalar(0.06 + 0.25 * f); flash.material.opacity = 1 - f;
        }
      }
      for (const p of puffs) {
        if (p.born < 0) continue;
        const age = (now - p.born) / 1000 / p.life;
        if (age >= 1) { p.born = -1; p.s.visible = false; continue; }
        p.s.visible = true;
        p.s.position.copy(world(p.u, p.d, p.k));
        p.s.scale.setScalar(0.02 + 0.05 * p.grow * age);
        p.s.material.opacity = 0.7 * (1 - age);
      }
    },
  };
  return api;
}
