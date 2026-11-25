/**
 * Shared helpers for the procedural artwork generator.
 * All artwork in this project is original and generated from code.
 */

export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const f = (n) => Number(n.toFixed(2));

export function svg(w, h, body, defs = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs>${body}</svg>`;
}

/* ---------- geometry ---------- */
export function cubic(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
  const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/* ---------- botanical shapes ---------- */
/** Leaf pointing "up" (negative y) from its base at origin. */
export function leafPath(len, w) {
  return `M0 0 C${f(w)} ${f(-len * 0.25)} ${f(w * 0.9)} ${f(-len * 0.7)} 0 ${f(-len)} C${f(-w * 0.9)} ${f(-len * 0.7)} ${f(-w)} ${f(-len * 0.25)} 0 0Z`;
}

export function leaf(x, y, len, w, angle, extra = "") {
  return `<path d="${leafPath(len, w)}" transform="translate(${f(x)} ${f(y)}) rotate(${f(angle)})" ${extra}/>`;
}

/** Leaf with a visible midrib (for coloured art). */
export function leafColored(x, y, len, w, angle, fill, rib) {
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(angle)})"><path d="${leafPath(len, w)}" fill="${fill}"/><path d="M0 0 Q${f(w * 0.12)} ${f(-len * 0.5)} 0 ${f(-len * 0.95)}" stroke="${rib}" stroke-width="${f(Math.max(0.8, w * 0.08))}" fill="none" opacity=".7"/></g>`;
}

/** A climbing vine along a cubic bezier with alternating leaves & buds. */
export function vine({ p0, p1, p2, p3, leaves = 14, leafLen = 46, leafW = 15, stroke = 5, seed = 7, flowers = 2, flip = 1 }) {
  const r = rng(seed);
  let out = `<path d="M${p0} C${p1} ${p2} ${p3}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round"/>`;
  for (let i = 1; i <= leaves; i++) {
    const t = i / (leaves + 1);
    const pt = cubic(p0, p1, p2, p3, t);
    const side = i % 2 ? 1 : -1;
    const scale = 0.65 + r() * 0.5;
    const ang = pt.a + 90 + side * (40 + r() * 25) * flip;
    out += leaf(pt.x, pt.y, leafLen * scale, leafW * scale, ang, `fill="currentColor"`);
    // tiny tendril
    if (r() > 0.6) {
      const tl = 18 + r() * 14;
      const ta = ((ang - 90) * Math.PI) / 180;
      out += `<path d="M${f(pt.x)} ${f(pt.y)} q${f(Math.cos(ta) * tl * 0.6)} ${f(Math.sin(ta) * tl * 0.6 - 8)} ${f(Math.cos(ta) * tl)} ${f(Math.sin(ta) * tl)}" stroke="currentColor" stroke-width="1.6" fill="none"/>`;
    }
  }
  for (let k = 0; k < flowers; k++) {
    const t = 0.25 + (k / Math.max(1, flowers)) * 0.65 + r() * 0.05;
    const pt = cubic(p0, p1, p2, p3, t);
    out += blossom(pt.x + 10 * flip, pt.y, 14 + r() * 6, 5, `fill="currentColor"`);
  }
  return out;
}

/** Five-petal blossom silhouette. */
export function blossom(cx, cy, r, n = 5, extra = "", rot = 0) {
  let p = "";
  for (let i = 0; i < n; i++) {
    const a = rot + (360 / n) * i;
    p += `<ellipse cx="0" cy="${f(-r * 0.55)}" rx="${f(r * 0.42)}" ry="${f(r * 0.55)}" transform="rotate(${f(a)})"/>`;
  }
  return `<g transform="translate(${f(cx)} ${f(cy)})" ${extra}>${p}<circle r="${f(r * 0.22)}"/></g>`;
}

/** Lotus silhouette (base at origin, opening upward). */
export function lotus(cx, cy, s, extra = "") {
  const petals = [
    [-70, 0.7], [-48, 0.85], [-24, 0.95], [0, 1.05], [24, 0.95], [48, 0.85], [70, 0.7],
  ];
  let p = "";
  for (const [a, k] of petals) {
    p += `<path d="${leafPath(60 * k * s, 20 * k * s)}" transform="rotate(${a})"/>`;
  }
  // base leaves
  p += `<path d="M${-58 * s} ${4 * s} Q0 ${26 * s} ${58 * s} ${4 * s} Q0 ${14 * s} ${-58 * s} ${4 * s}Z"/>`;
  return `<g transform="translate(${f(cx)} ${f(cy)})" ${extra}>${p}</g>`;
}

