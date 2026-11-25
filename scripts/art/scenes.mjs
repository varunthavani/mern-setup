/**
 * Original procedural artwork. Each export returns an SVG string that the
 * build script rasterises to WebP/PNG/JPG.
 */
import {
  svg, f, rng, vine, lotus, blossom, leaf, leafColored, rose, whiteFlower,
  noiseFilter, blur, goldGradient, emboss,
} from "./lib.mjs";

/* ===================================================================== */
/*  Invitation flap (left; the right flap is the same image mirrored)     */
/* ===================================================================== */
export function invitationFlap({ frame = false } = {}) {
  const W = 640, H = 1600;
  const defs = `
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#93A083"/><stop offset=".5" stop-color="#879477"/><stop offset="1" stop-color="#717E62"/>
    </linearGradient>
    <radialGradient id="glow" cx="95%" cy="45%" r="70%">
      <stop offset="0" stop-color="#FFF5E0" stop-opacity=".22"/><stop offset="1" stop-color="#FFF5E0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vign" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2C3424" stop-opacity=".35"/><stop offset=".25" stop-color="#2C3424" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="band" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#C9B28C"/><stop offset=".3" stop-color="#F1E3C8"/><stop offset=".7" stop-color="#E5D1B5"/><stop offset="1" stop-color="#B89E76"/>
    </linearGradient>
    ${goldGradient("gold", "v")}
    ${noiseFilter("n1", { freq: 0.85, alpha: 0.1 })}
    ${noiseFilter("n2", { freq: 0.6, alpha: 0.06, color: "1 1 1", seed: 9 })}
    ${noiseFilter("fib", { freq: "0.012 0.4", alpha: 0.05, color: "1 1 1", octaves: 2, seed: 2 })}
    ${blur("eb", 1.9)}
    <g id="pattern">
      ${vine({ p0: [120, 1600], p1: [40, 1300], p2: [300, 1120], p3: [200, 820], leaves: 16, leafLen: 58, leafW: 18, stroke: 5, seed: 11, flowers: 2 })}
      ${vine({ p0: [200, 820], p1: [110, 600], p2: [360, 470], p3: [250, 180], leaves: 14, leafLen: 50, leafW: 16, stroke: 4, seed: 23, flowers: 2 })}
      ${vine({ p0: [600, 40], p1: [480, 180], p2: [560, 320], p3: [430, 430], leaves: 9, leafLen: 44, leafW: 14, stroke: 3.5, seed: 31, flowers: 1, flip: -1 })}
      ${vine({ p0: [600, 1250], p1: [470, 1150], p2: [540, 980], p3: [430, 900], leaves: 8, leafLen: 42, leafW: 13, stroke: 3.5, seed: 37, flowers: 1, flip: -1 })}
      ${lotus(250, 1440, 1.55, 'fill="currentColor"')}
      ${lotus(470, 1520, 1.0, 'fill="currentColor"')}
      <g transform="rotate(-12 250 175)">${lotus(250, 175, 0.95, 'fill="currentColor"')}</g>
      ${blossom(420, 640, 22, 5, 'fill="currentColor"')}
      ${blossom(90, 520, 18, 5, 'fill="currentColor"')}
      ${blossom(520, 1380, 16, 5, 'fill="currentColor"')}
      ${vine({ p0: [470, 1180], p1: [560, 1000], p2: [330, 900], p3: [420, 700], leaves: 10, leafLen: 50, leafW: 16, stroke: 3.5, seed: 41, flowers: 1 })}
      ${vine({ p0: [420, 700], p1: [520, 560], p2: [380, 520], p3: [470, 360], leaves: 8, leafLen: 44, leafW: 14, stroke: 3, seed: 43, flowers: 1, flip: -1 })}
      ${vine({ p0: [60, 980], p1: [140, 920], p2: [60, 800], p3: [130, 700], leaves: 6, leafLen: 40, leafW: 13, stroke: 3, seed: 47, flowers: 0 })}
    </g>
    <g id="damask">${(() => {
      const R = rng(99);
      let d = "";
      for (let y = 60; y < H; y += 90) for (let x = 60 + ((y / 90) % 2) * 45; x < W - 30; x += 90) {
        if (R() > 0.55) continue;
        d += blossom(x, y, 6, 4, 'fill="currentColor"', 45);
      }
      return d;
    })()}</g>`;

  const border = `
    <path d="M${W} 30 H30 V${H - 30} H${W}" fill="none" stroke="url(#gold)" stroke-width="3"/>
    <path d="M${W} 42 H42 V${H - 42} H${W}" fill="none" stroke="url(#gold)" stroke-width="1.2" opacity=".85"/>
    ${[0, 1].map((k) => {
      const y = k ? H - 30 : 30, s = k ? -1 : 1;
      return `<g transform="translate(30 ${y}) scale(1 ${s})" fill="none" stroke="url(#gold)" stroke-width="2"><path d="M0 70 C0 30 30 0 70 0"/><path d="M12 54 C18 30 30 18 54 12"/><circle cx="26" cy="26" r="6" fill="url(#gold)"/><path d="M70 0 c10 8 22 8 30 0"/><path d="M0 70 c8 10 8 22 0 30"/></g>`;
    }).join("")}`;

  // inner ribbon band with beading (the "spine" where the flaps meet)
  let beads = "";
  for (let y = 20; y < H; y += 16) beads += `<circle cx="${W - 9}" cy="${y}" r="2.6" fill="url(#gold)"/>`;
  const band = `<rect x="${W - 26}" y="0" width="26" height="${H}" fill="url(#band)"/><rect x="${W - 26}" y="0" width="1.5" height="${H}" fill="#8C6A2E" opacity=".5"/>${beads}<rect x="${W - 26}" y="0" width="26" height="${H}" filter="url(#n1)"/>`;

  const body = `
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" filter="url(#fib)"/>
    ${emboss("damask", { shadow: "#56634A", light: "#A9B597", face: "#8C997C", dx: 1.2 })}
    ${emboss("pattern", { shadow: "#3E4934", light: "#D3DCC5", face: "#8F9C80", dx: 3 })}
    <rect width="${W}" height="${H}" filter="url(#n1)"/>
    <rect width="${W}" height="${H}" filter="url(#n2)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect width="${W}" height="${H}" fill="url(#vign)"/>
    ${frame ? border : ""}
    ${frame ? band : ""}`;
  return { svg: svg(W, H, body, defs), w: W, h: H };
}

