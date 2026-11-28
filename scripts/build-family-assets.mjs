/**
 * Builds the "સહર્ષ આમંત્રણ" (family invitation) artwork in
 * public/assets/family/ from the transparent PNG masters supplied for the
 * redesign, and writes the layer geometry to src/sections/familyArt.json.
 *
 *   node scripts/build-family-assets.mjs [folder-with-masters]
 *   (default folder: assets-src/family)
 *
 * Masters (descriptive names given when they were added to the project):
 *   pillar-left.png    carved pillar, navy curtain with tassel, hanging diya,
 *                      roses & peacock feather at the foot
 *   pillar-right.png   carved pillar, navy curtain, rose cluster with two
 *                      hanging diyas, peacock feathers, lotus diya
 *   arch.png           thin golden scalloped arch
 *   hanging-diya.png   brass diya on a chain
 *   lotus-diya.png     golden lotus diya with rose petals
 *   palace.png         golden palace silhouette
 *   swastik.png        red swastik
 *
 * The two pillar masters are single pictures, so they are split into layers
 * that the page scales and animates independently: the pillar head (beam and
 * capital), the curtain (sways), a vertically uniform shaft strip (stretched
 * by CSS so the pillar always reaches the floor), the pillar base, the
 * flowers / peacock feathers (move gently) and the hanging diyas (swing).
 * Cuts are complementary, so no pixel appears in two layers.
 *
 * Both sides are normalised to one unit system (1 unit = 1 px of the right
 * master), so their pillar shafts are the same width. familyArt.json lists
 * every layer's box in those units, measured from the side's OUTER edge
 * (x) and from the top of its group (y).
 */
import sharp from "sharp";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const SRC = process.argv[2] || "assets-src/family";
const OUT = "public/assets/family";
const JSON_OUT = "src/sections/familyArt.json";
await mkdir(OUT, { recursive: true });
const src = (n) => join(SRC, `${n}.png`);
const written = [];
const IVORY = [255, 244, 222];

/* ==========================================================================
   Helpers
   ========================================================================== */
async function raw(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height };
}
const fromRaw = (data, W, H) => sharp(data, { raw: { width: W, height: H, channels: 4 } });

/** Tints low-alpha fringe pixels towards ivory and drops near-invisible ones. */
function deHalo(data, { drop = 16, soft = 110 } = {}) {
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a <= drop) {
      data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 0;
      continue;
    }
    if (a < soft) {
      const t = 1 - (a - drop) / (soft - drop);
      for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * (1 - t) + IVORY[c] * t);
      data[i + 3] = Math.round(a * (1 - 0.35 * t));
    }
  }
  return data;
}

