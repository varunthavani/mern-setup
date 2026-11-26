import { useMemo, useRef, useState } from "react";
import { Check, ExternalLink, Minus, Plus } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { coupleOrder, enabledCeremonies } from "../utils/content.js";
import { whatsappUrl } from "../utils/links.js";
import { formatDate, zonedToDate } from "../utils/time.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { GoldFrame } from "../components/Ornaments.jsx";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.7-.3Z" />
  </svg>
);

/** Scene 14 — RSVP prepared as a WhatsApp message (no server involved). */
export default function Rsvp() {
  const { config, t, tx, lang } = useApp();
  const ref = useRef(null);
  useReveal(ref);
  const [a, b] = coupleOrder(config);
  const events = useMemo(() => enabledCeremonies(config).filter((c) => c.confirmed), [config]);
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [answer, setAnswer] = useState("yes");
  const [picked, setPicked] = useState(() => new Set());
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const { rsvp, wedding } = config;
  const max = rsvp.maxGuests || 10;

  const toggle = (id) =>
    setPicked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("nameRequired"));
      return;
    }
    setError("");
    const chosen = events.filter((c) => picked.has(c.id)).map((c) => `• ${tx(c.name)}`);
    const lines = [
      `RSVP — ${tx(a.name)} ${t("and")} ${tx(b.name)}`,
      ``,
      `${t("guestName")}: ${name.trim()}`,
      `${t("attending")} ${t(answer)}`,
      answer !== "no" ? `${t("guestCount")}: ${count}` : null,
      answer !== "no" && chosen.length ? `${t("whichCeremonies")}\n${chosen.join("\n")}` : null,
      msg.trim() ? `\n${msg.trim()}` : null,
    ].filter((x) => x !== null);
    window.open(whatsappUrl(rsvp.whatsappNumber, lines.join("\n")), "_blank", "noopener");
    setSent(true);
  };

  const deadline = rsvp.deadline ? formatDate(zonedToDate(rsvp.deadline, "12:00", wedding.timezone), lang, wedding.timezone) : null;

  return (
    <section ref={ref} id="rsvp" className="section rsvp" aria-labelledby="rsvp-title">
      <SectionHeading id="rsvp-title" title={t("sections.rsvp")} subtitle={t("sections.rsvpSub")} light />
      <GoldFrame as="form" className="rsvp__card" onSubmit={submit} noValidate data-reveal="up">
        {deadline && <p className="rsvp__deadline">{t("rsvpBy", { date: deadline })}</p>}

        <label className="field">
          <span>{t("guestName")}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-invalid={Boolean(error)} aria-describedby={error ? "rsvp-err" : undefined} />
        </label>
        {error && (
          <p id="rsvp-err" className="field__error" role="alert">
            {error}
          </p>
        )}

        <fieldset className="field">
          <legend>{t("attending")}</legend>
          <div className="choices">
            {["yes", "maybe", "no"].map((k) => (
              <label key={k} className={`choice ${answer === k ? "is-checked" : ""}`}>
                <input type="radio" name="attend" value={k} checked={answer === k} onChange={() => setAnswer(k)} />
                <span className="choice__mark" aria-hidden="true">
                  {answer === k && <Check size={14} />}
                </span>
                {t(k)}
              </label>
            ))}
          </div>
        </fieldset>

        {answer !== "no" && (
          <>
            <div className="field">
              <span id="count-label">{t("guestCount")}</span>
              <div className="stepper" role="group" aria-labelledby="count-label">
                <button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} aria-label="−" disabled={count <= 1}>
                  <Minus size={16} aria-hidden="true" />
                </button>
                <output aria-live="polite">{count}</output>
                <button type="button" onClick={() => setCount((c) => Math.min(max, c + 1))} aria-label="+" disabled={count >= max}>
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            {events.length > 0 && (
              <fieldset className="field">
                <legend>{t("whichCeremonies")}</legend>
                <div className="checks">
                  {events.map((c) => (
                    <label key={c.id} className={`check ${picked.has(c.id) ? "is-checked" : ""}`}>
                      <input type="checkbox" checked={picked.has(c.id)} onChange={() => toggle(c.id)} />
                      <span>{tx(c.name)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </>
        )}

        <label className="field">
          <span>{t("optionalMessage")}</span>
          <textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} />
        </label>

        <button type="submit" className="btn btn--wa">
          <WhatsAppIcon /> {t("sendRsvp")}
        </button>
        <p className="note" role="status">
          {sent ? t("rsvpOpened") : t("rsvpHonest")}
        </p>
        {rsvp.externalFormUrl && (
          <a className="link" href={rsvp.externalFormUrl} target="_blank" rel="noopener noreferrer">
            {t("externalForm")} <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </GoldFrame>
    </section>
  );
}

export { WhatsAppIcon };
