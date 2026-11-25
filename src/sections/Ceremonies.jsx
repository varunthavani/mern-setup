import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Shirt } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { enabledCeremonies } from "../utils/content.js";
import { formatDate, formatTime, formatWeekday } from "../utils/time.js";
import SectionHeading from "../components/SectionHeading.jsx";
import CeremonyArt from "../components/art/CeremonyArt.jsx";
import { Divider } from "../components/Ornaments.jsx";

function When({ c, tz, lang, t }) {
  if (!c.confirmed || !c.start) return <p className="chapter__tbd">{t("detailsSoon")}</p>;
  return (
    <ul className="chapter__facts">
      <li>
        <CalendarDays size={16} aria-hidden="true" />
        <span>
          {formatWeekday(c.start, lang, tz)}, {formatDate(c.start, lang, tz)}
        </span>
      </li>
      <li>
        <Clock size={16} aria-hidden="true" />
        <span>
          {formatTime(c.start, lang, tz)}
          {c.endTime ? ` – ${formatTime(c.end, lang, tz)}` : ""}
        </span>
      </li>
    </ul>
  );
}

/** Scene 08 — the ceremonies as illustrated, individually themed chapters. */
export default function Ceremonies() {
  const { config, t, tx, lang } = useApp();
  const ref = useRef(null);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const tz = config.wedding.timezone;
  const list = useMemo(() => enabledCeremonies(config), [config]);
  useReveal(ref);

  const goTo = useCallback((i, smooth = true) => {
    const track = trackRef.current;
    const slide = track?.children[i];
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // track the centred slide
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let dist = Infinity;
        [...track.children].forEach((el, i) => {
          const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - mid);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setIndex(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onKey = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(Math.min(list.length - 1, index + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(Math.max(0, index - 1));
    }
  };

  return (
    <section ref={ref} id="ceremonies" className="section ceremonies paper" aria-labelledby="ceremonies-title">
      <SectionHeading id="ceremonies-title" title={t("sections.ceremonies")} subtitle={t("sections.ceremoniesSub")} />

      {/* Journey map: every ritual at a glance */}
      <ol className="journey" data-reveal="up" data-stagger>
        {list.map((c, i) => (
          <li key={c.id}>
            <button type="button" className={`journey__item theme-${c.theme} ${i === index ? "is-active" : ""}`} onClick={() => goTo(i)} aria-label={tx(c.name)}>
              <span className="journey__icon">
                <CeremonyArt name={c.art} />
              </span>
              <span className="journey__name">{tx(c.name)}</span>
              <span className="journey__date">{c.confirmed && c.start ? formatDate(c.start, lang, tz, { year: undefined, month: "short" }) : "—"}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="carousel" data-reveal="fade">
        <button type="button" className="carousel__nav carousel__nav--prev" onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0} aria-label={t("previous")}>
          <ChevronLeft aria-hidden="true" />
        </button>
        <div ref={trackRef} className="carousel__track" tabIndex={0} onKeyDown={onKey} role="region" aria-roledescription="carousel" aria-label={t("sections.ceremonies")}>
          {list.map((c, i) => (
            <article key={c.id} className={`chapter theme-${c.theme} ${i === index ? "is-current" : ""}`} aria-roledescription="slide" aria-label={t("ceremonyOf", { n: i + 1, total: list.length })}>
              <div className="chapter__window">
                <div className="chapter__pattern" aria-hidden="true" />
                <CeremonyArt name={c.art} className="chapter__art" title={tx(c.name)} />
              </div>
              <div className="chapter__body">
                <p className="chapter__count">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="chapter__title">
                  <span className="gu" lang="gu">
                    {c.name.gu}
                  </span>
                  {lang !== "gu" || c.name.en ? <span className="chapter__title-en">{c.name.en}</span> : null}
                </h3>
                <Divider width={120} />
                <When c={c} tz={tz} lang={lang} t={t} />
                {c.venue && (
                  <p className="chapter__venue">
                    <MapPin size={16} aria-hidden="true" />
                    <span>{tx(c.venue.name)}</span>
                  </p>
                )}
                <p className="chapter__desc">{tx(c.description)}</p>
                {c.dressCode && (
                  <p className="chapter__dress">
                    <Shirt size={15} aria-hidden="true" />
                    <span>
                      {t("dressCode")}: {tx(c.dressCode)}
                    </span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
        <button type="button" className="carousel__nav carousel__nav--next" onClick={() => goTo(Math.min(list.length - 1, index + 1))} disabled={index === list.length - 1} aria-label={t("next")}>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div className="carousel__progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / list.length) * 100}%` }} />
      </div>
      <p className="carousel__count" aria-live="polite">
        {t("ceremonyOf", { n: index + 1, total: list.length })}
      </p>
    </section>
  );
}
