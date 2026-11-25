import { useLayoutEffect, useMemo, useRef } from "react";
import { MapPin, Shirt } from "lucide-react";
import { gsap } from "../animations/gsap.js";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { confirmedCeremonies } from "../utils/content.js";
import { dayKey, formatDate, formatTime, formatWeekday } from "../utils/time.js";
import SectionHeading from "../components/SectionHeading.jsx";
import CeremonyArt from "../components/art/CeremonyArt.jsx";

/** Scene 09 — chronological schedule of confirmed events, grouped by day. */
export default function Timeline() {
  const { config, t, tx, lang, reducedMotion, phase } = useApp();
  const ref = useRef(null);
  const tz = config.wedding.timezone;
  const days = useMemo(() => {
    const groups = new Map();
    for (const c of confirmedCeremonies(config)) {
      const k = dayKey(c.start, tz);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(c);
    }
    return [...groups.values()];
  }, [config, tz]);
  useReveal(ref);

  // the gold spine draws itself as you scroll
  useLayoutEffect(() => {
    if (reducedMotion || phase !== "done") return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".timeline__spine-fill",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline__list", start: "top 70%", end: "bottom 60%", scrub: 0.6 } }
      );
    }, ref);
    return () => ctx.revert();
  }, [reducedMotion, phase]);

  let n = 0;
  return (
    <section ref={ref} id="timeline" className="section timeline" aria-labelledby="timeline-title">
      <SectionHeading id="timeline-title" title={t("sections.timeline")} light />
      <div className="timeline__list">
        <div className="timeline__spine" aria-hidden="true">
          <span className="timeline__spine-fill" />
        </div>
        {days.map((events, d) => (
          <div className="timeline__day" key={d}>
            <h3 className="timeline__day-title" data-reveal="scale">
              <span className="timeline__day-n">{t("day", { n: d + 1 })}</span>
              <span>
                {formatWeekday(events[0].start, lang, tz)}, {formatDate(events[0].start, lang, tz)}
              </span>
            </h3>
            <ol>
              {events.map((c) => {
                const side = n++ % 2 ? "right" : "left";
                return (
                  <li key={c.id} className={`tl-event tl-event--${side} theme-${c.theme}`} data-reveal={side}>
                    <span className="tl-event__dot" aria-hidden="true">
                      <CeremonyArt name={c.art} />
                    </span>
                    <div className="tl-event__card">
                      <p className="tl-event__time">
                        {formatTime(c.start, lang, tz)}
                        {c.endTime ? ` – ${formatTime(c.end, lang, tz)}` : ""}
                      </p>
                      <h4 className="tl-event__name">{tx(c.name)}</h4>
                      {c.venue && (
                        <p className="tl-event__meta">
                          <MapPin size={14} aria-hidden="true" /> {tx(c.venue.name)}
                        </p>
                      )}
                      {c.dressCode && (
                        <p className="tl-event__meta">
                          <Shirt size={14} aria-hidden="true" /> {tx(c.dressCode)}
                        </p>
                      )}
                      <p className="tl-event__desc">{tx(c.description)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}
