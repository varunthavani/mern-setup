import { memo, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useInView } from "../hooks/useInView.js";

const PETAL_COLORS = ["#F3C6C4", "#E8B4B1", "#F7D9D6", "#DDA5A4", "#FBEAE3"];
const MARIGOLD_COLORS = ["#F6B93B", "#F0A42A", "#FBCB55", "#E08A1E"];

/**
 * Lightweight canvas particles: rose petals drifting down and/or golden
 * sparkles twinkling upward. Runs only while visible, pauses in hidden
 * tabs, caps DPR, scales counts with device quality, and renders nothing
 * for reduced-motion users.
 *
 * `sprite` (optional) — { src, count, cell }: a horizontal atlas of real
 * petal images. Petals are drawn from it once it has loaded; until then (or
 * if it fails) the vector petal shape is used.
 */
function Particles({ petals = 14, gold = 24, palette = "rose", sprite, className = "", style }) {
  const { reducedMotion, quality, config } = useApp();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const inView = useInView(wrapRef, { rootMargin: "50px" });
  const k = quality === "lite" ? 0.4 : 1;
  const nPetals = config.animation.petals ? Math.round(petals * k) : 0;
  const nGold = config.animation.goldParticles ? Math.round(gold * k) : 0;
  const spriteSrc = sprite?.src;
  const spriteCount = sprite?.count || 1;
  const spriteCell = sprite?.cell || 72;

  useEffect(() => {
    if (reducedMotion || !inView || (!nPetals && !nGold)) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, quality === "lite" ? 1 : 1.5);
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const colors = palette === "marigold" ? MARIGOLD_COLORS : PETAL_COLORS;
    let atlas = null;
    if (spriteSrc) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        atlas = img;
      };
      img.src = spriteSrc;
    }
    const rand = (a, b) => a + Math.random() * (b - a);
    const mkPetal = (initial) => ({
      x: rand(0, w),
      y: initial ? rand(-h, h) : rand(-60, -20),
      s: rand(6, 13),
      vy: rand(18, 42),
      sway: rand(0.6, 1.6),
      phase: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI * 2),
      vr: rand(-1.2, 1.2),
      c: colors[(Math.random() * colors.length) | 0],
      tile: (Math.random() * spriteCount) | 0,
    });
    const mkGold = () => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.8, 2.2),
      vy: rand(-12, -4),
      phase: rand(0, Math.PI * 2),
      tw: rand(1, 2.6),
    });
    const P = Array.from({ length: nPetals }, () => mkPetal(true));
    const G = Array.from({ length: nGold }, mkGold);

    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const g of G) {
        g.y += g.vy * dt;
        g.phase += g.tw * dt;
        if (g.y < -5) Object.assign(g, mkGold(), { y: h + 5 });
        const a = 0.35 + 0.65 * Math.abs(Math.sin(g.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle = "#F3DFA6";
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
        if (g.r > 1.8) {
          ctx.globalAlpha = a * 0.25;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      for (const p of P) {
        p.phase += dt * p.sway;
        p.y += p.vy * dt;
        p.x += Math.sin(p.phase) * 22 * dt;
        p.rot += p.vr * dt;
        if (p.y > h + 30) Object.assign(p, mkPetal(false));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.phase * 1.3)));
        ctx.globalAlpha = 0.9;
        if (atlas) {
          const d = p.s * 2.4;
          ctx.drawImage(atlas, p.tile * spriteCell, 0, spriteCell, spriteCell, -d / 2, -d / 2, d, d);
          ctx.restore();
          continue;
        }
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.moveTo(0, -p.s);
        ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.7, 0, p.s);
        ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      ctx.clearRect(0, 0, w, h);
    };
  }, [reducedMotion, inView, nPetals, nGold, palette, quality, spriteSrc, spriteCount, spriteCell]);

  if (reducedMotion) return null;
  return (
    <div ref={wrapRef} className={`particles ${className}`} style={style} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default memo(Particles);
