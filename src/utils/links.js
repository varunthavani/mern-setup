/** WhatsApp, maps and sharing helpers. */

export function whatsappUrl(number, text) {
  const digits = String(number || "").replace(/\D/g, "");
  const q = `text=${encodeURIComponent(text)}`;
  return digits ? `https://wa.me/${digits}?${q}` : `https://wa.me/?${q}`;
}

export function mapsSearchUrl(venue) {
  if (venue?.mapsUrl) return venue.mapsUrl;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue?.mapsQuery || "")}`;
}

export function mapsDirectionsUrl(venue) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue?.mapsQuery || "")}`;
}

export function mapsEmbedUrl(venue) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(venue?.mapsQuery || "")}&z=15&output=embed`;
}

export function telUrl(phone) {
  return `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;
}

export function siteUrl(config) {
  return config.share.siteUrl || (typeof window !== "undefined" ? window.location.origin + window.location.pathname : "");
}

/** Native share sheet when available, otherwise WhatsApp / clipboard. */
export async function shareInvitation({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (e) {
      if (e?.name === "AbortError") return "cancelled";
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return "copied";
  } catch {
    window.open(whatsappUrl("", `${text}\n${url}`), "_blank", "noopener");
    return "whatsapp";
  }
}
