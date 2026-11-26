import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../animations/gsap.js";
import { useApp } from "../context/AppContext.jsx";
import { useInView } from "../hooks/useInView.js";
import Particles from "../components/Particles.jsx";

const B = "/assets/blessings/";
const H = "/assets/hero/";
const PETALS = { src: `${H}petals.webp`, count: 12, cell: 72 };

/** Decorative <img>: never selectable, draggable or clickable. */
function Art({ className, src, w, h, lazy = true, ...rest }) {
  return <img className={className} src={src} width={w} height={h} alt="" decoding="async" loading={lazy ? "lazy" : undefined} draggable="false" {...rest} />;
}

/** Diya with its flame and warm light as separate, independently animated layers. */
function Diya({ side }) {
  return (
    <div className={`altar__diya altar__diya--${side}`}>
      <span className="altar__light" />
      <Art className="altar__flame" src={`${B}flame-${side}.webp`} w="42" h="75" />
      <Art className="altar__diya-img" src={`${B}diya-${side}.webp`} w="180" h="153" />
    </div>
  );
}

/**
 * Divine Blessings — a royal temple sanctum straight after the hero.
 *
 * Layers (z-index inside the isolated section):
 *   1 ivory & light · 2 temple architecture · 3 golden arch · 4 foliage
 *   5 toran, vines & bells · 6 Om & sacred text · 7 kalash, lotus & diyas
 *   8 petals & gold particles · 9 global controls (fixed, outside)
 * Text sits in normal flow inside the arch; every image is decorative,
 * absolutely positioned and ignores the pointer.
 */
