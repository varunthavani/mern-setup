import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarHeart, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { dateParts, formatTime, zonedToDate } from "../utils/time.js";
import { celebrate } from "../utils/confetti.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { FloralCorner } from "../components/Drapery.jsx";

// Heart in a 100 × 90 box (also used as the CSS mask for the reveal layer).
const HEART = "M50 88 C20 66 0 48 0 26 C0 10 12 0 27 0 C38 0 46 6 50 15 C54 6 62 0 73 0 C88 0 100 10 100 26 C100 48 80 66 50 88Z";

function paintCover(ctx, w, h, label) {
  const sx = w / 100;
  const sy = h / 90;
  const heart = new Path2D(HEART);
  ctx.save();
  ctx.scale(sx, sy);
  ctx.clip(heart);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // metallic sage base
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#A4B092");
  g.addColorStop(0.35, "#7E8C6C");
  g.addColorStop(0.55, "#9AA788");
  g.addColorStop(0.8, "#66734F");
  g.addColorStop(1, "#8B9879");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // diagonal sheen
  const s = ctx.createLinearGradient(0, h, w, 0);
  s.addColorStop(0.35, "rgba(255,255,255,0)");
  s.addColorStop(0.5, "rgba(255,250,235,.35)");
  s.addColorStop(0.65, "rgba(255,255,255,0)");
  ctx.fillStyle = s;
  ctx.fillRect(0, 0, w, h);

  // gold glitter
  const n = Math.round((w * h) / 90);
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    ctx.fillStyle = r > 0.7 ? "rgba(243,223,166,.9)" : r > 0.4 ? "rgba(214,184,120,.7)" : "rgba(255,255,255,.35)";
    const size = Math.random() * 1.6 + 0.4;
    ctx.fillRect(Math.random() * w, Math.random() * h, size, size);
  }
  ctx.restore();

  // gold edge
  ctx.save();
  ctx.scale(sx, sy);
  ctx.lineWidth = 1.6 / Math.min(sx, sy);
  const edge = ctx.createLinearGradient(0, 0, 100, 90);
  edge.addColorStop(0, "#8C6A2E");
  edge.addColorStop(0.4, "#F3DFA6");
  edge.addColorStop(0.7, "#B58A45");
  edge.addColorStop(1, "#E9CF8E");
  ctx.strokeStyle = edge;
  ctx.stroke(heart);
  ctx.restore();

  // hint text
  ctx.save();
  ctx.fillStyle = "rgba(255,248,230,.92)";
  ctx.font = `italic ${Math.round(w * 0.065)}px "Cormorant Garamond", serif`;
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(40,50,30,.45)";
  ctx.shadowBlur = 6;
  ctx.fillText(label, w / 2, h * 0.47);
  ctx.restore();
}

function opaqueCount(ctx, w, h) {
  const { data } = ctx.getImageData(0, 0, w, h);
  let c = 0;
  for (let i = 3; i < data.length; i += 4 * 6) if (data[i] > 40) c++;
  return c;
}

/** Scene 06 — scratch the heart to reveal the wedding date. */
export default function ScratchReveal() {
  const { config, t, tx, lang, reducedMotion } = useApp();
  const ref = useRef(null);
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const state = useRef({ drawing: false, last: null, total: 1, moves: 0, width: 0 });
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0);
  useReveal(ref);

  const { wedding, reveal } = config;
  const date = zonedToDate(wedding.date, wedding.time, wedding.timezone);
  const parts = dateParts(date, lang, wedding.timezone);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = box.clientWidth;
    const h = box.clientHeight;
    state.current.width = w;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintCover(ctx, canvas.width, canvas.height, t("scratchHint"));
    state.current.total = Math.max(1, opaqueCount(ctx, canvas.width, canvas.height));
    setProgress(0);
  }, [t]);

  // (re)paint when fonts are ready, on resize, and when language changes
  useEffect(() => {
    if (revealed) return undefined;
    let cancelled = false;
    (document.fonts?.ready || Promise.resolve()).then(() => !cancelled && draw());
    const ro = new ResizeObserver(() => {
      const w = boxRef.current?.clientWidth || 0;
      if (Math.abs(w - state.current.width) > 24) draw();
    });
    if (boxRef.current) ro.observe(boxRef.current);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [draw, revealed]);

  const complete = useCallback(() => {
    if (revealed) return;
    setRevealed(true);
    setProgress(100);
    if (config.animation.confetti && !reducedMotion) {
      const r = boxRef.current?.getBoundingClientRect();
      celebrate(r ? { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight } : undefined);
    }
  }, [revealed, config.animation.confetti, reducedMotion]);

  const scratchAt = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const px = ((x - rect.left) / rect.width) * canvas.width;
    const py = ((y - rect.top) / rect.height) * canvas.height;
    const brush = canvas.width * 0.075;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brush;
    ctx.beginPath();
    const last = state.current.last || { x: px, y: py };
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(px, py, brush / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    state.current.last = { x: px, y: py };
    if (++state.current.moves % 6 === 0) {
      const left = opaqueCount(ctx, canvas.width, canvas.height);
      const pct = Math.round((1 - left / state.current.total) * 100);
      setProgress(pct);
      if (pct >= reveal.revealPercent) complete();
    }
  };

  const onDown = (e) => {
    if (revealed) return;
    state.current.drawing = true;
    state.current.last = null;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };
  const onMove = (e) => {
    if (!state.current.drawing || revealed) return;
    const events = e.nativeEvent.getCoalescedEvents?.() || [e];
    for (const ev of events) scratchAt(ev.clientX, ev.clientY);
  };
  const onUp = () => {
    state.current.drawing = false;
    state.current.last = null;
  };

  return (
    <section ref={ref} id="reveal" className="section reveal paper" aria-labelledby="reveal-title">
      <FloralCorner pos="tl" />
      <FloralCorner pos="br" />
      <SectionHeading id="reveal-title" title={t("sections.reveal")} subtitle={t("sections.revealSub")} />

      <div className={`scratch ${revealed ? "is-revealed" : ""}`} data-reveal="scale">
        <div ref={boxRef} className="scratch__box">
          <div className="scratch__under" aria-hidden={!revealed}>
            <span className="scratch__label">{t("ourWedding")}</span>
            <span className="scratch__day">{parts.day}</span>
            <span className="scratch__month">
              {parts.month} {parts.year}
            </span>
            <span className="scratch__weekday">
              {parts.weekday} · {formatTime(date, lang, wedding.timezone)}
            </span>
          </div>
          <canvas
            ref={canvasRef}
            className="scratch__canvas"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onPointerLeave={onUp}
            aria-hidden="true"
          />
        </div>
        <div className="scratch__meter" aria-hidden="true">
          <span style={{ width: `${Math.min(100, (progress / reveal.revealPercent) * 100)}%` }} />
        </div>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {revealed ? `${t("revealed")}: ${parts.weekday}, ${parts.day} ${parts.month} ${parts.year}` : ""}
      </p>

      {revealed ? (
        <p className="scratch__announce">
          <Sparkles size={18} aria-hidden="true" /> {tx(reveal.announcement)} <Sparkles size={18} aria-hidden="true" />
        </p>
      ) : (
        <button type="button" className="btn btn--ghost" onClick={complete}>
          <CalendarHeart size={18} aria-hidden="true" /> {t("tapToReveal")}
        </button>
      )}
    </section>
  );
}
