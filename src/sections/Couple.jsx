import { useLayoutEffect, useRef } from "react";
import { CalendarDays } from "lucide-react";
import { gsap, ScrollTrigger } from "../animations/gsap.js";
import { useApp } from "../context/AppContext.jsx";
import { useInView } from "../hooks/useInView.js";
import { coupleOrder } from "../utils/content.js";
import { formatDate, formatTime, zonedToDate } from "../utils/time.js";
import { Monogram } from "../components/Ornaments.jsx";
import Particles from "../components/Particles.jsx";

const A = "/assets/couple/";
const PETALS = { src: "/assets/hero/petals.webp", count: 12, cell: 72 };

/** Small gold curl that flanks the bride's & groom's names (mirrored on the right). */
function Swirl({ flip = false }) {
  return (
    <svg className={`cpl__swirl${flip ? " cpl__swirl--r" : ""}`} viewBox="0 0 44 16" aria-hidden="true">
      <path
        d="M2 8 C10 8 14 2 20 3 C26 4 25 12 19 12 C14 12 15 6 19 6 M24 8 C30 8 34 13 42 8"
        fill="none"
        stroke="url(#g-gold)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="42" cy="8" r="1.6" fill="url(#g-gold)" />
    </svg>
  );
}

/** Fine gold rule with a lotus-bud centre (rects, so the gradient always paints). */
function Rule({ className = "" }) {
  return (
    <div className={`cpl__rule ${className}`} data-in="rule" aria-hidden="true">
      <svg viewBox="0 0 200 16">
        <rect x="6" y="7.4" width="76" height="1.2" fill="url(#g-gold)" />
        <rect x="118" y="7.4" width="76" height="1.2" fill="url(#g-gold)" />
        <path d="M86 8c5-6 9-6 12 0-3 6-7 6-12 0Zm28 0c-5-6-9-6-12 0 3 6 7 6 12 0Z" fill="url(#g-gold)" />
        <path d="M100 1.5c4 3.6 4 9.4 0 13-4-3.6-4-9.4 0-13Z" fill="url(#g-gold)" />
        <circle cx="4" cy="8" r="1.8" fill="url(#g-gold)" />
        <circle cx="196" cy="8" r="1.8" fill="url(#g-gold)" />
      </svg>
    </div>
  );
}

/** Rose corner spray; the wrapper floats, the image carries the flip. */
function Flowers({ pos }) {
  return (
    <div className={`cpl__flowers cpl__flowers--${pos}`} aria-hidden="true">
      <img
        src={`${A}floral-corner-sm.webp`}
        srcSet={`${A}floral-corner-sm.webp 420w, ${A}floral-corner.webp 760w`}
        sizes="(max-width: 700px) 42vw, 24vw"
        width="760"
        height="697"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * Choreographed entrance. The card is sized to fit one screen, so per-element
 * "top 88%" triggers would leave the lowest lines (date badge) hidden behind
 * the bottom nav; instead the heading & frame play when the section arrives
 * and the text block follows as soon as its top enters the viewport.
 */
function useEntrance(ref, ready, reducedMotion) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || reducedMotion) return undefined;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      const from = {
        mono: { scale: 0.6, rotate: -20, opacity: 0 },
        names: { clipPath: "inset(0 50% 0 50%)", opacity: 0 },
        sub: { y: 10, opacity: 0 },
        palace: { y: 30, opacity: 0 },
        frame: { scale: 0.92, y: 24, opacity: 0 },
        rule: { scaleX: 0, opacity: 0 },
        text: { y: 22, opacity: 0 },
        people: { y: 22, opacity: 0 },
        date: { y: 18, scale: 0.96, opacity: 0 },
      };
      const el = (k) => q(`[data-in='${k}']`);
      gsap.set(el("people").flatMap((p) => [...p.children]), from.people);
      Object.entries(from).forEach(([k, v]) => k !== "people" && gsap.set(el(k), v));
      if (!ready) return;

      const ease = "power3.out";
      gsap
        .timeline({ defaults: { ease, duration: 1.1 }, scrollTrigger: { trigger: root, start: "top 72%", once: true } })
        .to(el("mono"), { scale: 1, rotate: 0, opacity: 1, duration: 1.2, ease: "back.out(1.6)" }, 0)
        .to(el("names"), { clipPath: "inset(0 0% 0 0%)", opacity: 1, duration: 1.3 }, 0.15)
        .to(el("sub"), { y: 0, opacity: 1 }, 0.45)
        .to(el("frame"), { scale: 1, y: 0, opacity: 1, duration: 1.5, clearProps: "transform" }, 0.3)
        .to(el("palace"), { y: 0, opacity: 1, duration: 1.6, stagger: 0.1 }, 0.55);

      gsap
        .timeline({ delay: 0.7, defaults: { ease, duration: 1 }, scrollTrigger: { trigger: q(".cpl__body")[0], start: "top 96%", once: true } })
        .to(el("rule"), { scaleX: 1, opacity: 1, duration: 1.2, stagger: 0.35 }, 0)
        .to(el("text"), { y: 0, opacity: 1 }, 0.1)
        .to(el("people").flatMap((p) => [...p.children]), { y: 0, opacity: 1, stagger: 0.14 }, 0.35)
        .to(el("date"), { y: 0, scale: 1, opacity: 1 }, 0.6);
    }, root);
    if (ready) requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, [ref, ready, reducedMotion]);
}

