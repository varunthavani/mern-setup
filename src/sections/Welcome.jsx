import { useLayoutEffect, useRef } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { gsap } from "../animations/gsap.js";
import { useApp } from "../context/AppContext.jsx";
import { useInView } from "../hooks/useInView.js";
import { coupleOrder } from "../utils/content.js";
import { formatDate, zonedToDate } from "../utils/time.js";
import { Valance } from "../components/Drapery.jsx";
import { Monogram } from "../components/Ornaments.jsx";
import SplitText from "../components/SplitText.jsx";
import Particles from "../components/Particles.jsx";

const A = "/assets/hero/";
const PETALS = { src: `${A}petals.webp`, count: 12, cell: 72 };

/**
 * Hero — a royal Gujarati palace courtyard revealed by velvet curtains.
 *
 * Layers (back → front):
 *   1 sky & ambient light · 2 palace · 3 garden, pedestals & lanterns
 *   4 fountain (in normal flow, always below the date) · 5 foreground flowers
 *   6 curtains, valance & hanging lanterns · 7 invitation text
 *   8 petals & gold particles · 9 scroll cue (controls are global, fixed)
 */
export default function Welcome() {
  const { config, tx, t, lang, phase, reducedMotion } = useApp();
  const ref = useRef(null);
  // Sway, flicker, water and shimmer loops pause once the hero scrolls away.
  const live = useInView(ref, { rootMargin: "80px" });
  const [a, b] = coupleOrder(config);
  const { wedding } = config;
  const date = zonedToDate(wedding.date, wedding.time, wedding.timezone);
  const ready = phase === "done";
  const revealing = phase === "curtain" || ready;

  /* ---------- Entrance: palace reveal, drapes, monogram, names ---------- */
  useLayoutEffect(() => {
    if (!revealing) return undefined;
    const q = gsap.utils.selector(ref);
    const ctx = gsap.context(() => {
      if (reducedMotion) return;
      // Behind the parting curtains the stage settles slowly; on a repeat
      // visit (no curtains) the same reveal simply runs a little quicker.
      const withCurtains = phase === "curtain";
      const tl = gsap.timeline({ delay: withCurtains ? 0.35 : 0.05, defaults: { ease: "power3.out" } });
      tl.fromTo(q(".hero__scene"), { scale: 1.07 }, { scale: 1, duration: withCurtains ? 3.4 : 2.4, ease: "power2.out" }, 0)
        .fromTo(q(".hero__sun"), { opacity: 0 }, { opacity: 1, duration: 2.4 }, 0)
        .fromTo(q(".hero__curtain--l"), { xPercent: -45, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 2.2 }, withCurtains ? 0.6 : 0)
        .fromTo(q(".hero__curtain--r"), { xPercent: 45, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 2.2 }, "<")
        .fromTo(q(".hero__hang"), { yPercent: -60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.8, stagger: 0.15 }, "<0.3")
        .fromTo(q(".hero__chandelier"), { yPercent: -45, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.8 }, "<0.1")
        .fromTo(q(".hero__front img"), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.6, stagger: 0.08 }, 0.3)
        .fromTo(q(".fountain"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.6 }, 0.5)
        .fromTo(q("[data-in='eyebrow']"), { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, withCurtains ? 1.1 : 0.4)
        .fromTo(
          q(".hero__mono"),
          { scale: 0.5, rotate: -25, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 1.3, ease: "back.out(1.6)" },
          "<0.15"
        )
        .fromTo(q(".hero__mono-glow"), { scale: 0.4, opacity: 0 }, { scale: 1.35, opacity: 0.9, duration: 0.8, yoyo: true, repeat: 1 }, "<0.2")
        .fromTo(
          q(".hero__name .char"),
          { y: 34, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, stagger: 0.06, clearProps: "filter" },
          "<0.35"
        )
        .fromTo(q(".hero__amp"), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "back.out(2)" }, "<0.3")
        .fromTo(q("[data-in='rest']"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.14 }, "-=0.6");
    }, ref);
    return () => ctx.revert();
    // Language changes re-render the text but must not replay the reveal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealing, reducedMotion]);

  /* ---------- Depth: scroll + pointer parallax, transform only ---------- */
  useLayoutEffect(() => {
    if (!ready || reducedMotion) return undefined;
    const q = gsap.utils.selector(ref);
    const ctx = gsap.context(() => {
      const layers = q("[data-depth]");
      layers.forEach((el) => {
        const d = parseFloat(el.dataset.depth);
        gsap.to(el, {
          y: () => d * window.innerHeight * 0.35,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true },
        });
      });
      gsap.to(q(".hero__content"), {
        yPercent: -10,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });

      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const movers = layers.map((el) => ({ d: parseFloat(el.dataset.depth), to: gsap.quickTo(el, "x", { duration: 1.4, ease: "power3.out" }) }));
      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        movers.forEach(({ d, to }) => to(-nx * d * 60));
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }, ref);
    return () => ctx.revert();
  }, [ready, reducedMotion]);

  return (
    <section ref={ref} id="welcome" className={`hero${live ? " is-live" : ""}`} aria-labelledby="welcome-title">
      {/* ---------- Decorative scene (layers 1–3, 5, 6) ---------- */}
      <div className="hero__scene" aria-hidden="true">
        <div className="hero__sky" />
        <div className="hero__sun" />

        <div className="hero__layer hero__palace-wrap" data-depth="0.12">
          {/* The palace and its inner arch share one box, scaled as a unit, so
              the invitation always sits exactly inside the central arch. */}
          <div className="hero__arch">
            <picture>
              <source media="(max-width: 1024px) and (orientation: portrait)" srcSet={`${A}palace-portrait.webp`} width="820" height="895" />
              <img
                className="hero__palace"
                src={`${A}palace.webp`}
                width="1800"
                height="892"
                alt=""
                decoding="async"
                fetchPriority="high"
              />
            </picture>
            <InnerArch />
          </div>
        </div>
        <div className="hero__haze" />

        <div className="hero__layer hero__garden" data-depth="0.2">
          <img className="hero__cypress hero__cypress--l" src={`${A}cypress-2.webp`} width="256" height="720" alt="" decoding="async" />
          <img className="hero__cypress hero__cypress--r" src={`${A}cypress.webp`} width="232" height="720" alt="" decoding="async" />
          {["l", "r"].map((s) => (
            <div key={s} className={`hero__plinth hero__plinth--${s}`}>
              <span className="lantern-glow" />
              <img className="hero__lamp" src={`${A}lantern.webp`} width="170" height="360" alt="" decoding="async" />
              <img className="hero__pedestal" src={`${A}pedestal.webp`} width="235" height="420" alt="" decoding="async" />
            </div>
          ))}
        </div>

        <div className="hero__layer hero__front" data-depth="0.32">
          <img className="hero__plants hero__plants--l" src={`${A}plants-sm.webp`} srcSet={`${A}plants-sm.webp 520w, ${A}plants.webp 900w`} sizes="40vw" width="900" height="490" alt="" decoding="async" />
          <img className="hero__plants hero__plants--r" src={`${A}plants-sm.webp`} srcSet={`${A}plants-sm.webp 520w, ${A}plants.webp 900w`} sizes="40vw" width="900" height="490" alt="" decoding="async" />
          <img className="hero__bouquet hero__bouquet--l" src={`${A}bouquet-2-sm.webp`} srcSet={`${A}bouquet-2-sm.webp 520w, ${A}bouquet-2.webp 900w`} sizes="40vw" width="900" height="460" alt="" decoding="async" />
          <img className="hero__bouquet hero__bouquet--r" src={`${A}bouquet-sm.webp`} srcSet={`${A}bouquet-sm.webp 520w, ${A}bouquet.webp 900w`} sizes="40vw" width="900" height="383" alt="" decoding="async" />
        </div>

        <div className="hero__drapes">
          <img className="hero__curtain hero__curtain--l" src={`${A}curtain-l.webp`} srcSet={`${A}curtain-l-sm.webp 317w, ${A}curtain-l.webp 572w`} sizes="(max-width: 700px) 45vw, 30vw" width="572" height="1300" alt="" decoding="async" fetchPriority="high" />
          <img className="hero__curtain hero__curtain--r" src={`${A}curtain-r.webp`} srcSet={`${A}curtain-r-sm.webp 301w, ${A}curtain-r.webp 543w`} sizes="(max-width: 700px) 45vw, 30vw" width="543" height="1300" alt="" decoding="async" fetchPriority="high" />
          {["l", "r"].map((s) => (
            <div key={s} className={`hero__hang hero__hang--${s}`}>
              <span className="lantern-glow" />
              <img src={`${A}lantern-hanging.webp`} width="192" height="520" alt="" decoding="async" />
            </div>
          ))}
          {/* royal chandelier (jhoomar) hanging from the valance above the arch */}
          <div className="hero__chandelier">
            <span className="hero__chandelier-glow" />
            <img src={`${A}chandelier-sm.webp`} srcSet={`${A}chandelier-sm.webp 260w, ${A}chandelier.webp 520w`} sizes="130px" width="520" height="627" alt="" decoding="async" />
          </div>
          <Valance />
        </div>
      </div>

      {/* ---------- Invitation (layer 7) + fountain (layer 4) ---------- */}
      <div className="hero__content">
        <p className="hero__eyebrow" data-in="eyebrow">
          <span className="hero__eyebrow-text">{tx(config.welcome.eyebrow)}</span>
          <span className="hero__rule" aria-hidden="true" />
        </p>
        <div className="hero__mono">
          <span className="hero__mono-glow" aria-hidden="true" />
          <Monogram size={88} />
        </div>
        <h1 id="welcome-title" className="hero__names">
          <SplitText text={tx(a.name)} className="hero__name" />
          <span className="hero__amp" aria-hidden="true">
            {t("and")}
          </span>
          <span className="visually-hidden"> {t("and")} </span>
          <SplitText text={tx(b.name)} className="hero__name" />
        </h1>
        <img className="hero__flourish" data-in="rest" src={`${A}divider-scroll.webp`} width="760" height="119" alt="" aria-hidden="true" decoding="async" />
        <p className="hero__tagline" data-in="rest">
          {tx(config.welcome.tagline)}
        </p>
        <img className="hero__lotus" data-in="rest" src={`${A}divider-lotus.webp`} width="760" height="130" alt="" aria-hidden="true" decoding="async" />
        <p className="hero__date" data-in="rest">
          <CalendarDays className="hero__date-icon" aria-hidden="true" />
          <time dateTime={wedding.date}>{formatDate(date, lang, wedding.timezone, { weekday: "long" })}</time>
        </p>
      </div>

      <div className="hero__stage" aria-hidden="true">
        <div className="fountain">
          <img className="fountain__img" src={`${A}fountain-sm.webp`} srcSet={`${A}fountain-sm.webp 560w, ${A}fountain.webp 900w`} sizes="(max-width: 700px) 80vw, 460px" width="900" height="678" alt="" decoding="async" />
          <span className="fountain__jet" />
          <span className="fountain__fall fountain__fall--1" />
          <span className="fountain__fall fountain__fall--2" />
          <span className="fountain__fall fountain__fall--3" />
          <span className="fountain__ripple" />
        </div>
      </div>

      {/* ---------- Particles (layer 8) ---------- */}
      <Particles petals={18} gold={30} sprite={PETALS} className="hero__particles" />

      {/* ---------- Scroll cue (layer 9) ---------- */}
      <a href="#blessings" className="hero__cue" aria-label={t("scrollToBegin")}>
        <span>{t("scrollToBegin")}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </a>
      <img className="hero__border" src={`${A}border-lotus-sm.webp`} srcSet={`${A}border-lotus-sm.webp 900w, ${A}border-lotus.webp 1800w`} sizes="min(100vw, 1100px)" width="1800" height="165" alt="" aria-hidden="true" loading="lazy" decoding="async" />
    </section>
  );
}

