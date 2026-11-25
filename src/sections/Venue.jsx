import { useMemo, useRef, useState } from "react";
import { Car, ExternalLink, Map as MapIcon, MapPin, Navigation, Phone } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { enabledCeremonies } from "../utils/content.js";
import { mapsDirectionsUrl, mapsEmbedUrl, mapsSearchUrl, telUrl } from "../utils/links.js";
import { formatDate, formatTime, zonedToDate } from "../utils/time.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { GoldFrame } from "../components/Ornaments.jsx";

/** Scene 12 — venues, directions, contacts and an on-demand map. */
export default function Venue() {
  const { config, t, tx, lang } = useApp();
  const ref = useRef(null);
  const tz = config.wedding.timezone;
  const ceremonies = useMemo(() => enabledCeremonies(config), [config]);

  // venues actually used by enabled ceremonies, main venue first
  const venueIds = useMemo(() => {
    const ids = [config.wedding.mainVenueId, ...ceremonies.map((c) => c.venueId)].filter((id) => config.venues[id]);
    return [...new Set(ids)];
  }, [config, ceremonies]);
  const [active, setActive] = useState(venueIds[0]);
  const [mapShown, setMapShown] = useState({});
  useReveal(ref, [active]);

  const venue = config.venues[active];
  const hosted = ceremonies.filter((c) => c.venueId === active);
  const isMain = active === config.wedding.mainVenueId;

  return (
    <section ref={ref} id="venue" className="section venue paper" aria-labelledby="venue-title">
      <SectionHeading id="venue-title" title={t("sections.venue")} />

      {venueIds.length > 1 && (
        <div className="chips" role="tablist" aria-label={t("sections.venue")}>
          {venueIds.map((id) => (
            <button key={id} type="button" role="tab" aria-selected={active === id} className={`chip ${active === id ? "is-active" : ""}`} onClick={() => setActive(id)}>
              {tx(config.venues[id].name)}
            </button>
          ))}
        </div>
      )}

      <GoldFrame className="venue__card" key={active} data-reveal="up">
        {venue.photo && (
          <div className="venue__photo">
            <svg className="venue__photo-arch" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 200 V60 C40 60 60 4 150 4 C240 4 260 60 300 60 V200" fill="none" stroke="url(#g-gold)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
            <img src={venue.photo} alt={tx(venue.name)} loading="lazy" decoding="async" width="1200" height="750" />
          </div>
        )}
        <h3 className="venue__name">{tx(venue.name)}</h3>
        <p className="venue__address">
          <MapPin size={16} aria-hidden="true" /> {tx(venue.address)}
        </p>
        {isMain && (
          <p className="venue__when">
            {formatDate(zonedToDate(config.wedding.date, config.wedding.time, tz), lang, tz, { weekday: "long" })} · {formatTime(zonedToDate(config.wedding.date, config.wedding.time, tz), lang, tz)}
          </p>
        )}

        {hosted.length > 0 && (
          <div className="venue__hosted">
            <p className="venue__label">{t("usedFor")}</p>
            <ul>
              {hosted.map((c) => (
                <li key={c.id}>
                  <span>{tx(c.name)}</span>
                  <span className="venue__time">{c.confirmed && c.start ? `${formatDate(c.start, lang, tz, { year: undefined, month: "short" })} · ${formatTime(c.start, lang, tz)}` : t("detailsSoon")}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="btn-row">
          <a className="btn" href={mapsDirectionsUrl(venue)} target="_blank" rel="noopener noreferrer">
            <Navigation size={16} aria-hidden="true" /> {t("directions")}
          </a>
          <a className="btn btn--ghost" href={mapsSearchUrl(venue)} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} aria-hidden="true" /> {t("openInMaps")}
          </a>
        </div>

        {(venue.contact || venue.parking) && (
          <dl className="venue__info">
            {venue.contact && (
              <div>
                <dt>
                  <Phone size={15} aria-hidden="true" /> {t("contact")}
                </dt>
                <dd>
                  {tx(venue.contact.name)} · <a href={telUrl(venue.contact.phone)}>{venue.contact.phone}</a>
                </dd>
              </div>
            )}
            {venue.parking && (
              <div>
                <dt>
                  <Car size={15} aria-hidden="true" /> {t("parking")}
                </dt>
                <dd>{tx(venue.parking)}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="venue__map">
          {mapShown[active] ? (
            <iframe title={`${t("sections.venue")}: ${tx(venue.name)}`} src={mapsEmbedUrl(venue)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          ) : (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setMapShown((s) => ({ ...s, [active]: true }))}>
              <MapIcon size={16} aria-hidden="true" /> {t("showMap")}
            </button>
          )}
        </div>
      </GoldFrame>

      {config.contacts?.length > 0 && (
        <ul className="contacts" data-reveal="up" data-stagger>
          {config.contacts.map((c, i) => (
            <li key={i}>
              <span className="contacts__label">{tx(c.label)}</span>
              <span>{tx(c.name)}</span>
              <a href={telUrl(c.phone)} className="contacts__call">
                <Phone size={14} aria-hidden="true" /> {c.phone}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