function alphaBox(data, W, H, min = 24) {
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (data[(y * W + x) * 4 + 3] > min) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

/** Copies the pixels inside `rect` for which keep(x, y, r, g, b, a) holds; marks them taken. */
function cut(m, rect, keep = () => true) {
  const { data, W } = m;
  const out = Buffer.alloc(rect.width * rect.height * 4);
  for (let y = 0; y < rect.height; y++)
    for (let x = 0; x < rect.width; x++) {
      const X = x + rect.left;
      const Y = y + rect.top;
      const i = (Y * W + X) * 4;
      const a = data[i + 3];
      if (!a || m.taken[Y * W + X] || !keep(X, Y, data[i], data[i + 1], data[i + 2], a)) continue;
      data.copy(out, (y * rect.width + x) * 4, i, i + 4);
      m.taken[Y * W + X] = 1;
    }
  return out;
}
/** Crops a cut buffer to its visible box; box is returned in master coordinates. */
function tight(buf, rect) {
  const b = alphaBox(buf, rect.width, rect.height, 6);
  const img = fromRaw(buf, rect.width, rect.height).extract(b);
  return { img, box: { left: rect.left + b.left, top: rect.top + b.top, width: b.width, height: b.height } };
}

async function emit(name, input, widths, { quality = 84 } = {}) {
  const png = await input.png().toBuffer();
  for (const [suffix, width] of widths) {
    const file = join(OUT, `${name}${suffix}.webp`);
    let s = sharp(png);
    if (width) s = s.resize({ width: Math.max(1, Math.round(width)) });
    await s.webp({ quality, alphaQuality: 90, effort: 6, smartSubsample: true }).toFile(file);
    const { size } = await stat(file);
    const meta = await sharp(file).metadata();
    written.push(`${file.padEnd(42)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ${(size / 1024).toFixed(0).padStart(4)} KB`);
  }
}

/* ---- colour tests ---- */
const sat = (r, g, b) => {
  const mx = Math.max(r, g, b);
  return mx ? (mx - Math.min(r, g, b)) / mx : 0;
};
const isGreen = (r, g, b) => g > r + 6 && g > b - 4 && sat(r, g, b) > 0.18;
const isPink = (r, g, b) => r > 140 && r - g > 50 && b > g - 10;
const isBlueTeal = (r, g, b) => b > r + 25 && sat(r, g, b) > 0.3;
const isBlossom = (r, g, b) => Math.min(r, g, b) > 185 && sat(r, g, b) < 0.2;

/** Piecewise-linear function through [x, y] points. */
const lerpPts = (pts) => (v) => {
  if (v <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++)
    if (v <= pts[i][0]) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      return y0 + ((v - x0) / (x1 - x0)) * (y1 - y0);
    }
  return pts[pts.length - 1][1];
};
const steps = (list) => (y) => list.find(([to]) => y < to)?.[1] ?? list[list.length - 1][1];

/** Width (px) of the opaque run that starts at or after x0 on row y. */
function runWidth({ data, W }, y, x0) {
  let x = x0;
  while (data[(y * W + x) * 4 + 3] <= 120) x++;
  const s = x;
  while (data[(y * W + x) * 4 + 3] > 120) x++;
  return x - s;
}

/** Fills transparent pixels left of each row's first curtain pixel (hidden behind the pillar) so the swaying curtain never opens a gap. */
function padEdge(buf, w, h, dir, px) {
  for (let y = 0; y < h; y++) {
    const row = y * w;
    if (dir < 0) {
      let x = 0;
      while (x < w && buf[(row + x) * 4 + 3] < 200) x++;
      if (x >= w || x === 0) continue;
      for (let k = Math.max(0, x - px); k < x; k++) buf.copy(buf, (row + k) * 4, (row + x) * 4, (row + x) * 4 + 4);
    } else {
      let x = w - 1;
      while (x >= 0 && buf[(row + x) * 4 + 3] < 200) x--;
      if (x < 0 || x === w - 1) continue;
      for (let k = x + 1; k <= Math.min(w - 1, x + px); k++) buf.copy(buf, (row + k) * 4, (row + x) * 4, (row + x) * 4 + 4);
    }
  }
  return buf;
}

const art = { unit: "px of the right pillar master", left: {}, right: {}, lamp: {}, lotus: {} };
const r1 = (v) => Math.round(v * 10) / 10;

/* ==========================================================================
   Pillars
   ========================================================================== */
const L = await raw(src("pillar-left"));
const R = await raw(src("pillar-right"));
deHalo(L.data);
deHalo(R.data);
L.taken = new Uint8Array(L.W * L.H);
R.taken = new Uint8Array(R.W * R.H);

// One unit system: scale the left master so its shaft matches the right one.
const shaftL = runWidth(L, 1380, 0);
const shaftR = runWidth(R, 1100, 700);
const kL = shaftR / shaftL;
console.log(`shaft widths: left ${shaftL}px, right ${shaftR}px → left scale ${kL.toFixed(4)}`);

/**
 * Registers a layer: emits it at 1 px/unit (and 0.5 for -sm) and records its
 * box in units from the side's outer edge and the group's top.
 */
