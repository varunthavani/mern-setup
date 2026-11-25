/**
 * Timezone-safe date helpers. Wedding times are configured as local wall-clock
 * times in `wedding.timezone`; guests may be anywhere in the world.
 */

function offsetMs(utcMs, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const p = Object.fromEntries(dtf.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return asUtc - utcMs;
}

/** "2027-02-24" + "19:30" in "Asia/Kolkata" → Date (absolute instant). */
export function zonedToDate(date, time = "00:00", timeZone = "UTC") {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let ts = guess - offsetMs(guess, timeZone);
  // second pass handles DST edges
  ts = guess - offsetMs(ts, timeZone);
  return new Date(ts);
}

/** End time that may roll past midnight (e.g. 20:00 → 00:30). */
export function eventRange(ev, timeZone) {
  const start = zonedToDate(ev.date, ev.startTime || "00:00", timeZone);
  let end = ev.endTime ? zonedToDate(ev.date, ev.endTime, timeZone) : new Date(start.getTime() + 2 * 3600e3);
  if (end <= start) end = new Date(end.getTime() + 24 * 3600e3);
  return { start, end };
}

const locale = (lang) => (lang === "gu" ? "gu-IN" : "en-GB");

export function formatDate(date, lang, timeZone, opts = {}) {
  return new Intl.DateTimeFormat(locale(lang), {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  }).format(date);
}

export function formatWeekday(date, lang, timeZone, style = "long") {
  return new Intl.DateTimeFormat(locale(lang), { timeZone, weekday: style }).format(date);
}

export function formatTime(date, lang, timeZone) {
  return new Intl.DateTimeFormat(lang === "gu" ? "gu-IN" : "en-IN", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/** Friendly timezone label, e.g. "India Standard Time". */
export function timeZoneName(timeZone, lang) {
  try {
    const parts = new Intl.DateTimeFormat(locale(lang), { timeZone, timeZoneName: "long" }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value || timeZone;
  } catch {
    return timeZone;
  }
}

/** Day parts for the scratch card / save-the-date tiles. */
export function dateParts(date, lang, timeZone) {
  const get = (o) => new Intl.DateTimeFormat(locale(lang), { timeZone, ...o }).format(date);
  return {
    day: get({ day: "numeric" }),
    month: get({ month: "long" }),
    monthShort: get({ month: "short" }),
    year: get({ year: "numeric" }),
    weekday: get({ weekday: "long" }),
  };
}

/** Calendar-day key in the wedding timezone (for grouping). */
export function dayKey(date, timeZone) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