/* ===================================================================== */
/*  Antique gold scalloped seal                                           */
/* ===================================================================== */
export function seal() {
  const S = 640, c = S / 2;
  const n = 28, R = 286, r0 = 268;
  let scallop = "";
  for (let i = 0; i <= n; i++) {
    const a1 = (i / n) * Math.PI * 2, a2 = ((i + 0.5) / n) * Math.PI * 2, a3 = ((i + 1) / n) * Math.PI * 2;
    const p = (a, rr) => `${f(c + Math.cos(a) * rr)} ${f(c + Math.sin(a) * rr)}`;
    scallop += i === 0 ? `M${p(a1, r0)} ` : "";
    if (i < n) scallop += `Q${p(a2, R + 22)} ${p(a3, r0)} `;
  }
  scallop += "Z";
  let beads = "";
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    beads += `<circle cx="${f(c + Math.cos(a) * 226)}" cy="${f(c + Math.sin(a) * 226)}" r="3.6" fill="url(#gD)"/>`;
  }
  let rim = "";
  for (let i = 0; i < 16; i++) {
    const a = (360 / 16) * i;
    rim += `<g transform="translate(${c} ${c}) rotate(${a}) translate(0 -192)">${leaf(0, 6, 26, 8, -40, 'fill="currentColor"')}${leaf(0, 6, 26, 8, 40, 'fill="currentColor"')}<circle r="3.4" fill="currentColor"/></g>`;
  }
  const defs = `
    <radialGradient id="face" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#F7E7BE"/><stop offset=".45" stop-color="#D8B878"/><stop offset=".8" stop-color="#B58A45"/><stop offset="1" stop-color="#8C6A2E"/></radialGradient>
    <radialGradient id="inner" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#FBF1D6"/><stop offset=".6" stop-color="#E8D2A0"/><stop offset="1" stop-color="#C9A766"/></radialGradient>
    ${goldGradient("gD")}
    <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="9"/><feOffset dx="0" dy="10"/><feComponentTransfer><feFuncA type="linear" slope=".45"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    ${blur("eb", 1.2)}
    ${noiseFilter("sn", { freq: 1.2, alpha: 0.07 })}
    <g id="rim">${rim}</g>
    <clipPath id="sealClip"><path d="${scallop}"/></clipPath>`;
  const body = `<g transform="translate(${c} ${c}) scale(.86) translate(${-c} ${-c})">
    <g filter="url(#sh)">
      <path d="${scallop}" fill="url(#face)"/>
    </g>
    <path d="${scallop}" fill="none" stroke="#7A5A24" stroke-width="2" opacity=".6"/>
    <circle cx="${c}" cy="${c}" r="250" fill="none" stroke="#FFF1CC" stroke-width="2" opacity=".7"/>
    <circle cx="${c}" cy="${c}" r="240" fill="none" stroke="#8C6A2E" stroke-width="3"/>
    ${beads}
    <circle cx="${c}" cy="${c}" r="212" fill="url(#inner)"/>
    <circle cx="${c}" cy="${c}" r="212" fill="none" stroke="#8C6A2E" stroke-width="2.5"/>
    ${emboss("rim", { shadow: "#9C7A3C", light: "#FFF6DC", face: "#D9BE85", dx: 1.6 })}
    <circle cx="${c}" cy="${c}" r="158" fill="none" stroke="#B58A45" stroke-width="1.5" opacity=".8"/>
    <g clip-path="url(#sealClip)"><rect width="${S}" height="${S}" filter="url(#sn)"/></g>
    <ellipse cx="${c - 70}" cy="${c - 110}" rx="120" ry="60" fill="#fff" opacity=".12" transform="rotate(-30 ${c - 70} ${c - 110})"/></g>`;
  return { svg: svg(S, S, body, defs), w: S, h: S };
}

