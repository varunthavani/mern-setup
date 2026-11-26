/**
 * Builds the optimised Hero Section artwork in public/assets/hero/ from the
 * high-resolution transparent PNG masters supplied for the redesign.
 *
 *   node scripts/build-hero-assets.mjs <folder-with-master-pngs>
 *
 * Masters are numbered as they were supplied:
 *   6 cream curtain (L) · 5 cream curtain (R) · 7 rose petals · 8 garden plants
 *   9/10 cypress · 11/12 rose bouquets · 13 lotus border · 14 lotus divider
 *   15 scroll divider · 16/17 carved pedestals · 18 standing lantern
 *   19 hanging lantern · 20 fountain · 21 palace · 22/23 velvet curtains R/L
 *   24 swag valance
 *
 * Every image is trimmed to its visible pixels, resized to the sizes the
 * layout actually needs (1x + large) and encoded as alpha WebP.
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

const SRC = process.argv[2] || "assets-src/hero";
const OUT = "public/assets/hero";
await mkdir(OUT, { recursive: true });

const src = (n) => join(SRC, `${n}.png`);
const written = [];

/** Bounding box of pixels whose alpha exceeds `min`. */
async function alphaBox(input, min = 60) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * 4 + 3] > min) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

/**
 * Removes the soft dark/coloured glow halo some masters carry around the
 * subject: low-alpha pixels are dropped and the edge is re-feathered.
 */
async function cleanHalo(buf, cut = 70, full = 200) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    data[i] = a <= cut ? 0 : a >= full ? 255 : Math.round(((a - cut) / (full - cut)) * 255);
  }
  return sharp(data, { raw: info }).png().toBuffer();
}

async function emit(name, pipelineFactory, sizes, { quality = 82 } = {}) {
  for (const [suffix, resize] of sizes) {
    const file = join(OUT, `${name}${suffix}.webp`);
    await (await pipelineFactory()).resize(resize).webp({ quality, alphaQuality: 90, effort: 6, smartSubsample: true }).toFile(file);
    const { size } = await stat(file);
    const meta = await sharp(file).metadata();
    written.push(`${file}  ${meta.width}x${meta.height}  ${(size / 1024).toFixed(0)} KB`);
  }
}

/** Trim + optional halo clean + optional extra crop, returning a sharp instance. */
function prepared(n, { halo = false, crop, flop = false, squeezeX = 1 } = {}) {
  return async () => {
    let buf = await sharp(src(n)).ensureAlpha().png().toBuffer();
    if (halo) buf = await cleanHalo(buf);
    const box = crop || (await alphaBox(buf));
    buf = await sharp(buf).extract(box).png().toBuffer();
    if (squeezeX !== 1) {
      const m = await sharp(buf).metadata();
      buf = await sharp(buf).resize(Math.round(m.width * squeezeX), m.height, { fit: "fill" }).png().toBuffer();
    }
    let s = sharp(buf);
    if (flop) s = s.flop();
    return s;
  };
}

/* ---------- Architecture ---------- */
await emit("palace", prepared(21), [["", { width: 1800 }], ["-md", { width: 1100 }]]);
// Portrait crop for phones: the grand central arch with its flanking bays.
await emit("palace-portrait", prepared(21, { crop: { left: 500, top: 11, width: 774, height: 845 } }), [["", { width: 820 }]]);
await emit("pedestal", prepared(17), [["", { height: 420 }]]);

/* ---------- Drapery ---------- */
// Tied-back velvet drapes. The outer edge of plain hanging fabric is cropped
// away so the drape, rope tie and tassels stay on screen at narrow widths.
await emit("curtain-l", prepared(23, { crop: { left: 150, top: 42, width: 780, height: 1454 }, squeezeX: 0.82 }), [["", { height: 1300 }], ["-sm", { height: 720 }]]);
await emit("curtain-r", prepared(22, { crop: { left: 122, top: 36, width: 752, height: 1476 }, squeezeX: 0.82 }), [["", { height: 1300 }], ["-sm", { height: 720 }]]);

/* ---------- Garden ---------- */
await emit("fountain", prepared(20), [["", { width: 900 }], ["-sm", { width: 560 }]]);
await emit("cypress", prepared(9), [["", { height: 720 }]]);
await emit("cypress-2", prepared(10), [["", { height: 720 }]]);
await emit("plants", prepared(8), [["", { width: 900 }], ["-sm", { width: 520 }]]);
await emit("bouquet", prepared(11), [["", { width: 900 }], ["-sm", { width: 520 }]]);
await emit("bouquet-2", prepared(12), [["", { width: 900 }], ["-sm", { width: 520 }]]);