/**
 * Scene 04 — bride & groom introduction, styled as a royal invitation card:
 * monogram and names on top, the couple photograph inside a golden scalloped
 * arch (toran, swinging bell, glowing lanterns) flanked by faded palace
 * chhatris, then the invitation message, family lines and a date badge.
 */
export default function Couple() {
  const { config, t, tx, lang, phase, reducedMotion } = useApp();
  const ref = useRef(null);
  useEntrance(ref, phase === "done", reducedMotion);
  const live = useInView(ref, { rootMargin: "80px" });
  const [a, b] = coupleOrder(config);
  const { wedding, couple, intro } = config;
  const date = zonedToDate(wedding.date, wedding.time, wedding.timezone);
  const names = `${tx(a.name)} ${t("and")} ${tx(b.name)}`;

  return (
    <section ref={ref} id="couple" className={`cpl${live ? " is-live" : ""}`} aria-labelledby="couple-title">
      {/* ---------- Background: light, corner flowers ---------- */}
      <div className="cpl__bg" aria-hidden="true">
        <div className="cpl__glow" />
        <Flowers pos="tl" />
        <Flowers pos="br" />
      </div>

      {/* ---------- Monogram, names, subtitle ---------- */}
      <header className="cpl__head">
        <div className="cpl__mono" data-in="mono">
          <Monogram size={84} />
        </div>
        <h2 id="couple-title" className="cpl__names" data-in="names">
          <span>{tx(a.name)}</span>
          <em>{t("and")}</em>
          <span>{tx(b.name)}</span>
        </h2>
        <p className="cpl__sub" data-in="sub">
          <span>{tx(intro.heading)}</span>
        </p>
      </header>

      {/* ---------- Photograph inside the royal frame ---------- */}
      <div className="cpl__stage">
        <div className="cpl__ground" aria-hidden="true" />
        {["l", "r"].map((s) => (
          <div key={s} className={`cpl__palace cpl__palace--${s}`} aria-hidden="true" data-in="palace">
            <img
              src={`${A}chhatri-sm.webp`}
              srcSet={`${A}chhatri-sm.webp 420w, ${A}chhatri.webp 720w`}
              sizes="(max-width: 700px) 34vw, 18vw"
              width="720"
              height="1025"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}

        <figure className="cpl__frame" data-in="frame">
          <span className="cpl__halo" aria-hidden="true" />
          <div className="cpl__photo">
            {couple.couplePhoto && (
              <img
                src={couple.couplePhoto}
                srcSet={couple.couplePhotoSrcSet || undefined}
                sizes="(max-width: 700px) 70vw, 36vw"
                alt={names}
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
          <img
            className="cpl__arch"
            src={`${A}frame-sm.webp`}
            srcSet={`${A}frame-sm.webp 720w, ${A}frame.webp 1200w`}
            sizes="(max-width: 700px) 92vw, 46vw"
            width="1200"
            height="908"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <img className="cpl__bell" src={`${A}bell.webp`} width="56" height="69" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          {["l1", "l2", "r1", "r2"].map((k) => (
            <span key={k} className={`cpl__flame cpl__flame--${k}`} aria-hidden="true" />
          ))}
        </figure>
      </div>

      {/* ---------- Invitation text ---------- */}
      <div className="cpl__body">
        <Rule className="cpl__rule--top" />
        <p className="cpl__message" data-in="text">
          {tx(intro.message)}
        </p>
        <Rule />

        <div className="cpl__people" data-in="people">
          {[a, b].map((p, i) => (
            <div className="cpl__person" key={i}>
              <p className="cpl__person-name">
                <Swirl />
                <span>{tx(p.fullName)}</span>
                <Swirl flip />
              </p>
              <p className="cpl__parents">{tx(p.parentsLine)}</p>
            </div>
          ))}
        </div>

        <div className="cpl__date-wrap" data-in="date">
          <p className="cpl__date">
            <CalendarDays className="cpl__date-icon" aria-hidden="true" />
            <time dateTime={`${wedding.date}T${wedding.time}`}>
              <span>{formatDate(date, lang, wedding.timezone, { weekday: "long" })}</span>
              <span className="cpl__dot" aria-hidden="true" />
              <span>{formatTime(date, lang, wedding.timezone)}</span>
            </time>
          </p>
        </div>
      </div>

      <Particles petals={14} gold={10} sprite={PETALS} className="cpl__particles" />
    </section>
  );
}