/* ===================================================================== */
/*  Champagne silk curtain panel (left; right is mirrored)               */
/* ===================================================================== */
export function curtainPanel() {
  const W = 700, H = 1800;
  const R = rng(42);
  let stops = "", x = 0;
  const tones = ["#F6EBD6", "#E9D7B9", "#D2B98F", "#BFA277", "#DCC6A1", "#F3E5CA"];
  while (x < 1) {
    const w = 0.05 + R() * 0.07;
    const seq = [
      [0, tones[5]], [0.25, tones[0]], [0.5, tones[1]], [0.72, tones[2]], [0.88, tones[3]], [1, tones[4]],
    ];
    for (const [o, c] of seq) stops += `<stop offset="${f(Math.min(1, x + w * o))}" stop-color="${c}"/>`;
    x += w;
  }
  const defs = `
    <linearGradient id="folds" x1="0" y1="0" x2="1" y2="0">${stops}</linearGradient>
    <linearGradient id="vert" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5A4026" stop-opacity=".28"/><stop offset=".12" stop-color="#5A4026" stop-opacity="0"/>
      <stop offset=".7" stop-color="#fff" stop-opacity=".06"/><stop offset=".94" stop-color="#5A4026" stop-opacity=".12"/><stop offset="1" stop-color="#5A4026" stop-opacity=".3"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".16"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    ${goldGradient("trim", "h")}
    ${noiseFilter("silk", { freq: "0.004 0.35", alpha: 0.05, octaves: 2, color: "1 1 1" })}
    ${noiseFilter("grain", { freq: 1.1, alpha: 0.05 })}`;
  let motifs = "";
  for (let y = 40; y < H; y += 60) motifs += `<path d="M${W - 26} ${y} l8 -12 l8 12 l-8 12z" fill="#8C6A2E" opacity=".55"/>`;
  const body = `
    <rect width="${W}" height="${H}" fill="url(#folds)"/>
    <rect width="${W}" height="${H}" filter="url(#silk)"/>
    <rect width="${W}" height="${H}" fill="url(#sheen)"/>
    <rect width="${W}" height="${H}" fill="url(#vert)"/>
    <rect width="${W}" height="${H}" filter="url(#grain)"/>
    <rect x="${W - 44}" width="36" height="${H}" fill="url(#trim)"/>
    <rect x="${W - 44}" width="36" height="${H}" fill="#000" opacity=".06"/>
    ${motifs}
    <rect x="${W - 8}" width="8" height="${H}" fill="#C9AE86"/>
    <rect y="${H - 46}" width="${W}" height="30" fill="url(#trim)" opacity=".9"/>`;
  return { svg: svg(W, H, body, defs), w: W, h: H };
}

