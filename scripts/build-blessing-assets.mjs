/**
 * Builds the Divine Blessing section artwork in public/assets/blessings/ from
 * the transparent PNG masters supplied for the redesign.
 *
 *   node scripts/build-blessing-assets.mjs [folder-with-masters]
 *   (default folder: assets-src/blessings)
 *
 * Masters (descriptive names given when they were added to the project):
 *   golden-arch-altar.png   golden temple arch with kalash, diyas and lotuses
 *   divine-om.png           Om medallion with golden rays
 *   golden-bell.png         hanging temple bell with chain
 *   marigold-toran.png      marigold & mango-leaf toran with tassels
 *   mango-vine-marigold.png / mango-vine.png   hanging mango-leaf strands
 *   temple-pillar.png       carved sandstone pillar arch (background)
 *   banana-leaves-left.png / banana-leaves-right.png   corner foliage
 *
 * The arch master is one combined picture, so it is split into independent
 * layers: crown, a stretchable pillar shaft strip, two diyas, their flames
 * (animated separately), the kalash and the two flower beds. The altar
 * pieces are cut with complementary masks, so no pixel appears in two
 * layers and nothing "ghosts" during the staggered entrance.
 *
 * Several masters carry a faint red/yellow glow halo in their low-alpha
 * edge pixels; deHalo() tints those pixels towards the section ivory so the
 * soft edge stays but the colour fringe disappears.
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

const SRC = process.argv[2] || "assets-src/blessings";
const OUT = "public/assets/blessings";
await mkdir(OUT, { recursive: true });
const src = (n) => join(SRC, `${n}.png`);
const written = [];
const IVORY = [255, 248, 233];

async function raw(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height };
}
const fromRaw = (data, W, H) => sharp(data, { raw: { width: W, height: H, channels: 4 } });

/** Tints low-alpha fringe pixels towards ivory and drops near-invisible ones. */
function deHalo(data, { drop = 18, soft = 120 } = {}) {
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a <= drop) {
      data[i + 3] = 0;
      continue;
    }
    if (a < soft) {
      const t = 1 - (a - drop) / (soft - drop); // 1 at the outer edge → 0 inside
      for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] * (1 - t) + IVORY[c] * t);
      data[i + 3] = Math.round(a * (1 - 0.35 * t));
    }
  }
  return data;
}