async function layer(side, name, piece, { k, outer, groupTop, sm = true, pad = 0 }) {
  const { img, box } = piece;
  const wUnits = box.width * k;
  const sizes = [["", wUnits]];
  if (sm) sizes.push(["-sm", wUnits * 0.5]);
  await emit(`${side}-${name}`, img, sizes);
  const xFromOuter = side === "l" ? (box.left - outer) * k : (outer - (box.left + box.width)) * k;
  art[side === "l" ? "left" : "right"][name] = {
    x: r1(xFromOuter - pad * k),
    y: r1((box.top - groupTop) * k),
    w: r1(wUnits),
    h: r1(box.height * k),
  };
  return box;
}

/* ---------------------------- LEFT ---------------------------- */
{
  const m = L;
  const k = kL;
  const HEAD_END = 1357; // curtain ends at ~1345
  const SHAFT = { top: 1360, bottom: 1414 };
  const beamBottom = lerpPts([[0, 150], [205, 150], [260, 128], [320, 104], [400, 72], [470, 46], [540, 28], [600, 22], [724, 22]]);
  const pillarEdge = steps([[240, 200], [300, 178], [560, 152], [HEAD_END, 137]]);

  // Hanging diya: chain hangs below the curtain fringe.
  // Chain column only (the fringe crosses the box near the top), full width for the diya.
  const lampRect = { left: 395, top: 268, width: 205, height: 460 };
  const inLamp = (x, y) => (y >= 470 ? true : x >= (y < 300 ? 486 : 478) && x <= 508);
  const lamp = tight(cut(m, lampRect, (x, y) => inLamp(x, y)), lampRect);

  // Pillar head: beam + capital + top of the shaft.
  const headRect = { left: 0, top: 0, width: m.W, height: HEAD_END };
  const head = tight(cut(m, headRect, (x, y) => y < beamBottom(x) || x <= pillarEdge(y)), headRect);

  // Curtain: everything else above HEAD_END.
  const curtainBuf = cut(m, headRect);
  const cBox = alphaBox(curtainBuf, headRect.width, headRect.height, 6);
  const padPx = 14;
  const cRect = { left: cBox.left - padPx, top: cBox.top, width: cBox.width + padPx, height: cBox.height };
  const cBuf = Buffer.alloc(cRect.width * cRect.height * 4);
  for (let y = 0; y < cRect.height; y++)
    curtainBuf.copy(cBuf, y * cRect.width * 4 + padPx * 4, ((y + cRect.top) * m.W + cBox.left) * 4, ((y + cRect.top) * m.W + cBox.left + cBox.width) * 4);
  padEdge(cBuf, cRect.width, cRect.height, -1, padPx);
  const curtain = { img: fromRaw(cBuf, cRect.width, cRect.height), box: cRect };

  // Shaft strip, stretched vertically by CSS.
  const shaftRect = { left: 0, top: SHAFT.top, width: 160, height: SHAFT.bottom - SHAFT.top };
  const shaft = tight(cut(m, shaftRect), shaftRect);

  // Base: flowers & peacock feather separated from the pillar foot and step.
  const baseTop = SHAFT.bottom;
  const baseRect = { left: 0, top: baseTop, width: m.W, height: m.H - baseTop };
  const footEdge = steps([[1640, 148], [1700, 158], [1850, 154], [1950, 188], [2032, 218], [9999, 294]]);
  const inSlab = (x, y) => y >= 2038 && x >= 266 && x <= 586;
  const leafy = (r, g, b) => isGreen(r, g, b) || isPink(r, g, b) || isBlueTeal(r, g, b);
  const flowers = tight(
    cut(m, baseRect, (x, y, r, g, b) => {
      if (x <= footEdge(y) || inSlab(x, y)) return leafy(r, g, b);
      return true;
    }),
    baseRect
  );
  const base = tight(cut(m, baseRect), baseRect);

  const outer = 0;
  await layer("l", "head", head, { k, outer, groupTop: 0 });
  await layer("l", "curtain", curtain, { k, outer, groupTop: 0 });
  await layer("l", "lamp", lamp, { k, outer, groupTop: 0 });
  await layer("l", "shaft", shaft, { k, outer, groupTop: 0, sm: false });
  await layer("l", "base", base, { k, outer, groupTop: baseTop });
  await layer("l", "flowers", flowers, { k, outer, groupTop: baseTop });
  art.left.headH = r1(HEAD_END * k);
  art.left.baseH = r1((base.box.top + base.box.height - baseTop) * k);
  // flame centres in master px → % of the lamp box
  const lb = lamp.box;
  art.left.lampFlames = [[449, 528, 1], [384, 548, 0.6], [518, 548, 0.6]].map(([x, y, s]) => [r1(((x - lb.left) / lb.width) * 100), r1(((y - lb.top) / lb.height) * 100), s]);
}