/* ===================================================================== */
/*  Top valance (swags + tassels)                                        */
/* ===================================================================== */
export function valance() {
  const W = 1600, H = 330;
  const n = 4, sw = W / n;
  const defs = `
    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8AD84"/><stop offset=".35" stop-color="#F4E6CC"/><stop offset=".7" stop-color="#E2CCA8"/><stop offset="1" stop-color="#B99C72"/></linearGradient>
    ${goldGradient("g", "h")}
    ${goldGradient("gv", "v")}
    ${blur("b4", 4)}
    ${blur("b2", 2)}
    <filter id="ds" x="-10%" y="-10%" width="120%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="6"/><feOffset dy="8"/><feComponentTransfer><feFuncA type="linear" slope=".35"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  let swags = "";
  for (let i = 0; i < n; i++) {
    const x0 = i * sw - 20, x1 = (i + 1) * sw + 20, cx = (x0 + x1) / 2;
    const depth = 230;
    swags += `<g filter="url(#ds)"><path d="M${x0} 40 Q${cx} ${depth + 70} ${x1} 40 L${x1} 20 L${x0} 20Z" fill="url(#sg)"/>`;
    for (let k = 1; k <= 5; k++) {
      const d = 40 + (depth - 40) * (k / 6) + 10;
      swags += `<path d="M${x0 + 10} 44 Q${cx} ${d + 50} ${x1 - 10} 44" fill="none" stroke="#9E8058" stroke-width="5" opacity=".35" filter="url(#b4)"/>`;
      swags += `<path d="M${x0 + 10} 40 Q${cx} ${d + 38} ${x1 - 10} 40" fill="none" stroke="#FFF8EA" stroke-width="4" opacity=".55" filter="url(#b2)"/>`;
    }
    // gold fringe on the hem
    for (let t = 0.04; t < 0.97; t += 0.018) {
      const u = 1 - t;
      const px = u * u * x0 + 2 * u * t * cx + t * t * x1;
      const py = u * u * 40 + 2 * u * t * (depth + 70) + t * t * 40;
      swags += `<rect x="${f(px - 1.2)}" y="${f(py - 4)}" width="2.4" height="16" fill="url(#gv)"/>`;
    }
    swags += `<path d="M${x0} 40 Q${cx} ${depth + 70} ${x1} 40" fill="none" stroke="url(#g)" stroke-width="6"/></g>`;
  }
  let tassels = "";
  for (let i = 0; i <= n; i++) {
    const x = i * sw;
    tassels += `<g transform="translate(${x} 44)"><path d="M0 0 V70" stroke="url(#gv)" stroke-width="4"/><circle cy="78" r="13" fill="url(#g)"/><path d="M-11 86 Q0 82 11 86 L18 168 Q0 178 -18 168Z" fill="url(#gv)"/>${[...Array(7)].map((_, k) => `<path d="M${-14 + k * 4.6} 92 L${-17 + k * 5.6} 166" stroke="#7A5A24" stroke-width="1" opacity=".5"/>`).join("")}<rect x="-14" y="92" width="28" height="7" rx="3" fill="#8C6A2E"/></g>`;
  }
  const body = `
    ${swags}
    <rect x="0" y="0" width="${W}" height="34" fill="url(#sg)"/>
    <rect x="0" y="0" width="${W}" height="34" fill="#5A4026" opacity=".12"/>
    <rect x="0" y="28" width="${W}" height="8" fill="url(#g)"/>
    ${tassels}`;
  return { svg: svg(W, H, body, defs), w: W, h: H };
}

/* ===================================================================== */
/*  Corner drape — a curtain gathered and tied back (left; mirror right) */
/* ===================================================================== */
export function cornerDrape() {
  const W = 420, H = 1200;
  const shape = `M0 0 L330 0 C300 220 170 430 118 560 C175 640 230 860 260 1200 L0 1200Z`;
  const defs = `
    <clipPath id="cp"><path d="${shape}"/></clipPath>
    <linearGradient id="fold" x1="0" y1="0" x2="1" y2="0">
      ${[...Array(12)].map((_, i) => {
        const o = i / 11;
        const c = ["#F4E6CC", "#D9C29C", "#BFA277", "#E8D6B6"][i % 4];
        return `<stop offset="${f(o)}" stop-color="${c}"/>`;
      }).join("")}
    </linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3D2B18" stop-opacity=".25"/><stop offset=".6" stop-color="#3D2B18" stop-opacity="0"/><stop offset="1" stop-color="#3D2B18" stop-opacity=".18"/></linearGradient>
    ${goldGradient("g")}
    ${blur("b3", 3)}
    ${noiseFilter("silk", { freq: "0.01 0.3", alpha: 0.05, octaves: 2, color: "1 1 1" })}
    <filter id="ds" x="-20%" y="-5%" width="150%" height="110%"><feGaussianBlur in="SourceAlpha" stdDeviation="10"/><feOffset dx="10" dy="6"/><feComponentTransfer><feFuncA type="linear" slope=".3"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  // fold lines converge to the tie-back
  let lines = "";
  for (let i = 0; i < 9; i++) {
    const tx = 10 + i * 36, bx = 10 + i * 28;
    const tie = 40 + i * 9;
    lines += `<path d="M${tx} 0 C${tx * 0.9} 240 ${tie + 10} 420 ${tie} 560 C${tie + 20} 760 ${bx + 20} 980 ${bx} 1200" stroke="${i % 2 ? "#A98B62" : "#FFF6E6"}" stroke-width="${i % 2 ? 7 : 5}" fill="none" opacity="${i % 2 ? 0.4 : 0.5}" filter="url(#b3)"/>`;
  }
  const body = `
    <g filter="url(#ds)">
      <path d="${shape}" fill="url(#fold)"/>
      <g clip-path="url(#cp)">${lines}<rect width="${W}" height="${H}" filter="url(#silk)"/><rect width="${W}" height="${H}" fill="url(#shade)"/></g>
      <path d="M330 0 C300 220 170 430 118 560 C175 640 230 860 260 1200" fill="none" stroke="url(#g)" stroke-width="7"/>
    </g>
    <g transform="translate(118 560)">
      <ellipse rx="70" ry="16" fill="url(#g)" transform="rotate(-8)"/>
      <path d="M-60 -6 Q0 14 60 -10" stroke="#7A5A24" stroke-width="2" fill="none" opacity=".6"/>
      <path d="M40 6 V70" stroke="url(#g)" stroke-width="4"/>
      <circle cx="40" cy="76" r="11" fill="url(#g)"/>
      <path d="M31 82 Q40 79 49 82 L55 150 Q40 158 25 150Z" fill="url(#g)"/>
    </g>`;
  return { svg: svg(W, H, body, defs), w: W, h: H };
}