/** Bounding box of pixels whose alpha exceeds `min`. */
function alphaBox(data, W, H, min = 40) {
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

async function emit(name, input, sizes, { quality = 84 } = {}) {
  const png = await input.png().toBuffer();
  for (const [suffix, resize] of sizes) {
    const file = join(OUT, `${name}${suffix}.webp`);
    let s = sharp(png);
    if (resize) s = s.resize(resize);
    await s.webp({ quality, alphaQuality: 90, effort: 6, smartSubsample: true }).toFile(file);
    const { size } = await stat(file);
    const meta = await sharp(file).metadata();
    written.push(`${file.padEnd(44)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)} ${(size / 1024).toFixed(0).padStart(4)} KB`);
  }
}

/** Trims a whole master to its visible pixels after removing the halo. */
async function trimmed(name, opts) {
  const { data, W, H } = await raw(src(name));
  deHalo(data, opts);
  const box = alphaBox(data, W, H);
  return fromRaw(data, W, H).extract(box);
}

/** Copies the pixels of `data` for which keep(x, y, r, g, b, a) holds into a new buffer cropped to `rect`. */
function cut(data, W, rect, keep) {
  const out = Buffer.alloc(rect.width * rect.height * 4);
  for (let y = 0; y < rect.height; y++)
    for (let x = 0; x < rect.width; x++) {
      const X = x + rect.left;
      const Y = y + rect.top;
      const i = (Y * W + X) * 4;
      const a = data[i + 3];
      if (!a || !keep(X, Y, data[i], data[i + 1], data[i + 2], a)) continue;
      data.copy(out, (y * rect.width + x) * 4, i, i + 4);
    }
  return out;
}
/** Crops a cut buffer to its visible box; returns { img, box } with box in master coordinates. */
async function tight(buf, rect) {
  const box = alphaBox(buf, rect.width, rect.height, 8);
  const img = fromRaw(buf, rect.width, rect.height).extract(box);
  return { img, box: { left: rect.left + box.left, top: rect.top + box.top, width: box.width, height: box.height } };
}

/* ==========================================================================
   Golden arch & altar
   ========================================================================== */
{
  const { data, W, H } = await raw(src("golden-arch-altar"));
  deHalo(data, { drop: 14, soft: 90 });

  // Pillar columns: opaque runs along a clean row of the shafts.
  const row = 900;
  const opaque = (x, y) => data[(y * W + x) * 4 + 3] > 120;
  let pL0 = 0;
  while (!opaque(pL0, row)) pL0++;
  let pL1 = pL0;
  while (opaque(pL1 + 1, row)) pL1++;
  let pR1 = W - 1;
  while (!opaque(pR1, row)) pR1--;
  let pR0 = pR1;
  while (opaque(pR0 - 1, row)) pR0--;
  const inPillar = (x) => x <= pL1 + 2 || x >= pR0 - 2;

  // Shared horizontal frame for crown and shaft so they stay aligned.
  const frameBox = alphaBox(data, W, 660, 40);
  const fx = { left: frameBox.left, width: frameBox.width };

  const CROWN_END = 660;
  const crown = { left: fx.left, top: 0, width: fx.width, height: CROWN_END };
  await emit("arch-crown", fromRaw(cut(data, W, crown, () => true), crown.width, crown.height), [["", { width: 1100 }], ["-sm", { width: 640 }]]);

  // Pillar shaft (vertically uniform), stretched by CSS between crown and floor.
  const shaft = { left: fx.left, top: CROWN_END, width: fx.width, height: 1000 - CROWN_END };
  await emit("arch-shaft", fromRaw(cut(data, W, shaft, (x) => inPillar(x)), shaft.width, shaft.height), [["", { width: 1100 }]]);

  /* ---- colour tests ---- */
  // lotus pink has a strong blue component; the kalash swastika red does not
  const isPink = (r, g, b) => r > 150 && r - g > 45 && b > 95 && b - g > 0;
  const isGreen = (r, g, b) => g > r + 5 && g > b + 10;
  const isWhite = (r, g, b) => Math.min(r, g, b) > 196 && Math.max(r, g, b) - Math.min(r, g, b) < 42;
  const sat = (r, g, b) => {
    const mx = Math.max(r, g, b);
    return mx ? (mx - Math.min(r, g, b)) / mx : 0;
  };

  /* ---- masks (master coordinates) ---- */
  const KX = 606;
  const kalashSil = (x, y) => {
    if (y < 1032) return x >= 498 && x <= 714;
    if (y < 1175) return ((x - KX) / 137) ** 2 + ((y - 1095) / 112) ** 2 <= 1;
    return y <= 1212 && x >= 520 && x <= 694;
  };
  const inKalash = (x, y, r, g, b) => {
    if (x < 455 || x > 760 || y < 820 || y > 1222) return false;
    if (y < 1020) return true; // coconut, mango leaves, red bud
    return kalashSil(x, y) && !isPink(r, g, b) && !isGreen(r, g, b) && !(y > 1130 && (x < 500 || x > 712) && isWhite(r, g, b));
  };
  // Diyas are symmetric about their flame: bowl, stem and foot as a silhouette.
  const diyaSpec = { l: { cx: 194, x0: 90, x1: 298 }, r: { cx: 1013, x0: 909, x1: 1117 } };
  const FLAME_END = 1027;
  const inFlame = (side, x, y) => Math.abs(x - diyaSpec[side].cx) <= 32 && y >= 925 && y <= FLAME_END;
  const diyaSil = (side, x, y) => {
    const d = Math.abs(x - diyaSpec[side].cx);
    if (y < FLAME_END - 4 || y > 1192) return false;
    if (y <= 1046) return d <= 100;
    if (y <= 1102) return d <= 100 - ((y - 1046) / 56) * 52;
    if (y <= 1140) return d <= 54;
    return d <= 80 + (y > 1172 ? 6 : 0);
  };
  const inDiya = (side, x, y, r, g, b) => {
    if (!diyaSil(side, x, y) || inFlame(side, x, y)) return false;
    if (isPink(r, g, b) || isGreen(r, g, b)) return false;
    if (inPillar(x)) return sat(r, g, b) > 0.42;
    return true;
  };

  const altar = {};
  for (const side of ["l", "r"]) {
    const s = diyaSpec[side];
    const rect = { left: s.x0, top: 925, width: s.x1 - s.x0 + 1, height: 1195 - 925 + 1 };
    altar[`diya-${side}`] = await tight(cut(data, W, rect, (x, y, r, g, b) => inDiya(side, x, y, r, g, b)), rect);
    const fr = { left: s.x0, top: 925, width: s.x1 - s.x0 + 1, height: FLAME_END - 925 + 1 };
    altar[`flame-${side}`] = await tight(cut(data, W, fr, (x, y) => inFlame(side, x, y)), fr);
  }
  {
    const rect = { left: 455, top: 820, width: 306, height: 403 };
    altar.kalash = await tight(cut(data, W, rect, inKalash), rect);
  }
  // Flower beds: everything else on the altar floor, split at the kalash axis.
  const inBed = (x, y, r, g, b) =>
    !inPillar(x) && !inKalash(x, y, r, g, b) && !inDiya("l", x, y, r, g, b) && !inDiya("r", x, y, r, g, b) && !inFlame("l", x, y) && !inFlame("r", x, y);
  {
    const rect = { left: 150, top: 1012, width: KX - 150, height: 1275 - 1012 };
    altar["bed-l"] = await tight(cut(data, W, rect, inBed), rect);
    const rectR = { left: KX, top: 1012, width: 1070 - KX, height: 1275 - 1012 };
    altar["bed-r"] = await tight(cut(data, W, rectR, inBed), rectR);
  }
  // A single symmetric lotus bloom for beneath the Om: the right bed's lotus is
  // partly hidden by the kalash, so its clear right half is mirrored about the
  // stamen centre.
  {
    let sx = 0, n = 0;
    for (let y = 1040; y < 1120; y++)
      for (let x = 780; x < 870; x++) {
        const i = (y * W + x) * 4;
        if (data[i + 3] > 200 && data[i] > 220 && data[i + 1] > 150 && data[i + 2] < 90) {
          sx += x;
          n++;
        }
      }
    const cx = Math.round(sx / n);
    const jasmine = (x, y) => x < 842 && y > 1126;
    const keep = (x, y, r, g, b) =>
      inBed(x, y, r, g, b) &&
      !isGreen(r, g, b) &&
      Math.max(r, g, b) > 125 &&
      (jasmine(x, y) ? isPink(r, g, b) : r >= g && r - b > -10 && (g - b < 30 || (Math.abs(x - cx) < 36 && y < 1122)));
    const half = { left: cx, top: 1018, width: 948 - cx, height: 172 };
    const right = cut(data, W, half, keep);
    const L = half.width;
    const full = Buffer.alloc(L * 2 * half.height * 4);
    for (let y = 0; y < half.height; y++)
      for (let x = 0; x < L; x++) {
        const from = (y * L + x) * 4;
        right.copy(full, (y * 2 * L + L + x) * 4, from, from + 4);
        right.copy(full, (y * 2 * L + (L - 1 - x)) * 4, from, from + 4);
      }
    // Close the small gap the jasmine left at the front-centre petal by
    // extending the petal colour above it downwards.
    const FW = 2 * L;
    for (let x = L - 34; x < L + 34; x++) {
      let last = -1;
      for (let y = 0; y < half.height - 8; y++) {
        const i = (y * FW + x) * 4;
        if (full[i + 3] > 200) last = i;
        else if (last >= 0 && y > 100) {
          let below = false;
          for (let k = y + 1; k < Math.min(half.height, y + 40); k++) if (full[(k * FW + x) * 4 + 3] > 200) below = true;
          if (below || Math.abs(x - L) < 22) full.copy(full, i, last, last + 4);
        }
      }
    }
    altar.lotus = await tight(full, { left: cx - L, top: 1018, width: 2 * L, height: half.height });
  }

  // Scale every altar piece by the same factor so they keep their relative size.
  const ALTAR_SCALE = 0.9;
  const dims = {};
  for (const [name, { img, box }] of Object.entries(altar)) {
    const w = Math.round(box.width * ALTAR_SCALE);
    const big = name === "lotus" ? [["", { width: Math.round(box.width * 0.8) }]] : [["", { width: w }]];
    await emit(name, img, big, { quality: 86 });
    dims[name] = box;
  }
  // Flame position inside its diya (percent of the diya box), for CSS.
  for (const side of ["l", "r"]) {
    const d = dims[`diya-${side}`];
    const f = dims[`flame-${side}`];
    const pct = (v) => +(v * 100).toFixed(2);
    console.log(
      `flame-${side}: left ${pct((f.left - d.left) / d.width)}%  top ${pct((f.top - d.top) / d.height)}%  width ${pct(f.width / d.width)}%  (diya ${d.width}x${d.height}, flame ${f.width}x${f.height})`
    );
  }
  console.log("altar boxes", JSON.stringify(dims));
  console.log("pillars", { pL0, pL1, pR0, pR1, frame: fx, W });
}

/* ==========================================================================
   Om, bell, toran, vines, pillars, foliage
   ========================================================================== */
await emit("om", await trimmed("divine-om", { drop: 30, soft: 150 }), [["", { width: 520 }], ["-sm", { width: 300 }]]);
await emit("bell", await trimmed("golden-bell", { drop: 26, soft: 140 }), [["", { height: 520 }], ["-sm", { height: 300 }]]);
await emit("vine-marigold", await trimmed("mango-vine-marigold"), [["", { height: 700 }], ["-sm", { height: 400 }]]);
await emit("vine", await trimmed("mango-vine", { drop: 30, soft: 140 }), [["", { height: 700 }], ["-sm", { height: 400 }]]);
await emit("temple-pillar", await trimmed("temple-pillar", { drop: 30, soft: 140 }), [["", { height: 900 }], ["-sm", { height: 560 }]], { quality: 78 });
await emit("banana-l", await trimmed("banana-leaves-left"), [["", { width: 720 }], ["-sm", { width: 380 }]]);
await emit("banana-r", await trimmed("banana-leaves-right"), [["", { width: 720 }], ["-sm", { width: 380 }]]);

/*
 * Marigold toran: a seamless repeat tile cut from one marigold centre to
 * another three units along (so tiles meet in a whole flower), plus the two
 * real tasselled ends. All three share the same rows, so the rod lines up.
 */
{
  const { data, W, H } = await raw(src("marigold-toran"));
  deHalo(data, { drop: 30, soft: 140 });
  const box = alphaBox(data, W, H, 60);
  const top = box.top - 4;
  const height = box.height + 8;
  const strip = (left, right) => fromRaw(data, W, H).extract({ left, top, width: right - left, height });
  const T0 = 358; // centre of the 2nd marigold
  const T1 = 893; // centre of the 5th marigold
  const E1 = 1890; // centre of the 2nd-to-last marigold
  const h = 110;
  await emit("toran-tile", strip(T0, T1), [["", { height: h }]]);
  await emit("toran-end-l", strip(box.left - 4, T0), [["", { height: h }]]);
  await emit("toran-end-r", strip(E1, box.left + box.width + 4), [["", { height: h }]]);
  console.log("toran rows", top, height, "→ aspect tile", ((T1 - T0) / height).toFixed(4));
}

console.log(written.join("\n"));
