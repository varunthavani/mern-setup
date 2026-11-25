import { useRef, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { coupleOrder } from "../utils/content.js";
import { whatsappUrl } from "../utils/links.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { FloralCorner } from "../components/Drapery.jsx";
import { WhatsAppIcon } from "./Rsvp.jsx";

/** Send blessings to the couple through WhatsApp. */
export default function Wishes() {
  const { config, t, tx } = useApp();
  const ref = useRef(null);
  useReveal(ref);
  const [a, b] = coupleOrder(config);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const send = (e) => {
    e.preventDefault();
    const body = `${tx(a.name)} & ${tx(b.name)}\n\n${text.trim() || t("wishPrompt")}${name.trim() ? `\n\n— ${name.trim()}` : ""}`;
    window.open(whatsappUrl(config.wishes.whatsappNumber, body), "_blank", "noopener");
  };

  return (
    <section ref={ref} id="wishes" className="section wishes paper" aria-labelledby="wishes-title">
      <FloralCorner pos="tr" />
      <FloralCorner pos="bl" />
      <SectionHeading id="wishes-title" title={t("sections.wishes")} subtitle={t("wishPrompt")} />
      <form className="wishes__form" onSubmit={send} data-reveal="up">
        <div className="envelope" aria-hidden="true">
          <svg viewBox="0 0 120 80">
            <rect x="4" y="10" width="112" height="66" rx="4" fill="url(#g-ivory)" stroke="url(#g-gold)" strokeWidth="1.5" />
            <path d="M4 14 L60 50 L116 14" fill="none" stroke="url(#g-gold)" strokeWidth="1.5" />
            <path d="M60 28 C52 18 40 26 48 36 L60 46 L72 36 C80 26 68 18 60 28Z" fill="#C9475B" className="envelope__heart" />
          </svg>
        </div>
        <label className="field">
          <span>{t("guestName")}</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="field">
          <span className="visually-hidden">{t("wishPlaceholder")}</span>
          <textarea rows={4} placeholder={t("wishPlaceholder")} value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <button type="submit" className="btn btn--wa">
          <WhatsAppIcon /> {t("sendWishes")}
        </button>
      </form>
    </section>
  );
}
