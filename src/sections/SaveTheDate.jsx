import { useMemo, useRef } from "react";
import { CalendarPlus, Download } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { confirmedCeremonies, coupleOrder, enabledCeremonies, toCalendarEvent } from "../utils/content.js";
import { downloadIcs, googleCalendarUrl, outlookCalendarUrl } from "../utils/calendar.js";
import { dateParts, formatTime, timeZoneName, zonedToDate } from "../utils/time.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { FloralCorner } from "../components/Drapery.jsx";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="3" fill="#fff" stroke="#4285F4" strokeWidth="1.6" />
    <rect x="3" y="4" width="18" height="5" rx="2" fill="#4285F4" />
    <text x="12" y="18.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#34A853" fontFamily="Arial, sans-serif">
      31
    </text>
  </svg>
);
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="4" fill="#fff" stroke="#d9d9d9" />
    <text x="12" y="9" textAnchor="middle" fontSize="4.5" fill="#E53935" fontFamily="Arial, sans-serif" fontWeight="700">
      CAL
    </text>
    <text x="12" y="18" textAnchor="middle" fontSize="8" fill="#222" fontFamily="Arial, sans-serif">
      24
    </text>
  </svg>
);
const OutlookIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" fill="#0F6CBD" />
    <circle cx="10" cy="12" r="3.6" fill="none" stroke="#fff" strokeWidth="1.8" />
    <path d="M15 9h4M15 12h4M15 15h4" stroke="#9FD0FF" strokeWidth="1.4" />
  </svg>
);

/** Scene 13 — add the wedding (or every confirmed event) to a calendar. */
export default function SaveTheDate() {
  const { config, t, tx, lang } = useApp();
  const ref = useRef(null);
  useReveal(ref);
  const tz = config.wedding.timezone;
  const [a, b] = coupleOrder(config);

  const main = useMemo(() => {
    const c = enabledCeremonies(config).find((x) => x.id === config.wedding.mainCeremonyId && x.confirmed);
    if (c) return toCalendarEvent(c, config, lang);
    return {
      id: "wedding",
      title: `${tx(a.name)} ${t("and")} ${tx(b.name)} — Wedding`,
      description: tx(config.intro.message),
      location: `${tx(config.venues[config.wedding.mainVenueId]?.name)}, ${tx(config.venues[config.wedding.mainVenueId]?.address)}`,
      date: config.wedding.date,
      startTime: config.wedding.time,
      endTime: config.wedding.endTime,
    };
  }, [config, lang, tx, a, b]);
  const all = useMemo(() => confirmedCeremonies(config).map((c) => toCalendarEvent(c, config, lang)), [config, lang]);

  const start = useMemo(() => zonedToDate(main.date, main.startTime, tz), [main.date, main.startTime, tz]);
  const parts = dateParts(start, lang, tz);
  const slug = `${a.name.en || "wedding"}-${b.name.en || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <section ref={ref} id="saveTheDate" className="section save paper" aria-labelledby="save-title">
      <FloralCorner pos="tl" />
      <FloralCorner pos="br" />
      <SectionHeading id="save-title" title={t("sections.saveTheDate")} />

      {(
        <div className="save__tile" data-reveal="scale">
          <span className="save__month">{parts.month}</span>
          <span className="save__day">{parts.day}</span>
          <span className="save__year">
            {parts.weekday} · {parts.year}
          </span>
          <span className="save__time">{formatTime(start, lang, tz)}</span>
        </div>
      )}

      <p className="save__title" data-reveal="fade">
        {main.title}
      </p>

      <div className="save__buttons" data-reveal="up" data-stagger>
        <a className="cal-btn" href={googleCalendarUrl(main, tz)} target="_blank" rel="noopener noreferrer">
          <GoogleIcon />
          <span>Google</span>
        </a>
        <button type="button" className="cal-btn" onClick={() => downloadIcs([main], tz, `${slug}.ics`, main.title)}>
          <AppleIcon />
          <span>Apple</span>
        </button>
        <a className="cal-btn" href={outlookCalendarUrl(main, tz)} target="_blank" rel="noopener noreferrer">
          <OutlookIcon />
          <span>Outlook</span>
        </a>
        <button type="button" className="cal-btn" onClick={() => downloadIcs([main], tz, `${slug}.ics`, main.title)}>
          <Download size={22} aria-hidden="true" />
          <span>{t("downloadIcs")}</span>
        </button>
      </div>

      {all.length > 1 && (
        <button type="button" className="btn" data-reveal="fade" onClick={() => downloadIcs(all, tz, `${slug}-all-events.ics`, `${tx(a.name)} ${t("and")} ${tx(b.name)}`)}>
          <CalendarPlus size={18} aria-hidden="true" /> {t("allEvents")}
        </button>
      )}
      <p className="note">{t("calendarNote", { tz: timeZoneName(tz, lang) })}</p>
    </section>
  );
}