/* ===================================================================== */
/*  Royal palace + sky (background layer)                                */
/* ===================================================================== */
function palace(cx, base, s, night = false) {
  const wall = night ? "#E9D3B0" : "#F3E4CB";
  const shade = night ? "#BFA07A" : "#DCC3A0";
  const deep = night ? "#8E6F4E" : "#C2A47F";
  const win = night ? "#FFD27A" : "#F6D9A2";
  const winGlow = 'filter="url(#wg)"';
  const gold = "url(#gold)";
  let g = "";
  const arch = (x, y, w, h, fill) => `<path d="M${f(x - w / 2)} ${f(y)} V${f(y - h + w / 2)} Q${f(x - w / 2)} ${f(y - h)} ${f(x)} ${f(y - h - w * 0.25)} Q${f(x + w / 2)} ${f(y - h)} ${f(x + w / 2)} ${f(y - h + w / 2)} V${f(y)}Z" fill="${fill}"/>`;
  const dome = (x, y, w, h) => `<path d="M${f(x - w / 2)} ${f(y)} C${f(x - w * 0.62)} ${f(y - h * 0.55)} ${f(x - w * 0.2)} ${f(y - h * 0.8)} ${f(x)} ${f(y - h)} C${f(x + w * 0.2)} ${f(y - h * 0.8)} ${f(x + w * 0.62)} ${f(y - h * 0.55)} ${f(x + w / 2)} ${f(y)}Z" fill="url(#domeG)"/><path d="M${f(x)} ${f(y - h)} v${f(-h * 0.22)}" stroke="${gold}" stroke-width="${f(3 * s)}"/><circle cx="${f(x)}" cy="${f(y - h * 1.1)}" r="${f(4 * s)}" fill="${gold}"/>`;
  const S = (v) => v * s;
  // wings
  for (const side of [-1, 1]) {
    const wx = cx + side * S(300);
    g += `<rect x="${f(wx - S(170))}" y="${f(base - S(190))}" width="${f(S(340))}" height="${f(S(190))}" fill="${wall}"/>`;
    g += `<rect x="${f(wx - S(170))}" y="${f(base - S(196))}" width="${f(S(340))}" height="${f(S(10))}" fill="${shade}"/>`;
    for (let i = -2; i <= 2; i++) g += arch(wx + i * S(64), base - S(20), S(38), S(110), win.replace(/^/, "")) .replace("/>", ` ${winGlow}/>`);
    for (let i = -2; i <= 2; i++) g += `<rect x="${f(wx + i * S(64) - S(22))}" y="${f(base - S(150))}" width="${f(S(44))}" height="${f(S(4))}" fill="${deep}"/>`;
    // chhatri on wing
    const tx = wx + side * S(150);
    g += `<rect x="${f(tx - S(34))}" y="${f(base - S(300))}" width="${f(S(68))}" height="${f(S(300))}" fill="${wall}"/>`;
    g += `<rect x="${f(tx - S(34))}" y="${f(base - S(300))}" width="${f(S(12))}" height="${f(S(300))}" fill="${shade}" opacity=".7"/>`;
    for (let k = 0; k < 3; k++) g += arch(tx, base - S(60) - k * S(80), S(22), S(42), win).replace("/>", ` ${winGlow}/>`);
    g += dome(tx, base - S(300), S(78), S(70));
    g += dome(wx - side * S(40), base - S(196), S(90), S(66));
  }
  // central block
  g += `<rect x="${f(cx - S(150))}" y="${f(base - S(290))}" width="${f(S(300))}" height="${f(S(290))}" fill="${wall}"/>`;
  g += `<rect x="${f(cx - S(160))}" y="${f(base - S(298))}" width="${f(S(320))}" height="${f(S(14))}" fill="${shade}"/>`;
  g += arch(cx, base, S(150), S(220), deep);
  g += arch(cx, base, S(124), S(200), win).replace("/>", ` ${winGlow}/>`);
  g += `<path d="M${f(cx - S(75))} ${f(base)} V${f(base - S(160))} Q${f(cx)} ${f(base - S(260))} ${f(cx + S(75))} ${f(base - S(160))} V${f(base)}" fill="none" stroke="${gold}" stroke-width="${f(S(4))}"/>`;
  for (const side of [-1, 1]) g += arch(cx + side * S(112), base - S(40), S(36), S(120), win).replace("/>", ` ${winGlow}/>`);
  // drum + main dome
  g += `<rect x="${f(cx - S(110))}" y="${f(base - S(350))}" width="${f(S(220))}" height="${f(S(60))}" fill="${wall}"/>`;
  for (let i = -3; i <= 3; i++) g += arch(cx + i * S(30), base - S(296), S(16), S(36), deep);
  g += dome(cx, base - S(350), S(230), S(210));
  // balustrade dots
  for (let x = cx - S(470); x <= cx + S(470); x += S(12)) g += `<rect x="${f(x)}" y="${f(base - S(206))}" width="${f(S(4))}" height="${f(S(10))}" fill="${shade}"/>`;
  return g;
}

