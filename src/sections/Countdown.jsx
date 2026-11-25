import { useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { useCountdown } from "../hooks/useCountdown.js";
import { formatDate, zonedToDate } from "../utils/time.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { GardenScene } from "../components/Drapery.jsx";
import Particles from "../components/Particles.jsx";

function Unit({ value, label, reduced }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="cd-unit">
      <svg className="cd-unit__frame" viewBox="0 0 100 120" preserveAspectRatio="none" aria-hidden="true">
        <path d="M4 118 V34 C4 18 20 4 50 4 C80 4 96 18 96 34 V118Z" fill="rgba(255,250,240,.82)" stroke="url(#g-gold)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M10 112 V36 C10 22 24 10 50 10 C76 10 90 22 90 36 V112Z" fill="none" stroke="url(#g-gold)" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="cd-unit__value" aria-hidden="true">
        {reduced ? (
          v
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={v}
              initial={{ y: "-60%", opacity: 0, filter: "blur(4px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "60%", opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {v}
            </motion.span>
          </AnimatePresence>
        )}
      </span>
      <span className="cd-unit__label">{label}</span>
    </div>
  );
}

/** Scene 07 — live countdown to the wedding muhurat. */
export default function Countdown() {
  const { config, t, tx, lang, reducedMotion } = useApp();
  const ref = useRef(null);
  useReveal(ref);
  const { wedding } = config;
  const target = useMemo(() => zonedToDate(wedding.date, wedding.time, wedding.timezone), [wedding.date, wedding.time, wedding.timezone]);
  const cd = useCountdown(target);

  return (
    <section ref={ref} id="countdown" className="section countdown" aria-labelledby="countdown-title">
      <GardenScene className="countdown__garden" flowers />
      <div className="countdown__veil" aria-hidden="true" />
      <Particles petals={12} gold={20} />
      <div className="countdown__inner">
        <SectionHeading id="countdown-title" title={t("sections.countdown")} />
        {cd.done ? (
          <p className="countdown__done" data-reveal="scale">
            <PartyPopper size={26} aria-hidden="true" /> {tx(config.countdown.celebrationMessage)}
          </p>
        ) : (
          <>
            <div className="countdown__grid" data-reveal="up" data-stagger role="timer" aria-live="off">
              <Unit value={cd.days} label={t("days")} reduced={reducedMotion} />
              <Unit value={cd.hours} label={t("hours")} reduced={reducedMotion} />
              <Unit value={cd.minutes} label={t("minutes")} reduced={reducedMotion} />
              <Unit value={cd.seconds} label={t("seconds")} reduced={reducedMotion} />
            </div>
            <p className="visually-hidden">
              {cd.days} {t("days")}, {cd.hours} {t("hours")}, {cd.minutes} {t("minutes")}
            </p>
          </>
        )}
        <p className="countdown__date" data-reveal="fade">
          {formatDate(target, lang, wedding.timezone, { weekday: "long" })}
        </p>
      </div>
    </section>
  );
}