/* ---------------------------- RIGHT ---------------------------- */
{
  const m = R;
  const k = 1;
  const HEAD_END = 1046;
  const SHAFT = { top: 1050, bottom: 1166 };
  const OUTER = 872;
  const beamBottom = lerpPts([[0, 0], [470, 0], [484, 62], [560, 64], [620, 96], [680, 136], [728, 174], [891, 174]]);
  const pillarEdge = steps([[300, 730], [332, 745], [470, 772], [HEAD_END, 786]]);

  // Rose cluster (with its two hanging diyas nested inside it).
  const inCluster = (x, y) => x >= 230 && x <= 668 && y >= 66 && y <= 425;
  // Lamps: only the chain column near the flowers, the whole box below it.
  const lamp1Rect = { left: 362, top: 296, width: 124, height: 156 };
  const lamp2Rect = { left: 458, top: 300, width: 152, height: 300 };
  const flora = (r, g, b) => isGreen(r, g, b) || isPink(r, g, b);
  const lampMask = (cx, chainEnd) => (x, y, r, g, b) => (y >= chainEnd ? true : Math.abs(x - cx) <= 12 && !flora(r, g, b));
  const lamp1 = tight(cut(m, lamp1Rect, lampMask(423, 340)), lamp1Rect);
  const lamp2 = tight(cut(m, lamp2Rect, lampMask(535, 470)), lamp2Rect);
  // Lower-left edge of the curtain swag fringe, traced on the master (y → x).
  const fringeEdge = lerpPts([[60, 506], [180, 548], [230, 586], [265, 613], [300, 648], [335, 678], [430, 682]]);

  const clusterRect = { left: 230, top: 60, width: 440, height: 370 };
  const flowers = tight(
    cut(m, clusterRect, (x, y, r, g, b) => {
      if (!inCluster(x, y)) return false;
      if (y < beamBottom(x)) return isGreen(r, g, b) || isPink(r, g, b);
      if (x < fringeEdge(y)) return true;
      return isGreen(r, g, b); // leaves lying over the fringe
    }),
    clusterRect
  );

  const headRect = { left: 0, top: 0, width: m.W, height: HEAD_END };
  const head = tight(cut(m, headRect, (x, y) => y < beamBottom(x) || x >= pillarEdge(y)), headRect);

  const curtainBuf = cut(m, headRect);
  const cBox = alphaBox(curtainBuf, headRect.width, headRect.height, 6);
  const padPx = 12;
  const cRect = { left: cBox.left, top: cBox.top, width: cBox.width + padPx, height: cBox.height };
  const cBuf = Buffer.alloc(cRect.width * cRect.height * 4);
  for (let y = 0; y < cRect.height; y++)
    curtainBuf.copy(cBuf, y * cRect.width * 4, ((y + cRect.top) * m.W + cBox.left) * 4, ((y + cRect.top) * m.W + cBox.left + cBox.width) * 4);
  padEdge(cBuf, cRect.width, cRect.height, 1, padPx);
  const curtain = { img: fromRaw(cBuf, cRect.width, cRect.height), box: cRect };

  const shaftRect = { left: 760, top: SHAFT.top, width: 131, height: SHAFT.bottom - SHAFT.top };
  const shaft = tight(cut(m, shaftRect), shaftRect);

  const baseTop = SHAFT.bottom;
  // The baked-in lotus diya (and its petals) is dropped: both sides use the lotus master.
  cut(m, { left: 300, top: 1480, width: 300, height: 285 }, (x, y) => x < 596 || y < 1588);
  const footEdge = steps([[1530, 768], [1592, 738], [9999, 9999]]);
  const peacockRect = { left: 440, top: baseTop, width: 370, height: 1592 - baseTop };
  const cream = (r, g, b) => Math.min(r, g, b) > 140 && sat(r, g, b) < 0.4;
  const peacock = tight(
    cut(m, peacockRect, (x, y, r, g, b, a) => {
      if (x < footEdge(y)) return !(y > 1500 && a > 200 && cream(r, g, b));
      return isGreen(r, g, b) || isBlueTeal(r, g, b);
    }),
    peacockRect
  );
  const baseRect = { left: 0, top: baseTop, width: m.W, height: m.H - baseTop };
  const base = tight(cut(m, baseRect), baseRect);

  const outer = OUTER;
  await layer("r", "head", head, { k, outer, groupTop: 0 });
  await layer("r", "curtain", curtain, { k, outer, groupTop: 0 });
  await layer("r", "flowers", flowers, { k, outer, groupTop: 0 });
  await layer("r", "lamp1", lamp1, { k, outer, groupTop: 0 });
  await layer("r", "lamp2", lamp2, { k, outer, groupTop: 0 });
  await layer("r", "shaft", shaft, { k, outer, groupTop: 0, sm: false });
  await layer("r", "base", base, { k, outer, groupTop: baseTop });
  await layer("r", "peacock", peacock, { k, outer, groupTop: baseTop });
  art.right.headH = HEAD_END;
  art.right.baseH = r1(base.box.top + base.box.height - baseTop);
  const pct = (b, x, y, s) => [r1(((x - b.left) / b.width) * 100), r1(((y - b.top) / b.height) * 100), s];
  art.right.lamp1Flames = [[423, 366, 1], [380, 380, 0.6], [467, 380, 0.6]].map(([x, y, s]) => pct(lamp1.box, x, y, s));
  art.right.lamp2Flames = [[535, 492, 1], [475, 512, 0.6], [594, 512, 0.6]].map(([x, y, s]) => pct(lamp2.box, x, y, s));
  // Swing pivots: top of each chain, as % of the lamp box.
  art.right.lamp1Pivot = r1(((423 - lamp1.box.left) / lamp1.box.width) * 100);
  art.right.lamp2Pivot = r1(((535 - lamp2.box.left) / lamp2.box.width) * 100);
}

