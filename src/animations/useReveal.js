import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap.js";
import { useApp } from "../context/AppContext.jsx";

const PRESETS = {
  up: { from: { y: 40, opacity: 0 }, to: { y: 0, opacity: 1 } },
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  scale: { from: { scale: 0.88, opacity: 0 }, to: { scale: 1, opacity: 1 } },
  left: { from: { x: -50, opacity: 0 }, to: { x: 0, opacity: 1 } },
  right: { from: { x: 50, opacity: 0 }, to: { x: 0, opacity: 1 } },
  clip: { from: { clipPath: "inset(0 0 100% 0)", opacity: 1 }, to: { clipPath: "inset(0 0 0% 0)", opacity: 1 } },
  mask: { from: { clipPath: "inset(0 50% 0 50%)", opacity: 0 }, to: { clipPath: "inset(0 0% 0 0%)", opacity: 1 } },
  draw: { from: { scaleX: 0, opacity: 0 }, to: { scaleX: 1, opacity: 1 } },
};

/**
 * Scroll-triggered reveals for every `[data-reveal]` element inside `scope`.
 *   data-reveal="up|fade|scale|left|right|clip|mask|draw"
 *   data-delay="0.2"          optional delay (s)
 *   data-stagger              children of this element reveal in sequence
 * Parallax: `[data-parallax="0.2"]` moves at a fraction of scroll speed.
 */
export function useReveal(scope, deps = []) {
  const { reducedMotion, phase } = useApp();
  const ready = phase === "done";

  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return undefined;
    const ctx = gsap.context(() => {
      const items = root.querySelectorAll("[data-reveal]");
      if (reducedMotion) {
        gsap.set(items, { opacity: 1, clearProps: "transform,clipPath" });
        return;
      }
      items.forEach((el) => {
        const preset = PRESETS[el.dataset.reveal] || PRESETS.up;
        const delay = parseFloat(el.dataset.delay || "0");
        const targets = el.hasAttribute("data-stagger") ? el.children : el;
        gsap.set(targets, preset.from);
        if (!ready) return;
        gsap.to(targets, {
          ...preset.to,
          duration: el.dataset.reveal === "draw" ? 1.4 : 1.1,
          delay,
          ease: "power3.out",
          stagger: el.hasAttribute("data-stagger") ? 0.12 : 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      if (!ready) return;
      root.querySelectorAll("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax);
        gsap.fromTo(
          el,
          { yPercent: -speed * 50 },
          {
            yPercent: speed * 50,
            ease: "none",
            scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, root);
    if (ready) requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ready, ...deps]);
}
