/**
 * Composes an original, royalty-free instrumental ("Mangal Dhun") in the
 * spirit of Raag Yaman: santoor (Karplus–Strong strings), tanpura drone and
 * a soft reverb. Writes a 16-bit stereo WAV.
 *
 *   node scripts/generate-music.mjs out.wav
 *
 * Encode to MP3 with any encoder, e.g.
 *   ffmpeg -i out.wav -b:a 96k public/assets/music/mangal-dhun.mp3
 */
import fs from "node:fs";

const SR = 44100;
const DURATION = 104; // seconds
const N = SR * DURATION;
const L = new Float32Array(N);
const R = new Float32Array(N);

let seed = 20270224;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

const SA = 293.66; // D4
const semis = { S: 0, R: 2, G: 4, M: 6, P: 7, D: 9, N: 11 };
function freq(note) {
  // e.g. "S", "N.", "S'", "R'"  ('.' = lower octave, "'" = upper)
  const base = semis[note[0]];
  let oct = 0;
  if (note.includes("'")) oct = 1;
  if (note.includes(".")) oct = -1;
  return SA * Math.pow(2, base / 12 + oct);
}

/* ---------------- santoor: Karplus–Strong, two detuned strings -------- */
function santoor(t, f, vel = 0.5, pan = 0, decay = 0.9975) {
  const start = Math.floor(t * SR);
  const len = Math.min(N - start, SR * 5);
  for (const detune of [1, 1.0018]) {
    const p = Math.max(2, Math.round(SR / (f * detune)));
    const buf = new Float32Array(p);
    // hammer: short bright noise burst, slightly low-passed
    let prev = 0;
    for (let i = 0; i < p; i++) {
      const n = rand() * 2 - 1;
      prev = prev * 0.35 + n * 0.65;
      buf[i] = prev;
    }
    let idx = 0;
    const gl = vel * 0.5 * (1 - pan) * 0.5;
    const gr = vel * 0.5 * (1 + pan) * 0.5;
    for (let i = 0; i < len; i++) {
      const next = (idx + 1) % p;
      const v = buf[idx];
      buf[idx] = decay * 0.5 * (buf[idx] + buf[next]);
      idx = next;
      const env = i < 40 ? i / 40 : 1;
      L[start + i] += v * gl * env;
      R[start + i] += v * gr * env;
    }
  }
}

/* ---------------- tanpura: additive with jawari-like shimmer ----------- */
function tanpura(t, f, amp = 0.09, pan = 0) {
  const start = Math.floor(t * SR);
  const len = Math.min(N - start, SR * 6);
  const H = 18;
  const phases = Array.from({ length: H }, () => rand() * Math.PI * 2);
  for (let i = 0; i < len; i++) {
    const tt = i / SR;
    const env = Math.min(1, tt / 0.04) * Math.exp(-tt / 3.2);
    let s = 0;
    for (let k = 1; k <= H; k++) {
      // higher harmonics bloom slightly later (jawari)
      const bloom = 0.35 + 0.65 * Math.min(1, tt / (0.3 + k * 0.05));
      s += (Math.sin(2 * Math.PI * f * k * tt * (1 + k * 0.00004) + phases[k - 1]) * bloom) / Math.pow(k, 0.9);
    }
    const v = s * env * amp * 0.25;
    L[start + i] += v * (1 - pan) * 0.5;
    R[start + i] += v * (1 + pan) * 0.5;
  }
}

/* ---------------- arrangement --------------------------------------- */
// tanpura cycle: P. S' S' S. — every ~1.15 s
for (let t = 0, i = 0; t < DURATION - 1; t += 1.15, i++) {
  const pat = [SA * 0.75, SA, SA, SA / 2]; // Pa (A3), Sa, Sa, Sa(low)
  tanpura(t, pat[i % 4] / 2, 0.09, i % 2 ? 0.35 : -0.35);
}

const BEAT = 60 / 66; // slow, meditative
let cursor = 2.2;

function phrase(notes, { vel = 0.55, roll = false } = {}) {
  for (const item of notes) {
    const [note, beats = 1] = Array.isArray(item) ? item : [item, 1];
    if (note === "-") {
      cursor += beats * BEAT;
      continue;
    }
    const f = freq(note);
    const pan = (rand() - 0.5) * 0.5;
    santoor(cursor, f, vel * (0.85 + rand() * 0.3), pan);
    // santoor "roll": repeated soft strokes on long notes
    if (roll && beats >= 2) {
      for (let k = 1; k < beats * 4; k++) santoor(cursor + (k * BEAT) / 4, f, vel * 0.32, pan, 0.996);
    }
    cursor += beats * BEAT;
  }
}

