import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Hand, SkipForward } from "lucide-react";
import { gsap } from "../../animations/gsap.js";
import { useApp } from "../../context/AppContext.jsx";
import { coupleOrder } from "../../utils/content.js";
import Particles from "../../components/Particles.jsx";
import { Valance } from "../../components/Drapery.jsx";

/**
 * Scene 01 (closed invitation → 3D flap opening) and
 * Scene 02 (silk curtains parting) rendered as a fixed overlay above the
 * Welcome stage, which is already mounted underneath.
 */
export default function Intro() {
  const { phase, setPhase, t, tx, config, music, reducedMotion, introRun } = useApp();
  const root = useRef(null);
  const tlRef = useRef(null);
  const [a, b] = coupleOrder(config);

  const finish = useCallback(() => setPhase("done"), [setPhase]);

  /* ---------- Scene 01: open the card ---------- */
  const open = useCallback(() => {
    if (phase !== "cover") return;
    music.start();
    setPhase("opening");
  }, [phase, music, setPhase]);

  useLayoutEffect(() => {
    if (phase !== "opening") return undefined;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.to(q(".cover"), { opacity: 0, duration: 0.5, onComplete: () => setPhase("curtain") });
        return;
      }
      const tl = gsap.timeline({ onComplete: () => setPhase("curtain") });
      tl.to(q(".cover__hint, .cover__skip"), { opacity: 0, duration: 0.3 })
        .to(q(".seal, .seal__half"), { scale: 1.1, duration: 0.45, ease: "back.out(2)" }, 0)
        .to(q(".seal__glow"), { opacity: 1, scale: 1.6, duration: 0.6, ease: "power2.out" }, 0.1)
        .to(q(".seal__letters"), { opacity: 0, y: -14, scale: 1.2, filter: "blur(4px)", duration: 0.6 }, 0.3)
        .to(q(".seal__half--l"), { x: -10, rotate: -6, duration: 0.5, ease: "power2.out" }, 0.45)
        .to(q(".seal__half--r"), { x: 10, rotate: 6, duration: 0.5, ease: "power2.out" }, 0.45)
        .to(q(".cover__light"), { opacity: 1, scaleX: 1, duration: 0.8, ease: "power2.out" }, 0.55)
        .to(q(".flap--l"), { rotateY: -112, duration: 2.1, ease: "power3.inOut" }, 0.6)
        .to(q(".flap--r"), { rotateY: 112, duration: 2.1, ease: "power3.inOut" }, 0.6)
        .to(q(".cover__card"), { scale: 1.06, duration: 2.4, ease: "power2.inOut" }, 0.6)
        .to(q(".cover__backdrop, .cover__particles"), { opacity: 0, duration: 1.4, ease: "power1.inOut" }, 0.9)
        .to(q(".cover__light"), { opacity: 0, duration: 0.8 }, 2.1)
        .to(q(".cover"), { opacity: 0, duration: 0.7, ease: "power1.out" }, 2.25);
      tlRef.current = tl;
    }, root);
    return () => ctx.revert();
  }, [phase, reducedMotion, setPhase]);

  /* ---------- Scene 02: part the curtains ---------- */
  useLayoutEffect(() => {
    if (phase !== "curtain") return undefined;
    const q = gsap.utils.selector(root);
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.to(q(".curtains"), { opacity: 0, duration: 0.6, onComplete: finish });
        return;
      }
      // The velvet panels gather towards the sides and are drawn off-stage
      // while the hero's tied-back drapes slide into place behind them.
      const tl = gsap.timeline({ onComplete: finish, delay: 0.25 });
      tl.to(q(".curtains__glow"), { opacity: 0.9, duration: 0.6 })
        .to(q(".curtain--l"), { scaleX: 0.55, xPercent: -95, duration: 2.8, ease: "power3.inOut" }, 0.2)
        .to(q(".curtain--r"), { scaleX: 0.55, xPercent: 95, duration: 2.8, ease: "power3.inOut" }, 0.2)
        .to(q(".curtains__glow"), { opacity: 0, duration: 1.4 }, 1.4)
        .to(q(".curtain"), { opacity: 0, duration: 0.6, ease: "power1.in" }, 2.4);
      tlRef.current = tl;
    }, root);
    return () => ctx.revert();
  }, [phase, reducedMotion, finish]);

  // Keyboard: Enter/Space opens, Escape skips.
  useEffect(() => {
    if (phase === "done") return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && config.animation.allowSkipIntro) finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish, config.animation.allowSkipIntro]);

  const skip = (e) => {
    e.stopPropagation();
    tlRef.current?.kill();
    if (phase === "cover") music.start();
    finish();
  };

  if (phase === "done") return null;

  return (
    <div ref={root} className="intro" key={introRun} data-phase={phase}>
      {/* Scene 02 stage — sits behind the card until the flaps open */}
      <div className="curtains" aria-hidden="true">
        <div className="curtains__glow" />
        <div className="curtain curtain--l">
          <div className="curtain__fabric" />
        </div>
        <div className="curtain curtain--r">
          <div className="curtain__fabric" />
        </div>
        <Valance />
      </div>

      {/* Scene 01 — closed invitation */}
      {(phase === "cover" || phase === "opening") && (
        <div className="cover">
          <div className="cover__backdrop" aria-hidden="true" />
          <Particles petals={0} gold={36} className="cover__particles" />
          <button type="button" className="cover__card" onClick={open} aria-label={`${t("openInvitation")} — ${tx(a.name)} ${t("and")} ${tx(b.name)}`}>
            <span className="cover__light" aria-hidden="true" />
            <span className="flap flap--l" aria-hidden="true">
              <span className="flap__face" />
              <span className="flap__back" />
              <span className="seal__half seal__half--l">
                <span className="seal__img" />
              </span>
            </span>
            <span className="flap flap--r" aria-hidden="true">
              <span className="flap__face" />
              <span className="flap__back" />
              <span className="seal__half seal__half--r">
                <span className="seal__img" />
              </span>
            </span>
            <span className="seal" aria-hidden="true">
              <span className="seal__glow" />
              <span className="seal__letters">
                {a.initial}
                <em>&amp;</em>
                {b.initial}
              </span>
            </span>
            <span className="cover__hint">
              <Hand size={20} strokeWidth={1.5} aria-hidden="true" />
              <span>{t("tapToOpen")}</span>
            </span>
          </button>
          {config.animation.allowSkipIntro && (
            <button type="button" className="cover__skip" onClick={skip}>
              {t("skipIntro")} <SkipForward size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      {phase === "curtain" && config.animation.allowSkipIntro && (
        <button type="button" className="cover__skip cover__skip--curtain" onClick={skip}>
          {t("skipIntro")} <SkipForward size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