/* ==========================================================================
   Stand-alone pieces
   ========================================================================== */
// Hanging diya on a long chain.
{
  const m = await raw(src("hanging-diya"));
  deHalo(m.data);
  const box = alphaBox(m.data, m.W, m.H);
  await emit("lamp", fromRaw(m.data, m.W, m.H).extract(box), [["", 300], ["-sm", 150]]);
  const pct = (x, y, s) => [r1(((x - box.left) / box.width) * 100), r1(((y - box.top) / box.height) * 100), s];
  art.lamp = { w: box.width, h: box.height, flames: [pct(500, 1030, 1), pct(300, 1062, 0.7), pct(705, 1058, 0.7)] };
}

// Lotus diya: the flame tip (above the petals) is cut out so it can flicker.
{
  const m = await raw(src("lotus-diya"));
  deHalo(m.data);
  m.taken = new Uint8Array(m.W * m.H);
  const TIP_END = 246;
  const box = alphaBox(m.data, m.W, m.H);
  const flameRect = { left: 800, top: 0, width: 190, height: TIP_END };
  const flame = tight(cut(m, flameRect, (x, y, r, g, b) => y < TIP_END && Math.abs(x - 893) < 70), flameRect);
  const body = fromRaw(cut(m, { left: 0, top: 0, width: m.W, height: m.H }), m.W, m.H).extract(box);
  await emit("lotus", body, [["", 560], ["-sm", 280]]);
  const scale = 560 / box.width;
  await emit("lotus-flame", flame.img, [["", flame.box.width * scale]]);
  art.lotus = {
    w: box.width,
    h: box.height,
    flame: {
      x: r1(((flame.box.left - box.left) / box.width) * 100),
      y: r1(((flame.box.top - box.top) / box.height) * 100),
      w: r1((flame.box.width / box.width) * 100),
      h: r1((flame.box.height / box.height) * 100),
    },
  };
}