// Alaap-like opening
phrase([["N.", 1.5], ["R", 1.5], ["S", 3], "-", ["N.", 1], ["R", 1], ["G", 2], ["R", 1], ["S", 3]], { vel: 0.45 });
phrase(["-", ["N.", 1], ["R", 1], ["G", 1], ["M", 1], ["G", 2], ["R", 1], ["G", 1], ["R", 1], ["S", 3]], { vel: 0.5, roll: true });
// Ascend
phrase(["G", "M", ["D", 2], "N", ["D", 1], ["P", 2], "-", "M", "D", "N", ["S'", 3]], { vel: 0.55, roll: true });
// Gat-like rhythmic passage
for (let rep = 0; rep < 2; rep++) {
  phrase([["N.", 0.5], ["R", 0.5], ["G", 1], ["R", 0.5], ["G", 0.5], ["M", 1], ["P", 1], ["M", 0.5], ["G", 0.5], ["R", 1], ["S", 2]], { vel: 0.5 });
  phrase([["G", 0.5], ["M", 0.5], ["D", 1], ["N", 0.5], ["S'", 0.5], ["N", 1], ["D", 1], ["P", 1], ["M", 0.5], ["G", 0.5], ["R", 1], ["S", 2]], { vel: 0.52 });
}
// Upper register flourish
phrase([["S'", 1], ["R'", 1], ["G'", 2], ["R'", 1], ["S'", 1], ["N", 1], ["D", 1], ["N", 2], ["D", 1], ["P", 2]], { vel: 0.5, roll: true });
// Return home
phrase(["M", "G", ["R", 2], ["G", 1], ["R", 1], ["N.", 1], ["R", 1], ["S", 4]], { vel: 0.45, roll: true });

// gentle glissando (swarmandal-like) flourishes
for (const t0 of [1.0, 48, 100]) {
  const notes = ["S", "R", "G", "M", "P", "D", "N", "S'", "R'", "G'"];
  notes.forEach((n, i) => t0 + i * 0.07 < DURATION - 1 && santoor(t0 + i * 0.07, freq(n) * 2, 0.12, -0.6 + i * 0.12, 0.997));
}

/* ---------------- reverb (Freeverb-style) ---------------------------- */
function reverb(input, offset) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491].map((d) => ({ buf: new Float32Array(d + offset), i: 0, f: 0 }));
  const aps = [556, 441, 341].map((d) => ({ buf: new Float32Array(d + offset), i: 0 }));
  const out = new Float32Array(input.length);
  const fb = 0.84, damp = 0.25;
  for (let n = 0; n < input.length; n++) {
    let s = 0;
    for (const c of combs) {
      const y = c.buf[c.i];
      c.f = y * (1 - damp) + c.f * damp;
      c.buf[c.i] = input[n] * 0.015 + c.f * fb;
      c.i = (c.i + 1) % c.buf.length;
      s += y;
    }
    for (const a of aps) {
      const b = a.buf[a.i];
      a.buf[a.i] = s + b * 0.5;
      s = b - s;
      a.i = (a.i + 1) % a.buf.length;
    }
    out[n] = s;
  }
  return out;
}

const wetL = reverb(L, 0);
const wetR = reverb(R, 23);

/* ---------------- mix, fade, normalise, write ----------------------- */
let peak = 0;
const mixL = new Float32Array(N), mixR = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 2) * Math.min(1, (DURATION - t) / 3);
  mixL[i] = (L[i] * 0.8 + wetL[i] * 0.55) * fade;
  mixR[i] = (R[i] * 0.8 + wetR[i] * 0.55) * fade;
  peak = Math.max(peak, Math.abs(mixL[i]), Math.abs(mixR[i]));
}
const gain = 0.7 / peak;
const out = process.argv[2] || "mangal-dhun.wav";
const data = Buffer.alloc(44 + N * 4);
data.write("RIFF", 0);
data.writeUInt32LE(36 + N * 4, 4);
data.write("WAVEfmt ", 8);
data.writeUInt32LE(16, 16);
data.writeUInt16LE(1, 20);
data.writeUInt16LE(2, 22);
data.writeUInt32LE(SR, 24);
data.writeUInt32LE(SR * 4, 28);
data.writeUInt16LE(4, 32);
data.writeUInt16LE(16, 34);
data.write("data", 36);
data.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(mixL[i] * gain * 32767))), 44 + i * 4);
  data.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(mixR[i] * gain * 32767))), 46 + i * 4);
}
fs.writeFileSync(out, data);
console.log(`Wrote ${out} (${DURATION}s, cursor ended at ${cursor.toFixed(1)}s)`);