/*
 * Inner arch: a cream panel with a fine gold double outline that sits just
 * inside the palace's scalloped central opening (it also hides the hanging
 * lantern and the distant palace behind the text). Drawn in the opening's own
 * pixel space (346 × 493 units of the 1800 × 892 palace), so it scales with it.
 */
const ARCH_PATH = "M0 493V134C0 60 90 30 173 0C256 30 346 60 346 134V493Z";

function InnerArch() {
  return (
    <svg className="hero__panel" viewBox="0 0 346 493" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="hero-panel-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffbf2" />
          <stop offset="0.5" stopColor="#fff4e1" />
          <stop offset="1" stopColor="#f7e5c3" />
        </linearGradient>
        <radialGradient id="hero-panel-glow" cx="0.5" cy="0.34" r="0.62">
          <stop offset="0" stopColor="#fffdf7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fffdf7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-panel-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a5762a" />
          <stop offset="0.5" stopColor="#f0d185" />
          <stop offset="1" stopColor="#a5762a" />
        </linearGradient>
        <pattern id="hero-panel-jali" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M13 4 15.4 13 13 22 10.6 13Z M4 13 13 10.6 22 13 13 15.4Z" fill="#c49a48" opacity="0.08" />
        </pattern>
        <linearGradient id="hero-panel-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.9" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="hero-panel-mask" maskContentUnits="userSpaceOnUse">
          <rect width="346" height="493" fill="url(#hero-panel-fade)" />
        </mask>
      </defs>
      <g mask="url(#hero-panel-mask)">
        <path d={ARCH_PATH} fill="url(#hero-panel-fill)" />
        <path d={ARCH_PATH} fill="url(#hero-panel-jali)" />
        <path d={ARCH_PATH} fill="url(#hero-panel-glow)" />
        <path d={ARCH_PATH} fill="none" stroke="url(#hero-panel-gold)" strokeWidth="3.2" />
        <path d={ARCH_PATH} transform="translate(9 13) scale(0.948 0.974)" fill="none" stroke="#c49a48" strokeWidth="1.1" opacity="0.75" />
      </g>
    </svg>
  );
}