/*
 * Seamless valance tile: cut from the centre of the first tassel to the centre
 * of the last, so tiles meet in a complete tassel. Repeating it lets the
 * valance keep any height on any width (a single image would force its
 * height from the viewport width and crowd short laptop screens).
 */
{
  const trimmed = await (await prepared(24)()).png().toBuffer();
  const { data, info } = await sharp(trimmed).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  // tassels are the widest opaque runs in the bottom fifth of the strip
  const col = new Array(W).fill(0);
  for (let y = Math.floor(H * 0.78); y < H; y++) for (let x = 0; x < W; x++) if (data[(y * W + x) * C + 3] > 128) col[x]++;
  const runs = [];
  for (let x = 0, s = -1; x <= W; x++) {
    const on = x < W && col[x] > 0;
    if (on && s < 0) s = x;
    if (!on && s >= 0) {
      runs.push([s, x - 1]);
      s = -1;
    }
  }
  const tassels = runs.filter(([a, b]) => b - a > W * 0.02 && b - a < W * 0.035).map(([a, b]) => Math.round((a + b) / 2));
  const left = tassels[0];
  const right = tassels[tassels.length - 1];
  const tile = () => Promise.resolve(sharp(trimmed).extract({ left, top: 0, width: right - left, height: H }));
  await emit("valance-tile", tile, [["", { height: 180 }], ["-sm", { height: 100 }]], { quality: 84 });
}

/* ---------- Light ---------- */
await emit("lantern-hanging", prepared(19), [["", { height: 520 }]]);
await emit("lantern", prepared(18), [["", { height: 360 }]]);

/* ---------- Ornaments ---------- */
await emit("divider-scroll", prepared(15), [["", { width: 760 }]]);
await emit("divider-lotus", prepared(14, { halo: true }), [["", { width: 760 }]]);
await emit("border-lotus", prepared(13), [["", { width: 1800 }], ["-sm", { width: 900 }]]);

/* ---------- Rose petal sprites (falling-petal shower) ---------- */
const petals = [
  [424, 27, 541, 124], [900, 39, 1007, 176], [438, 103, 583, 267], [840, 295, 964, 472],
  [1287, 422, 1409, 509], [140, 474, 284, 581], [981, 508, 1110, 623], [1281, 612, 1443, 759],
  [287, 676, 428, 837], [918, 694, 1095, 846], [605, 794, 776, 960], [306, 907, 444, 1004],
];
{
  // Single horizontal atlas: each cell is 72x72, petal centred.
  const cell = 72;
  const cleaned = await cleanHalo(await sharp(src(7)).png().toBuffer(), 150, 235);
  const tiles = [];
  for (const [i, [x0, y0, x1, y1]] of petals.entries()) {
    const pad = 4;
    const tile = await sharp(cleaned)
      .extract({ left: x0 - pad, top: y0 - pad, width: x1 - x0 + pad * 2, height: y1 - y0 + pad * 2 })
      .resize(cell, cell, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    tiles.push({ input: tile, left: i * cell, top: 0 });
  }
  const file = join(OUT, "petals.webp");
  await sharp({ create: { width: cell * petals.length, height: cell, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(tiles)
    .webp({ quality: 85, alphaQuality: 95 })
    .toFile(file);
  written.push(`${file}  atlas ${petals.length} x ${cell}px`);
}

/* ---------- Closed velvet curtain panel (intro reveal) ---------- */
{
  // Original procedural velvet: vertical folds + fine pile noise + gold trim.
  const W = 900, H = 1600;
  const folds = [];
  let x = 0;
  let k = 0;
  while (x < W) {
    const w = 46 + ((k * 37) % 41);
    folds.push(`<rect x="${x}" width="${w + 1}" height="${H}" fill="url(#fold)"/>`);
    x += w;
    k++;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="fold" x1="0" x2="1">
        <stop offset="0" stop-color="#3d0610"/>
        <stop offset=".22" stop-color="#650d1b"/>
        <stop offset=".5" stop-color="#9a1d2e"/>
        <stop offset=".7" stop-color="#7a1222"/>
        <stop offset="1" stop-color="#3a050e"/>
      </linearGradient>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000" stop-opacity=".35"/>
        <stop offset=".25" stop-color="#000" stop-opacity="0"/>
        <stop offset=".8" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".45"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" x2="1">
        <stop offset="0" stop-color="#8c6a2e"/><stop offset=".35" stop-color="#f3dfa6"/>
        <stop offset=".6" stop-color="#c49a48"/><stop offset="1" stop-color="#7a5a24"/>
      </linearGradient>
      <filter id="pile" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1 .08" numOctaves="2" seed="7"/>
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0"/>
        <feComposite in2="SourceGraphic" operator="in"/>
      </filter>
    </defs>
    ${folds.join("")}
    <rect width="${W}" height="${H}" fill="#000" filter="url(#pile)"/>
    <rect width="${W}" height="${H}" fill="url(#shade)"/>
    <rect x="${W - 34}" width="34" height="${H}" fill="url(#gold)"/>
    <rect x="${W - 40}" width="3" height="${H}" fill="#f3dfa6" opacity=".7"/>
    ${Array.from({ length: 40 }, (_, i) => `<circle cx="${W - 17}" cy="${20 + i * 40}" r="7" fill="#f8e7b4" opacity=".55"/>`).join("")}
  </svg>`;
  const file = join(OUT, "velvet-panel.webp");
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(file);
  written.push(`${file}  ${W}x${H}`);
}

console.log(written.join("\n"));