// Arch: scalloped crown + a vertical leg strip stretched by CSS.
{
  const m = await raw(src("arch"));
  deHalo(m.data, { drop: 10, soft: 60 });
  // The master's tube is ~15 px thick, which reads heavy at desktop widths;
  // a 4 px alpha erosion (separable min filter) halves it, keeping the
  // bright centre highlight. The soft glow is added back in CSS.
  const erode = (rad) => {
    const a = new Uint8Array(m.W * m.H);
    for (let i = 0; i < a.length; i++) a[i] = m.data[i * 4 + 3];
    const tmp = new Uint8Array(a.length);
    for (let y = 0; y < m.H; y++)
      for (let x = 0; x < m.W; x++) {
        let v = 255;
        for (let d = -rad; d <= rad; d++) v = Math.min(v, a[y * m.W + Math.min(m.W - 1, Math.max(0, x + d))]);
        tmp[y * m.W + x] = v;
      }
    for (let y = 0; y < m.H; y++)
      for (let x = 0; x < m.W; x++) {
        let v = 255;
        for (let d = -rad; d <= rad; d++) v = Math.min(v, tmp[Math.min(m.H - 1, Math.max(0, y + d)) * m.W + x]);
        m.data[(y * m.W + x) * 4 + 3] = v;
      }
  };
  erode(4);
  const CROWN_END = 420;
  const box = alphaBox(m.data, m.W, CROWN_END, 10);
  const crown = fromRaw(m.data, m.W, m.H).extract({ left: box.left, top: box.top, width: box.width, height: CROWN_END - box.top });
  await emit("arch-crown", crown, [["", 1400], ["-sm", 760]]);
  const legRect = { left: 36, top: 520, width: 46, height: 300 };
  const leg = fromRaw(m.data, m.W, m.H).extract(legRect);
  await emit("arch-leg", leg, [["", null]]);
  art.arch = { w: box.width, crownH: CROWN_END - box.top, legX: r1(((legRect.left - box.left) / box.width) * 100), legW: r1((legRect.width / box.width) * 100) };
}

// Palace silhouette (shown faded at the bottom centre).
{
  const m = await raw(src("palace"));
  deHalo(m.data, { drop: 30, soft: 150 });
  const box = alphaBox(m.data, m.W, m.H, 40);
  await emit("palace", fromRaw(m.data, m.W, m.H).extract(box), [["", 900], ["-sm", 480]], { quality: 80 });
  art.palace = { w: box.width, h: box.height };
}

// Swastik.
{
  const m = await raw(src("swastik"));
  const box = alphaBox(m.data, m.W, m.H, 40);
  await emit("swastik", fromRaw(m.data, m.W, m.H).extract(box), [["", 160]], { quality: 90 });
}

await writeFile(JSON_OUT, JSON.stringify(art, null, 2) + "\n");
console.log(written.join("\n"));
console.log(`geometry → ${JSON_OUT}`);
