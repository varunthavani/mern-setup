import { useLayoutEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "../animations/gsap.js";
import { useApp } from "../context/AppContext.jsx";
import { coupleOrder } from "../utils/content.js";
import { formatDate, zonedToDate } from "../utils/time.js";
import { GardenScene, SideDrapes, Valance } from "../components/Drapery.jsx";
import { Divider, Monogram } from "../components/Ornaments.jsx";
import SplitText from "../components/SplitText.jsx";
import Particles from "../components/Particles.jsx";

/** The royal garden stage revealed by the curtains, with the couple's names. */
export default function Welcome() {
  const { config, tx, t, lang, phase, reducedMotion } = useApp();
  const ref = useRef(null);
  const [a, b] = coupleOrder(config);
  const { wedding } = config;
  const date = zonedToDate(wedding.date, wedding.time, wedding.timezone);
  const ready = phase === "done";
  const curtainOpen = phase === "curtain" || ready;

  useLayoutEffect(() => {
    const q = gsap.utils.selector(ref);
    const ctx = gsap.context(() => {
      const chars = q(".welcome__name .char");
      const fades = q(".welcome [data-intro]");
      if (reducedMotion) {
        gsap.set([chars, fades], { opacity: 1, clearProps: "transform,filter" });
        return;
      }
      gsap.set(chars, { opacity: 0, y: 30, filter: "blur(8px)" });
      gsap.set(fades, { opacity: 0, y: 16 });
      if (!curtainOpen) return;
      const tl = gsap.timeline({ delay: phase === "curtain" ? 1.6 : 0.1 });
      tl.to(q("[data-intro='eyebrow'], [data-intro='mono']"), { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out" })
        .to(chars, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.06, ease: "power3.out" }, "-=0.4")
        .to(q("[data-intro='rest']"), { opacity: 1, y: 0, duration: 1, stagger: 0.18, ease: "power2.out" }, "-=0.6");
      // layered parallax: sky drifts slower than the garden
      q("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: parseFloat(el.dataset.parallax) * 60,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      // gentle parallax of the content block on scroll
      gsap.to(q(".welcome__content"), {
        yPercent: -12,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curtainOpen, reducedMotion, lang]);

  return (
    <section ref={ref} id="welcome" className="welcome" aria-labelledby="welcome-title">
      <GardenScene eager parallax={ready} />
      <SideDrapes />
      <Valance />
      <Particles petals={16} gold={30} className="welcome__particles" />
      <div className="welcome__content">
        <p className="eyebrow" data-intro="eyebrow">
          {tx(config.welcome.eyebrow)}
        </p>
        <div data-intro="mono">
          <Monogram size={78} />
        </div>
        <h1 id="welcome-title" className="welcome__names">
          <SplitText text={tx(a.name)} className="welcome__name" />
          <span className="welcome__amp" data-intro="rest">
            &amp;
          </span>
          <SplitText text={tx(b.name)} className="welcome__name" />
        </h1>
        <p className="welcome__tagline" data-intro="rest">
          {tx(config.welcome.tagline)}
        </p>
        <div data-intro="rest">
          <Divider width={180} />
        </div>
        <p className="welcome__date" data-intro="rest">
          {formatDate(date, lang, wedding.timezone, { weekday: "long" })}
        </p>
      </div>
      <a href="#blessings" className="scroll-cue" data-intro="rest" aria-label={t("scrollToBegin")}>
        <span>{t("scrollToBegin")}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </a>
    </section>
  );
}