export default function Blessings() {
  const { config, tx, t, phase, reducedMotion } = useApp();
  const ref = useRef(null);
  const live = useInView(ref, { rootMargin: "80px" });
  const ready = phase === "done";
  const { blessings } = config;

  /* ---------- Entrance: one timeline, played once when the section arrives ---------- */
  useLayoutEffect(() => {
    if (reducedMotion) return undefined;
    const q = gsap.utils.selector(ref);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      // 0.0 – 0.8  temple & toran
      tl.fromTo(q(".divine__temple"), { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 0)
        .fromTo(q(".divine__pillar"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 0.1)
        .fromTo(q(".toran"), { yPercent: -110 }, { yPercent: 0, duration: 0.9 }, 0)
        .fromTo(q(".divine__vine"), { yPercent: -40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1 }, 0.2)
        // 0.5 – 1.2  bells & arch with a golden sweep
        .fromTo(q(".divine__bell"), { yPercent: -70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: "back.out(1.4)", stagger: 0.12 }, 0.5)
        .fromTo(q(".arch__frame"), { opacity: 0, scale: 0.965 }, { opacity: 1, scale: 1, duration: 1.1 }, 0.5)
        .fromTo(q(".arch__shine"), { xPercent: -120, opacity: 0 }, { xPercent: 120, opacity: 1, duration: 1.4, ease: "power1.inOut" }, 0.7)
        .fromTo(q(".divine__flora img"), { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.3, stagger: 0.1 }, 0.6)
        // 0.8 – 1.8  Om glow & lotus bloom
        .fromTo(q(".om__medallion"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.1, ease: "back.out(1.5)" }, 0.8)
        .fromTo(q(".om__aura"), { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4 }, 0.85)
        .fromTo(q(".om__lotus"), { scaleY: 0.2, scaleX: 0.6, opacity: 0 }, { scaleY: 1, scaleX: 1, opacity: 1, duration: 1, ease: "back.out(1.6)" }, 1.15)
        // 1.2 – 2.8  invocation, dividers, shlok lines, meaning, kuldevi
        .fromTo(q(".divine__invocation"), { clipPath: "inset(0 50% 0 50%)", opacity: 0 }, { clipPath: "inset(0 0% 0 0%)", opacity: 1, duration: 0.9 }, 1.25)
        .fromTo(q(".divine__divider"), { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.8, stagger: 0.75 }, 1.5)
        .fromTo(q(".divine__shloka p"), { y: 14, opacity: 0, filter: "blur(4px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.16, clearProps: "filter" }, 1.65)
        .fromTo(q(".divine__meaning"), { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 2.35)
        .fromTo(q(".divine__kuldevi"), { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.6)" }, 2.55)
        // 2.0 – 3.2  kalash, lotus beds, diyas & flames
        .fromTo(q(".altar__kalash"), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, 2.0)
        .fromTo(q(".altar__bed"), { y: 16, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.12 }, 2.2)
        .fromTo(q(".altar__diya-img"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 2.3)
        .fromTo(q(".altar__flame, .altar__light"), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(2)", stagger: 0.06 }, 2.85);

      // Hidden behind the intro until the site is shown; then plays once.
      if (!ready) return;
      ScrollTrigger.create({ trigger: ref.current, start: "top 72%", once: true, onEnter: () => tl.play() });
    }, ref);
    return () => ctx.revert();
    // Language changes re-render the text but must not replay the entrance.
  }, [ready, reducedMotion]);

  return (
    <section ref={ref} id="blessings" className={`divine${live ? " is-live" : ""}`} aria-labelledby="blessings-title">
      {/* ---------- 1–2 light & temple architecture ---------- */}
      <div className="divine__bg" aria-hidden="true">
        <span className="divine__sun" />
        {/* Faint (12–15%) backdrop: reuse the hero's cached palace, except on
            portrait screens where the hero shows its portrait crop — there the
            1100px copy is ample and avoids a 477 KB download. */}
        <picture>
          <source media="(max-width: 1024px) and (orientation: portrait)" srcSet={`${H}palace-md.webp`} />
          <Art className="divine__temple" src={`${H}palace.webp`} w="1800" h="892" />
        </picture>
        <Art className="divine__pillar divine__pillar--l" src={`${B}temple-pillar-sm.webp`} srcSet={`${B}temple-pillar-sm.webp 203w, ${B}temple-pillar.webp 327w`} sizes="14vw" w="203" h="560" />
        <Art className="divine__pillar divine__pillar--r" src={`${B}temple-pillar-sm.webp`} srcSet={`${B}temple-pillar-sm.webp 203w, ${B}temple-pillar.webp 327w`} sizes="14vw" w="203" h="560" />
        <span className="divine__haze" />
      </div>

      {/* ---------- 4 banana leaves & flowers ---------- */}
      <div className="divine__flora" aria-hidden="true">
        <Art className="divine__banana divine__banana--l" src={`${B}banana-l-sm.webp`} srcSet={`${B}banana-l-sm.webp 380w, ${B}banana-l.webp 720w`} sizes="(max-width: 700px) 34vw, 24vw" w="380" h="437" />
        <Art className="divine__banana divine__banana--r" src={`${B}banana-r-sm.webp`} srcSet={`${B}banana-r-sm.webp 380w, ${B}banana-r.webp 720w`} sizes="(max-width: 700px) 34vw, 24vw" w="380" h="405" />
      </div>

      {/* ---------- 5 toran, mango strands & bells ---------- */}
      <div className="divine__top" aria-hidden="true">
        <Art className="divine__vine divine__vine--l" src={`${B}vine-marigold-sm.webp`} srcSet={`${B}vine-marigold-sm.webp 143w, ${B}vine-marigold.webp 251w`} sizes="10vw" w="143" h="400" />
        <Art className="divine__vine divine__vine--r" src={`${B}vine-sm.webp`} srcSet={`${B}vine-sm.webp 152w, ${B}vine.webp 265w`} sizes="10vw" w="152" h="400" />
        <div className="toran">
          <Art className="toran__end" src={`${B}toran-end-l.webp`} w="119" h="110" lazy={false} />
          <span className="toran__run" />
          <Art className="toran__end" src={`${B}toran-end-r.webp`} w="94" h="110" lazy={false} />
        </div>
        {["l", "r"].map((s) => (
          <div key={s} className={`divine__bell divine__bell--${s}`}>
            <Art src={`${B}bell-sm.webp`} srcSet={`${B}bell-sm.webp 148w, ${B}bell.webp 257w`} sizes="8vw" w="148" h="300" />
          </div>
        ))}
      </div>

      {/* ---------- 3, 6, 7 the sanctum ---------- */}
      <div className="divine__stage">
        <div className="arch">
          <div className="arch__frame" aria-hidden="true">
            <span className="arch__panel" />
            <Art className="arch__crown" src={`${B}arch-crown-sm.webp`} srcSet={`${B}arch-crown-sm.webp 640w, ${B}arch-crown.webp 1100w`} sizes="(max-width: 700px) 94vw, 760px" w="640" h="366" lazy={false} />
            <span className="arch__shaft" />
            <span className="arch__shine" />
          </div>

          <div className="arch__content">
            <div className="om" aria-hidden="true">
              <span className="om__aura" />
              <span className="om__rays" />
              <Art className="om__medallion" src={`${B}om-sm.webp`} srcSet={`${B}om-sm.webp 300w, ${B}om.webp 520w`} sizes="180px" w="300" h="288" lazy={false} />
              <Art className="om__lotus" src={`${B}lotus.webp`} w="192" h="123" lazy={false} />
            </div>

            <h2 id="blessings-title" className="visually-hidden">
              {t("sections.blessings")}
            </h2>
            <p className="divine__invocation gu" lang="gu">
              {blessings.invocation}
            </p>
            <span className="divine__divider" aria-hidden="true" />
            <div className="divine__shloka gu" lang="gu">
              {blessings.shloka.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <span className="divine__divider" aria-hidden="true" />
            <p className="divine__meaning">{tx(blessings.meaning)}</p>
            <p className="divine__kuldevi">
              <span className="divine__kuldevi-text">{tx(blessings.kuldevi)}</span>
            </p>
          </div>

          <div className="altar" aria-hidden="true">
            <span className="altar__floor" />
            <Diya side="l" />
            <Art className="altar__bed altar__bed--l" src={`${B}bed-l.webp`} w="401" h="199" />
            <Art className="altar__bed altar__bed--r" src={`${B}bed-r.webp`} w="400" h="197" />
            <div className="altar__kalash">
              <span className="altar__kalash-glow" />
              <Art src={`${B}kalash.webp`} w="266" h="340" />
            </div>
            <Diya side="r" />
          </div>
        </div>
      </div>

      {/* ---------- 8 petals & gold dust ---------- */}
      <Particles petals={9} gold={14} sprite={PETALS} className="divine__particles" />

      <span className="divine__border" aria-hidden="true" />
    </section>
  );
}
