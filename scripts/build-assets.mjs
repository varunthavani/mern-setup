/**
 * Generates every raster/vector asset used by the invitation from original,
 * code-drawn artwork (see scripts/art). Run with:  npm run assets
 *
 * Output goes to public/ so it is served locally — no runtime image CDNs.
 */
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import opentypeModule from "opentype.js";
const opentype = opentypeModule.parse ? opentypeModule : opentypeModule.default;
import config from "../src/config/weddingConfig.js";
import * as art from "./art/scenes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = (...p) => path.join(root, "public", ...p);

async function ensure(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function render(name, { svg, w }, outFile, { width = w, quality = 80, format = "webp", alpha = false } = {}) {
  await ensure(path.dirname(outFile));
  let img = sharp(Buffer.from(svg), { density: 72 * (width / w) > 72 ? 72 * (width / w) : 72 }).resize({ width });
  if (format === "webp") img = img.webp({ quality, alphaQuality: alpha ? 90 : 100, effort: 6, smartSubsample: true });
  if (format === "png") img = img.png({ compressionLevel: 9, palette: false });
  if (format === "jpg") img = img.flatten({ background: "#FBF3E4" }).jpeg({ quality, mozjpeg: true });
  const info = await img.toFile(outFile);
  console.log(`  ✓ ${name.padEnd(22)} → ${path.relative(root, outFile)} (${info.width}×${info.height}, ${(info.size / 1024).toFixed(0)} KB)`);
  return outFile;
}

const tx = (v, lang = "en") => (typeof v === "string" ? v : v?.[lang] ?? v?.en ?? "");

function fontPath(file) {
  return path.join(root, "node_modules", "@fontsource", ...file.split("/"));
}

async function loadFont(file) {
  const buf = await fs.readFile(fontPath(file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

/** Text → centred SVG path data. */
function textPath(font, text, cx, baseline, size, letterSpacing = 0) {
  const glyphs = [...text].map((ch) => font.charToGlyph(ch));
  let width = 0;
  const scale = size / font.unitsPerEm;
  glyphs.forEach((g, i) => {
    width += g.advanceWidth * scale + (i < glyphs.length - 1 ? letterSpacing : 0);
  });
  let x = cx - width / 2;
  let d = "";
  glyphs.forEach((g) => {
    const pd = g.getPath(x, baseline, size).toPathData(2);
    if (pd) d += `<path d="${pd}"/>`;
    x += g.advanceWidth * scale + letterSpacing;
  });
  return d;
}

function placeholderSvg(w, h, label, sub, hue = 0) {
  const tones = [["#EFE3CF", "#E2CDAE"], ["#E6E9DC", "#CBD3BC"], ["#F4E1DE", "#E5C3BF"]][hue % 3];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tones[0]}"/><stop offset="1" stop-color="${tones[1]}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="none" stroke="#B58A45" stroke-width="2" opacity=".7"/>
<rect x="34" y="34" width="${w - 68}" height="${h - 68}" fill="none" stroke="#B58A45" stroke-width="1" opacity=".5"/>
<g transform="translate(${w / 2} ${h / 2 - 40})" fill="none" stroke="#8C6A2E" stroke-width="3" opacity=".75">
<rect x="-46" y="-32" width="92" height="66" rx="8"/><circle r="18"/><rect x="-18" y="-44" width="36" height="12" rx="3"/></g>
<text x="${w / 2}" y="${h / 2 + 46}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#594B3D">${label}</text>
<text x="${w / 2}" y="${h / 2 + 82}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="20" fill="#8C6A2E" font-style="italic">${sub}</text>
</svg>`;
}

async function main() {
  console.log("Generating invitation artwork…");
  const flap = await render("invitation flap", art.invitationFlap(), pub("assets/invitation/flap.webp"), { width: 640, quality: 78 });
  await render("invitation flap (sm)", art.invitationFlap(), pub("assets/invitation/flap-sm.webp"), { width: 400, quality: 74 });
  // mirrored right flap (CSS mirroring would break 3D backface culling)
  for (const [src, out] of [["flap.webp", "flap-r.webp"], ["flap-sm.webp", "flap-r-sm.webp"]]) {
    await sharp(pub("assets/invitation", src)).flop().webp({ quality: 76 }).toFile(pub("assets/invitation", out));
  }
  console.log("  ✓ mirrored right flaps");
  await render("seal", art.seal(), pub("assets/invitation/seal.webp"), { width: 420, quality: 85, alpha: true });

  console.log("Curtains…");
  await render("curtain panel", art.curtainPanel(), pub("assets/curtains/panel.webp"), { width: 560, quality: 74 });
  await render("valance", art.valance(), pub("assets/curtains/valance.webp"), { width: 1600, quality: 80, alpha: true });
  await render("valance (sm)", art.valance(), pub("assets/curtains/valance-sm.webp"), { width: 900, quality: 78, alpha: true });
  await render("corner drape", art.cornerDrape(), pub("assets/curtains/drape.webp"), { width: 360, quality: 78, alpha: true });

  console.log("Backgrounds…");
  await render("garden sky", art.gardenSky(), pub("assets/backgrounds/garden-sky.webp"), { width: 1600, quality: 74 });
  await render("garden sky (sm)", art.gardenSky(), pub("assets/backgrounds/garden-sky-sm.webp"), { width: 900, quality: 72 });
  await render("garden mid", art.gardenMid(), pub("assets/backgrounds/garden-mid.webp"), { width: 1600, quality: 78, alpha: true });
  await render("garden mid (sm)", art.gardenMid(), pub("assets/backgrounds/garden-mid-sm.webp"), { width: 900, quality: 76, alpha: true });
  await render("venue night", art.gardenSky({ night: true }), pub("assets/backgrounds/venue-night.webp"), { width: 1200, quality: 76 });
  await render("paper", art.paper(), pub("assets/backgrounds/paper.webp"), { width: 512, quality: 70 });

  console.log("Decorations…");
  const corner = await render("floral corner", art.floralCorner(), pub("assets/decorations/floral-corner.webp"), { width: 520, quality: 80, alpha: true });
  await render("floral border", art.floralBorder(), pub("assets/decorations/floral-border.webp"), { width: 1600, quality: 78, alpha: true });
  await render("floral border (sm)", art.floralBorder(), pub("assets/decorations/floral-border-sm.webp"), { width: 900, quality: 76, alpha: true });

  console.log("Gallery placeholders…");
  await ensure(pub("assets/gallery"));
  const sizes = [[800, 1000], [800, 600], [800, 1100], [800, 800], [800, 600], [800, 1000]];
  for (let i = 0; i < sizes.length; i++) {
    const [w, h] = sizes[i];
    await fs.writeFile(pub(`assets/gallery/placeholder-${i + 1}.svg`), placeholderSvg(w, h, `Photo ${i + 1}`, "Replace in weddingConfig.js", i));
  }
  for (let i = 1; i <= 4; i++) {
    await fs.writeFile(pub(`assets/gallery/placeholder-story-${i}.svg`), placeholderSvg(800, 1000, `Story photo ${i}`, "Replace in weddingConfig.js", i));
  }
  console.log("  ✓ 10 placeholder SVGs");

  console.log("Share image & icons…");
  const script = await loadFont("great-vibes/files/great-vibes-latin-400-normal.woff");
  const cinzel = await loadFont("cinzel/files/cinzel-latin-400-normal.woff");
  const { groom, bride, nameOrder } = config.couple;
  const first = nameOrder === "bride-first" ? bride : groom;
  const second = nameOrder === "bride-first" ? groom : bride;
  const names = `${tx(first.name)}  &  ${tx(second.name)}`;
  const d = new Date(`${config.wedding.date}T12:00:00Z`);
  const dateStr = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).toUpperCase();
  const mono = `${first.initial}${second.initial}`;

  const b64 = async (file) => `data:image/png;base64,${(await sharp(file).png().toBuffer()).toString("base64")}`;
  const og = art.ogImage({
    namesPath: textPath(script, names, 600, 370, names.length > 20 ? 72 : 86),
    subtitlePath: textPath(cinzel, "WEDDING INVITATION", 600, 450, 26, 6) + textPath(cinzel, dateStr, 600, 500, 22, 4),
    monogramPath: textPath(script, `${first.initial}  ${second.initial}`, 600, 210, 92),
    flapHref: await b64(await render("og flap", art.invitationFlap({ frame: true }), path.join(os.tmpdir(), "og-flap.webp"), { width: 320 })),
    cornerHref: await b64(corner),
  });
  await render("og image", og, pub("og-image.jpg"), { width: 1200, quality: 84, format: "jpg" });

  // favicon: gold medallion + initials as paths
  const favBody = (s) => `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 64 64">
<defs><radialGradient id="f" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#F7E7BE"/><stop offset=".6" stop-color="#C9A766"/><stop offset="1" stop-color="#8C6A2E"/></radialGradient></defs>
<circle cx="32" cy="32" r="31" fill="#414C37"/><circle cx="32" cy="32" r="27" fill="url(#f)"/><circle cx="32" cy="32" r="23" fill="none" stroke="#8C6A2E" stroke-width="1"/>
<g fill="#414C37">${textPath(script, mono, 32, 43, 30)}</g></svg>`;
  await fs.writeFile(pub("favicon.svg"), favBody(64));
  await sharp(Buffer.from(favBody(180).replace('width="180" height="180"', 'width="180" height="180"')), { density: 72 * (180 / 64) })
    .resize(180, 180)
    .png()
    .toFile(pub("apple-touch-icon.png"));
  console.log("  ✓ favicon.svg, apple-touch-icon.png");
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