/* ---------- coloured flowers ---------- */
export function rose(cx, cy, r, palette, seed = 3) {
  const R = rng(seed);
  const { light, mid, dark, deep } = palette;
  const id = `rg${seed}_${Math.round(cx)}_${Math.round(cy)}`;
  let out = `<radialGradient id="${id}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="${dark}"/><stop offset=".55" stop-color="${mid}"/><stop offset="1" stop-color="${light}"/></radialGradient>`;
  out += `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(R() * 360)})">`;
  out += `<circle r="${f(r)}" fill="url(#${id})"/>`;
  const layers = [
    { n: 6, rr: 1.0, w: 0.75 },
    { n: 5, rr: 0.78, w: 0.7 },
    { n: 4, rr: 0.56, w: 0.65 },
    { n: 3, rr: 0.36, w: 0.6 },
  ];
  layers.forEach((L, li) => {
    const off = R() * 60;
    for (let i = 0; i < L.n; i++) {
      const a = off + (360 / L.n) * i;
      const pr = r * L.rr;
      const col = li % 2 ? mid : light;
      out += `<path d="M${f(-pr * L.w)} 0 Q${f(-pr * L.w)} ${f(-pr * 1.05)} 0 ${f(-pr)} Q${f(pr * L.w)} ${f(-pr * 1.05)} ${f(pr * L.w)} 0 Q0 ${f(-pr * 0.35)} ${f(-pr * L.w)} 0Z" fill="${col}" opacity=".92" transform="rotate(${f(a)})"/>`;
      out += `<path d="M${f(-pr * L.w * 0.8)} ${f(-pr * 0.15)} Q0 ${f(-pr * 0.45)} ${f(pr * L.w * 0.8)} ${f(-pr * 0.15)}" stroke="${dark}" stroke-width="${f(r * 0.03)}" fill="none" opacity=".45" transform="rotate(${f(a)})"/>`;
    }
  });
  // spiral heart
  out += `<path d="M0 0 m${f(-r * 0.05)} 0 a${f(r * 0.08)} ${f(r * 0.08)} 0 1 1 ${f(r * 0.16)} 0 a${f(r * 0.14)} ${f(r * 0.14)} 0 1 1 ${f(-r * 0.28)} 0 a${f(r * 0.2)} ${f(r * 0.2)} 0 1 1 ${f(r * 0.4)} 0" stroke="${deep}" stroke-width="${f(r * 0.03)}" fill="none" opacity=".45"/>`;
  out += `</g>`;
  return out;
}

export function whiteFlower(cx, cy, r, seed = 1) {
  const R = rng(seed);
  const rot = R() * 72;
  let out = `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(rot)})">`;
  for (let i = 0; i < 5; i++) {
    out += `<path d="M0 0 C${f(r * 0.5)} ${f(-r * 0.3)} ${f(r * 0.45)} ${f(-r)} 0 ${f(-r)} C${f(-r * 0.45)} ${f(-r)} ${f(-r * 0.5)} ${f(-r * 0.3)} 0 0Z" fill="#FFFDF7" stroke="#E7DCC8" stroke-width="1" transform="rotate(${i * 72})"/>`;
  }
  out += `<circle r="${f(r * 0.2)}" fill="#E8C66A"/>`;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    out += `<circle cx="${f(Math.cos(a) * r * 0.3)}" cy="${f(Math.sin(a) * r * 0.3)}" r="${f(r * 0.05)}" fill="#B58A45"/>`;
  }
  return out + `</g>`;
}

export function marigold(cx, cy, r, seed = 2) {
  const R = rng(seed);
  let out = `<g transform="translate(${f(cx)} ${f(cy)})">`;
  const rings = [
    [1, 16, "#E08A1E"],
    [0.8, 14, "#F0A42A"],
    [0.6, 12, "#F6B93B"],
    [0.4, 9, "#FBCB55"],
  ];
  for (const [k, n, c] of rings) {
    const off = R() * 30;
    for (let i = 0; i < n; i++) {
      out += `<ellipse cx="0" cy="${f(-r * k * 0.62)}" rx="${f(r * k * 0.26)}" ry="${f(r * k * 0.4)}" fill="${c}" transform="rotate(${f(off + (360 / n) * i)})"/>`;
    }
  }
  return out + `<circle r="${f(r * 0.18)}" fill="#C46A12"/></g>`;
}

/* ---------- filters ---------- */
export function noiseFilter(id, { freq = 0.9, alpha = 0.08, color = "0 0 0", octaves = 3, seed = 4 } = {}) {
  const [r, g, b] = color.split(" ");
  return `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${octaves}" seed="${seed}" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 ${alpha * 4} ${-alpha}"/></filter>`;
}

export const blur = (id, sd) => `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${sd}"/></filter>`;

export function goldGradient(id, dir = "diag") {
  const coords = dir === "v" ? 'x1="0" y1="0" x2="0" y2="1"' : dir === "h" ? 'x1="0" y1="0" x2="1" y2="0"' : 'x1="0" y1="0" x2="1" y2="1"';
  return `<linearGradient id="${id}" ${coords}><stop offset="0" stop-color="#8C6A2E"/><stop offset=".22" stop-color="#E9CF8E"/><stop offset=".45" stop-color="#B58A45"/><stop offset=".62" stop-color="#F3DFA6"/><stop offset=".82" stop-color="#A57B37"/><stop offset="1" stop-color="#D9BC7A"/></linearGradient>`;
}

/** Render a group three times to fake letterpress embossing. */
export function emboss(groupId, { shadow, light, face, dx = 2.2, blurId = "eb" }) {
  return `<use href="#${groupId}" color="${shadow}" transform="translate(${dx} ${dx})" filter="url(#${blurId})" opacity=".75"/>
<use href="#${groupId}" color="${light}" transform="translate(${-dx * 0.7} ${-dx * 0.7})" filter="url(#${blurId})" opacity=".8"/>
<use href="#${groupId}" color="${face}"/>`;
}
