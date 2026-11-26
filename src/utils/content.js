/** Derived, read-only views over weddingConfig. */
import { eventRange } from "./time.js";
import translations from "../config/translations.js";

/** Pick a localised value: string | { en, gu }. */
export function pick(value, lang) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return value[lang] ?? value.en ?? value.gu ?? "";
}

export function coupleOrder(config) {
  const { groom, bride, nameOrder } = config.couple;
  return nameOrder === "bride-first" ? [bride, groom] : [groom, bride];
}

/** "Maulik & Radhika" / "મૌલિક અને રાધિકા" — the couple's names in one line. */
export function coupleNames(config, lang) {
  const [a, b] = coupleOrder(config);
  return `${pick(a.name, lang)} ${pick(translations.and, lang)} ${pick(b.name, lang)}`;
}

export function enabledCeremonies(config) {
  const tz = config.wedding.timezone;
  return config.ceremonies
    .filter((c) => c.enabled !== false)
    .map((c) => ({ ...c, ...(c.date ? eventRange(c, tz) : {}), venue: config.venues[c.venueId] || null }));
}

/** Confirmed ceremonies, sorted chronologically. */
export function confirmedCeremonies(config) {
  return enabledCeremonies(config)
    .filter((c) => c.confirmed && c.start)
    .sort((a, b) => a.start - b.start);
}

export function visibleSections(config) {
  const hidden = new Set(config.sections.hidden || []);
  return config.sections.order.filter((id) => !hidden.has(id));
}

/** Calendar payload for a ceremony. */
export function toCalendarEvent(c, config, lang) {
  const venue = config.venues[c.venueId];
  return {
    id: c.id,
    title: `${pick(c.name, lang)} · ${coupleNames(config, lang)}`,
    description: pick(c.description, lang),
    location: venue ? `${pick(venue.name, lang)}, ${pick(venue.address, lang)}` : "",
    date: c.date,
    startTime: c.startTime,
    endTime: c.endTime,
  };
}
