import { eventRange } from "./time.js";

const pad = (n) => String(n).padStart(2, "0");

/** 20270224T140000Z */
function utcStamp(d) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function escapeIcs(text = "") {
  return String(text).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/** Fold lines at 75 octets as required by RFC 5545. */
function fold(line) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out = [];
  let chunk = "";
  let size = 0;
  for (const ch of line) {
    const s = new TextEncoder().encode(ch).length;
    if (size + s > (out.length ? 74 : 75)) {
      out.push(chunk);
      chunk = "";
      size = 0;
    }
    chunk += ch;
    size += s;
  }
  out.push(chunk);
  return out.join("\r\n ");
}

/**
 * events: [{ id, title, description, location, date, startTime, endTime }]
 */
export function buildIcs(events, timeZone, calName = "Wedding") {
  const now = utcStamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcs(calName)}`,
    `X-WR-TIMEZONE:${timeZone}`,
  ];
  for (const ev of events) {
    const { start, end } = eventRange(ev, timeZone);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.id}-${start.getTime()}@wedding-invitation`,
      `DTSTAMP:${now}`,
      `DTSTART:${utcStamp(start)}`,
      `DTEND:${utcStamp(end)}`,
      `SUMMARY:${escapeIcs(ev.title)}`,
      `DESCRIPTION:${escapeIcs(ev.description)}`,
      `LOCATION:${escapeIcs(ev.location)}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT3H",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeIcs(ev.title)}`,
      "END:VALARM",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n");
}

export function downloadIcs(events, timeZone, filename = "wedding.ics", calName) {
  const blob = new Blob([buildIcs(events, timeZone, calName)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function googleCalendarUrl(ev, timeZone) {
  const { start, end } = eventRange(ev, timeZone);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${utcStamp(start)}/${utcStamp(end)}`,
    details: ev.description || "",
    location: ev.location || "",
    ctz: timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(ev, timeZone) {
  const { start, end } = eventRange(ev, timeZone);
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ev.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: ev.description || "",
    location: ev.location || "",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}