export function gardenSky({ night = false } = {}) {
  const W = 1600, H = 1000;
  const defs = `
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      ${night
        ? `<stop offset="0" stop-color="#2E3A4A"/><stop offset=".45" stop-color="#6B5E73"/><stop offset=".75" stop-color="#C99A7C"/><stop offset="1" stop-color="#E8C39A"/>`
        : `<stop offset="0" stop-color="#F3E1C8"/><stop offset=".45" stop-color="#F8E9D3"/><stop offset=".75" stop-color="#F6D9BC"/><stop offset="1" stop-color="#F1E2C9"/>`}
    </linearGradient>
    <radialGradient id="sun" cx="50%" cy="58%" r="45%">
      <stop offset="0" stop-color="${night ? "#FFD9A0" : "#FFF6E2"}" stop-opacity="${night ? 0.5 : 0.95}"/><stop offset="1" stop-color="#FFF6E2" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="domeG" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${night ? "#C9AA82" : "#E4CCA6"}"/><stop offset=".45" stop-color="${night ? "#F4E0BC" : "#FBF0DC"}"/><stop offset="1" stop-color="${night ? "#A9895F" : "#D2B48A"}"/>
    </linearGradient>
    ${goldGradient("gold")}
    ${blur("haze", 6)}
    ${blur("far", 3)}
    <filter id="wg" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    ${noiseFilter("gr", { freq: 0.9, alpha: 0.035 })}`;
  const R = rng(5);
  let stars = "";
  if (night) for (let i = 0; i < 70; i++) stars += `<circle cx="${f(R() * W)}" cy="${f(R() * 380)}" r="${f(0.6 + R() * 1.4)}" fill="#FFF6E2" opacity="${f(0.3 + R() * 0.6)}"/>`;
  let farTrees = "";
  for (let x = -20; x < W + 40; x += 34 + R() * 30) {
    const h = 60 + R() * 80;
    farTrees += `<ellipse cx="${f(x)}" cy="${f(760 - h / 3)}" rx="${f(26 + R() * 20)}" ry="${f(h / 2)}" fill="${night ? "#55604C" : "#A9B394"}" opacity=".75"/>`;
  }
  const body = `
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    ${stars}
    <rect width="${W}" height="${H}" fill="url(#sun)"/>
    ${night ? "" : `<g filter="url(#haze)" fill="#FFFBF3" opacity=".7">${[[260,180,160,34],[420,150,120,26],[1250,220,180,36],[1380,190,110,24],[760,110,140,22]].map(([x,y,rx,ry])=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`).join("")}</g>`}
    <g filter="url(#far)">${farTrees}</g>
    <g>${palace(800, 776, 1.25, night)}</g>
    <rect y="760" width="${W}" height="${H - 760}" fill="${night ? "#6E6A4E" : "#C9C49F"}"/>
    <path d="M700 770 L900 770 L1200 ${H} L400 ${H}Z" fill="${night ? "#CDB89A" : "#EFE2CC"}"/>
    <rect y="752" width="${W}" height="30" fill="${night ? "#E8C39A" : "#FFF6E2"}" opacity=".35" filter="url(#haze)"/>
    <rect width="${W}" height="${H}" filter="url(#gr)"/>`;
  return { svg: svg(W, H, body, defs), w: W, h: H };
}

/* ===================================================================== */
/*  Garden mid-ground: cypress trees, hedges and fountain (transparent)  */
/* ===================================================================== */
function cypress(x, base, h, w, dark = "#4D5C3F", light = "#7E8F68") {
  const R = rng(Math.round(x * 3 + h));
  let g = `<path d="M${x} ${base - h} C${x + w * 0.6} ${base - h * 0.6} ${x + w * 0.62} ${base - h * 0.15} ${x} ${base} C${x - w * 0.62} ${base - h * 0.15} ${x - w * 0.6} ${base - h * 0.6} ${x} ${base - h}Z" fill="${dark}"/>`;
  for (let i = 0; i < 26; i++) {
    const t = R();
    const yy = base - h * t;
    const ww = w * 0.5 * Math.sin(Math.PI * Math.min(0.98, (1 - t) * 0.9 + 0.08));
    g += `<path d="M${f(x - ww * R())} ${f(yy)} q${f(ww * 0.4)} ${f(-14)} ${f(ww * 0.8)} 0" stroke="${light}" stroke-width="3" fill="none" opacity=".55"/>`;
  }
  return g + `<rect x="${x - 4}" y="${base - 6}" width="8" height="14" fill="#5B4632"/>`;
}

export function gardenMid() {
  const W = 1600, H = 700;
  const defs = `
    <linearGradient id="hedge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E8F68"/><stop offset="1" stop-color="#4D5C3F"/></linearGradient>
    <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF2E2"/><stop offset="1" stop-color="#D8C3A2"/></linearGradient>
    <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE0DA"/><stop offset="1" stop-color="#9DB8B0"/></linearGradient>
    ${goldGradient("gold")}
    ${blur("b2", 2)}
    <filter id="ds" x="-10%" y="-10%" width="120%" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="8"/><feOffset dy="8"/><feComponentTransfer><feFuncA type="linear" slope=".25"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  let trees = "";
  const pos = [[90, 560, 420, 92], [230, 600, 360, 80], [1370, 600, 360, 80], [1510, 560, 420, 92], [380, 610, 250, 60], [1220, 610, 250, 60]];
  for (const [x, b, h, w] of pos) trees += cypress(x, b, h, w);
  // fountain
  const cx = 800, fy = 610;
  let jets = "";
  for (let i = -4; i <= 4; i++) jets += `<path d="M${cx} ${fy - 230} Q${cx + i * 28} ${fy - 300} ${cx + i * 46} ${fy - 150}" stroke="#F4FBF8" stroke-width="2.4" fill="none" opacity=".75"/>`;
  for (let i = -6; i <= 6; i++) jets += `<path d="M${cx + i * 14} ${fy - 150} Q${cx + i * 30} ${fy - 120} ${cx + i * 40} ${fy - 50}" stroke="#F4FBF8" stroke-width="2" fill="none" opacity=".6"/>`;
  const fountain = `
    <g filter="url(#ds)">
      <ellipse cx="${cx}" cy="${fy}" rx="250" ry="46" fill="url(#stone)"/>
      <ellipse cx="${cx}" cy="${fy - 8}" rx="226" ry="34" fill="url(#water)"/>
      <path d="M${cx - 250} ${fy} v26 a250 46 0 0 0 500 0 v-26 a250 46 0 0 1 -500 0Z" fill="#D8C3A2"/>
      <rect x="${cx - 16}" y="${fy - 150}" width="32" height="150" fill="url(#stone)"/>
      <ellipse cx="${cx}" cy="${fy - 150}" rx="110" ry="20" fill="url(#stone)"/>
      <ellipse cx="${cx}" cy="${fy - 154}" rx="96" ry="13" fill="url(#water)"/>
      <rect x="${cx - 10}" y="${fy - 230}" width="20" height="80" fill="url(#stone)"/>
      <ellipse cx="${cx}" cy="${fy - 230}" rx="52" ry="11" fill="url(#stone)"/>
      <circle cx="${cx}" cy="${fy - 248}" r="12" fill="url(#gold)"/>
    </g>
    ${jets}
    <ellipse cx="${cx}" cy="${fy - 6}" rx="180" ry="18" fill="#fff" opacity=".25" filter="url(#b2)"/>`;
  const hedges = `
    <rect x="0" y="590" width="600" height="60" rx="30" fill="url(#hedge)"/>
    <rect x="1000" y="590" width="600" height="60" rx="30" fill="url(#hedge)"/>
    <rect x="0" y="640" width="${W}" height="60" fill="#8D9A74"/>`;
  return { svg: svg(W, H, trees + hedges + fountain, defs), w: W, h: H };
}

/* ===================================================================== */
/*  Floral cluster (roses, white blossoms, leaves) — corner decoration   */
/* ===================================================================== */
const PINK = { light: "#F7D9D6", mid: "#E8B4B1", dark: "#D08C8A", deep: "#A85F62" };
const BLUSH = { light: "#FBEAE3", mid: "#F1CFC6", dark: "#DEA9A0", deep: "#B9786F" };

export function floralCorner() {
  const W = 760, H = 760;
  const R = rng(19);
  let leaves = "", flowers = "", sprigs = "";
  for (let i = 0; i < 46; i++) {
    const a = (R() * 100 - 10) * (Math.PI / 180);
    const d = 120 + R() * 420;
    const x = Math.cos(a) * d * (0.6 + R() * 0.4), y = Math.sin(a) * d * (0.6 + R() * 0.4);
    const ang = (Math.atan2(y, x) * 180) / Math.PI + 90 + (R() - 0.5) * 60;
    const col = ["#7E8F68", "#637A48", "#94A383", "#A8B596"][i % 4];
    leaves += leafColored(x + 20, y + 20, 70 + R() * 60, 22 + R() * 14, ang, col, "#4D5C3F");
  }
  for (let i = 0; i < 14; i++) {
    const a = R() * 1.4;
    const d = 300 + R() * 300;
    sprigs += `<path d="M${f(Math.cos(a) * 100)} ${f(Math.sin(a) * 100)} Q${f(Math.cos(a) * d * 0.6 + 30)} ${f(Math.sin(a) * d * 0.6 - 30)} ${f(Math.cos(a) * d)} ${f(Math.sin(a) * d)}" stroke="#B58A45" stroke-width="2" fill="none" opacity=".8"/>`;
    for (let k = 0; k < 5; k++) {
      const t = 0.5 + k * 0.1;
      sprigs += `<circle cx="${f(Math.cos(a) * d * t)}" cy="${f(Math.sin(a) * d * t)}" r="3.5" fill="#D9BC7A"/>`;
    }
  }
  const roses = [
    [150, 150, 120, PINK], [330, 90, 82, BLUSH], [90, 340, 86, BLUSH], [300, 270, 64, PINK], [480, 60, 54, PINK], [60, 500, 56, PINK],
  ];
  roses.forEach(([x, y, r, p], i) => (flowers += rose(x, y, r, p, 50 + i)));
  const whites = [[420, 190, 40], [210, 400, 38], [560, 140, 30], [130, 600, 32], [380, 360, 30], [600, 40, 26], [20, 640, 24]];
  whites.forEach(([x, y, r], i) => (flowers += whiteFlower(x, y, r, 80 + i)));
  const defs = `<filter id="ds" x="-10%" y="-10%" width="130%" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="6"/><feOffset dx="4" dy="8"/><feComponentTransfer><feFuncA type="linear" slope=".22"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  return { svg: svg(W, H, `<g filter="url(#ds)">${sprigs}${leaves}${flowers}</g>`, defs), w: W, h: H };
}

/** Wide bottom floral border (transparent) for scene foregrounds. */
export function floralBorder() {
  const W = 1600, H = 380;
  const R = rng(77);
  let leaves = "", flowers = "";
  for (let i = 0; i < 90; i++) {
    const x = R() * W, y = 150 + R() * 230;
    const col = ["#7E8F68", "#637A48", "#94A383", "#A8B596"][i % 4];
    leaves += leafColored(x, y, 60 + R() * 70, 20 + R() * 12, -60 + R() * 120, col, "#4D5C3F");
  }
  for (let i = 0; i < 18; i++) {
    const x = 40 + i * 90 + R() * 30;
    const edge = Math.min(x, W - x) / (W / 2);
    const y = 220 + edge * 120 + R() * 30;
    if (edge > 0.55 && R() > 0.4) continue;
    flowers += rose(x, y, 46 + (1 - edge) * 40 + R() * 10, i % 2 ? PINK : BLUSH, 200 + i);
  }
  for (let i = 0; i < 22; i++) {
    const x = R() * W;
    const edge = Math.min(x, W - x) / (W / 2);
    flowers += whiteFlower(x, 200 + edge * 120 + R() * 40, 22 + R() * 12, 300 + i);
  }
  const defs = `<filter id="ds" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur in="SourceAlpha" stdDeviation="6"/><feOffset dy="-4"/><feComponentTransfer><feFuncA type="linear" slope=".2"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  return { svg: svg(W, H, `<g filter="url(#ds)">${leaves}${flowers}</g>`, defs), w: W, h: H };
}

/* ===================================================================== */
/*  Tileable ivory paper texture                                         */
/* ===================================================================== */
export function paper() {
  const S = 512;
  const defs = `
    ${noiseFilter("n1", { freq: 0.75, alpha: 0.05, seed: 3 })}
    ${noiseFilter("n2", { freq: 0.02, alpha: 0.05, octaves: 4, seed: 8, color: "0.35 0.25 0.1" })}
    ${noiseFilter("fib", { freq: "0.008 0.25", alpha: 0.04, octaves: 2, seed: 12, color: "1 1 1" })}`;
  const body = `<rect width="${S}" height="${S}" fill="#FBF4E6"/><rect width="${S}" height="${S}" filter="url(#n2)"/><rect width="${S}" height="${S}" filter="url(#n1)"/><rect width="${S}" height="${S}" filter="url(#fib)"/>`;
  return { svg: svg(S, S, body, defs), w: S, h: S };
}

/* ===================================================================== */
/*  Share image (Open Graph) — names drawn as paths from the font        */
/* ===================================================================== */
export function ogImage({ namesPath, subtitlePath, monogramPath, flapHref, cornerHref }) {
  const W = 1200, H = 630;
  const defs = `${goldGradient("gold")}
    <radialGradient id="v" cx="50%" cy="50%" r="70%"><stop offset=".55" stop-color="#FFF5E5" stop-opacity="0"/><stop offset="1" stop-color="#C9B28C" stop-opacity=".55"/></radialGradient>`;
  const body = `
    <rect width="${W}" height="${H}" fill="#FBF3E4"/>
    <image href="${flapHref}" x="0" y="0" width="300" height="${H}" preserveAspectRatio="xMaxYMid slice"/>
    <image href="${flapHref}" x="0" y="0" width="300" height="${H}" preserveAspectRatio="xMaxYMid slice" transform="translate(${W} 0) scale(-1 1)"/>
    <rect x="300" y="0" width="600" height="${H}" fill="#FFF5E5"/>
    <rect width="${W}" height="${H}" fill="url(#v)"/>
    <image href="${cornerHref}" x="300" y="0" width="230" height="230"/>
    <g transform="translate(900 630) scale(-1 -1)"><image href="${cornerHref}" x="0" y="0" width="230" height="230"/></g>
    <rect x="322" y="22" width="556" height="586" fill="none" stroke="url(#gold)" stroke-width="2.5"/>
    <rect x="334" y="34" width="532" height="562" fill="none" stroke="url(#gold)" stroke-width="1"/>
    <g fill="url(#gold)" fill-rule="evenodd">${monogramPath}</g>
    <g fill="#594B3D" fill-rule="evenodd">${namesPath}</g>
    <g fill="#8C6A2E">${subtitlePath}</g>`;
  return { svg: svg(W, H, body, defs), w: W, h: H };
}
