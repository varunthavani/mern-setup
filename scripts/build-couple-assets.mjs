/**
 * Builds the Couple-section artwork in public/assets/couple/ from the
 * high-resolution masters in assets-src/couple/.
 *
 *   node scripts/build-couple-assets.mjs [folder-with-masters]
 *
 * Masters:
 *   couple-photo.png    the couple photograph (opaque)
 *   royal-frame.png     golden scalloped arch frame with toran, bell & lanterns
 *   palace-chhatri.png  carved chhatri / pavilion (transparent)
 *   floral-corner.png   rose corner spray (transparent)
 *
 * The frame is split into three files so the page can animate and mask it:
 *   frame.webp       the frame with the hanging bell erased
 *   bell.webp        the bell on its own (swings from its top centre)
 *   photo-mask.webp  alpha mask of the frame's inner opening — the photo is
 *                    clipped by it, so it tucks exactly under the gold border
 * Positions of the bell and the opening (as % of the frame) are printed so
 * src/styles/couple.css can place them.
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

const SRC = process.argv[2] || "assets-src/couple";
const OUT = "public/assets/couple";
await mkdir(OUT, { recursive: true });
const src = (n) => join(SRC, `${n}.png`);
const written = [];

async function raw(input) {
  return sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

/** Bounding box of pixels whose alpha exceeds `min`. */
function alphaBox({ data, info }, min = 24) {
  const { width: W, height: H } = info;
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

/** Drops faint halo pixels and re-feathers the edge. */
function cleanHalo(data, cut = 40, full = 160) {
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    data[i] = a <= cut ? 0 : a >= full ? 255 : Math.round(((a - cut) / (full - cut)) * 255);
  }
}

async function emit(name, input, sizes, { quality = 82, alpha = true } = {}) {
  for (const [suffix, width] of sizes) {
    const file = join(OUT, `${name}${suffix}.webp`);
    await sharp(input.data ? input.data : input, input.info ? { raw: input.info } : undefined)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, alphaQuality: alpha ? 90 : 100, effort: 6, smartSubsample: true })
      .toFile(file);
    const m = await sharp(file).metadata();
    written.push(`${file}  ${m.width}×${m.height}  ${((await stat(file)).size / 1024).toFixed(0)} KB`);
  }
}

const pct = (v, total) => `${((v / total) * 100).toFixed(2)}%`;

/* ---------------- Couple photograph ---------------- */
await emit("couple", src("couple-photo"), [["", 900], ["-sm", 560]], { quality: 80, alpha: false });

/* ---------------- Royal frame, bell & photo mask ---------------- */
{
  const full = await raw(src("royal-frame"));
  const box = alphaBox(full);
  const fr = await sharp(full.data, { raw: full.info }).extract(box).raw().toBuffer({ resolveWithObject: true });
  const { data, info } = fr;
  const W = info.width;
  const H = info.height;
  const A = (x, y) => data[(y * W + x) * 4 + 3];

  // Bell: master coords x 694–762, y 196–272 (garland ends just above).
  const bell = { left: 694 - box.left, top: 196 - box.top, width: 68, height: 76 };
  const bellBuf = await sharp(data, { raw: info }).extract(bell).raw().toBuffer({ resolveWithObject: true });
  const bb = alphaBox(bellBuf, 10);
  const bellTight = { left: bell.left + bb.left, top: bell.top + bb.top, width: bb.width, height: bb.height };
  const bellImg = await sharp(data, { raw: info }).extract(bellTight).png().toBuffer();
  await emit("bell", bellImg, [["", 120]], { quality: 90 });

  // Inner opening: flood-fill transparent pixels from the centre, then close
  // each row and column span so garlands/lanterns overlapping the opening are
  // inside the mask (the frame covers them anyway).
  const inside = new Uint8Array(W * H);
  const stack = [[Math.round(W / 2), Math.round(H * 0.55)]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= W || y >= H) continue;
    const i = y * W + x;
    if (inside[i] || A(x, y) > 30) continue;
    inside[i] = 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  const closed = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    let a = -1, b = -1;
    for (let x = 0; x < W; x++) if (inside[y * W + x]) { if (a < 0) a = x; b = x; }
    for (let x = a; a >= 0 && x <= b; x++) closed[y * W + x] = 1;
  }
  for (let x = 0; x < W; x++) {
    let a = -1, b = -1;
    for (let y = 0; y < H; y++) if (closed[y * W + x]) { if (a < 0) a = y; b = y; }
    for (let y = a; a >= 0 && y <= b; y++) closed[y * W + x] = 1;
  }
  // Grow by a few px so the photo edge hides beneath the opaque gold border.
  const GROW = 7;
  let mask = closed;
  for (let g = 0; g < GROW; g++) {
    const next = mask.slice();
    for (let y = 1; y < H - 1; y++)
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        if (!mask[i] && (mask[i - 1] || mask[i + 1] || mask[i - W] || mask[i + W])) next[i] = 1;
      }
    mask = next;
  }
  let mx0 = W, my0 = H, mx1 = -1, my1 = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (mask[y * W + x]) {
        if (x < mx0) mx0 = x;
        if (x > mx1) mx1 = x;
        if (y < my0) my0 = y;
        if (y > my1) my1 = y;
      }
  const mw = mx1 - mx0 + 1;
  const mh = my1 - my0 + 1;
  const mbuf = Buffer.alloc(mw * mh * 4);
  for (let y = 0; y < mh; y++)
    for (let x = 0; x < mw; x++) {
      const o = (y * mw + x) * 4;
      mbuf[o] = mbuf[o + 1] = mbuf[o + 2] = 255;
      mbuf[o + 3] = mask[(y + my0) * W + x + mx0] ? 255 : 0;
    }
  const maskPng = await sharp(mbuf, { raw: { width: mw, height: mh, channels: 4 } }).blur(1.2).png().toBuffer();
  await emit("photo-mask", maskPng, [["", 480]], { quality: 70 });

  // Erase the bell from the frame (it is drawn by bell.webp instead).
  for (let y = bellTight.top - 1; y < bellTight.top + bellTight.height + 1; y++)
    for (let x = bellTight.left - 1; x < bellTight.left + bellTight.width + 1; x++) data[(y * W + x) * 4 + 3] = 0;
  await emit("frame", { data, info }, [["", 1200], ["-sm", 720]], { quality: 84 });

  console.log(`frame ${W}×${H}  aspect ${(W / H).toFixed(4)}`);
  console.log(`opening  left ${pct(mx0, W)}  top ${pct(my0, H)}  width ${pct(mw, W)}  height ${pct(mh, H)}  aspect ${(mw / mh).toFixed(4)}`);
  console.log(
    `bell     left ${pct(bellTight.left, W)}  top ${pct(bellTight.top, H)}  width ${pct(bellTight.width, W)}  aspect ${(bellTight.width / bellTight.height).toFixed(4)}`
  );
}

/* ---------------- Palace chhatri ---------------- */
{
  const p = await raw(src("palace-chhatri"));
  cleanHalo(p.data);
  const box = alphaBox(p, 10);
  const trimmed = await sharp(p.data, { raw: p.info }).extract(box).png().toBuffer();
  await emit("chhatri", trimmed, [["", 720], ["-sm", 420]], { quality: 80 });
}

/* ---------------- Floral corner ---------------- */
{
  const f = await raw(src("floral-corner"));
  const box = alphaBox(f, 10);
  const trimmed = await sharp(f.data, { raw: f.info }).extract(box).png().toBuffer();
  await emit("floral-corner", trimmed, [["", 760], ["-sm", 420]], { quality: 82 });
}

console.log(written.join("\n"));
