import { useRef, useState } from "react";
import { RotateCcw, Share2 } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { coupleOrder } from "../utils/content.js";
import { shareInvitation, siteUrl } from "../utils/links.js";
import { formatDate, zonedToDate } from "../utils/time.js";
import { Divider, Monogram } from "../components/Ornaments.jsx";
import { GardenScene } from "../components/Drapery.jsx";
import { Garland, Kalash } from "../components/art/primitives.jsx";
import Particles from "../components/Particles.jsx";

/** Grand mandap: canopy on top, pillars framing the text, kalash at the base. */
function MandapFrame() {
  return (
    <div className="mandap" aria-hidden="true">
      <svg className="mandap__canopy" viewBox="0 0 400 150" preserveAspectRatio="xMidYMin meet">
        <path d="M20 112 Q200 -16 380 112Z" fill="url(#g-maroon)" opacity=".94" />
        <path d="M20 112 Q200 2 380 112" fill="none" stroke="url(#g-gold)" strokeWidth="4" />
        {[...Array(15)].map((_, i) => (
          <path key={i} d={`M${28 + i * 24.5} 112 l7 14 l7 -14`} fill="url(#g-gold)" />
        ))}
        <circle cx="200" cy="32" r="8" fill="url(#g-gold)" />
        <path d="M200 32 V10" stroke="url(#g-gold)" strokeWidth="3" />
        <rect x="14" y="112" width="372" height="10" fill="url(#g-gold)" />
        <Garland x1={40} y1={124} x2={200} y2={124} sag={10} count={14} r={6} />
        <Garland x1={200} y1={124} x2={360} y2={124} sag={10} count={14} r={6} />
      </svg>
      <span className="mandap__pillar mandap__pillar--l" />
      <span className="mandap__pillar mandap__pillar--r" />
      <svg className="mandap__kalash mandap__kalash--l" viewBox="-60 -110 120 150">
        <Kalash />
      </svg>
      <svg className="mandap__kalash mandap__kalash--r" viewBox="-60 -110 120 150">
        <Kalash />
      </svg>
    </div>
  );
}

/** Scene 16 — the cinematic finale: thank you, share & replay. */
export default function Closing() {
  const { config, t, tx, lang, replay } = useApp();
  const ref = useRef(null);
  const [toast, setToast] = useState("");
  useReveal(ref);
  const [a, b] = coupleOrder(config);
  const { wedding, closing, share } = config;
  const date = zonedToDate(wedding.date, wedding.time, wedding.timezone);

  const onShare = async () => {
    const res = await shareInvitation({ title: share.title, text: tx(share.shareText), url: siteUrl(config) });
    if (res === "copied") {
      setToast(t("linkCopied"));
      setTimeout(() => setToast(""), 2500);
    }
  };

  return (
    <section ref={ref} id="closing" className="section closing" aria-labelledby="closing-title">
      <GardenScene className="closing__garden" />
      <div className="closing__veil" aria-hidden="true" />
      <MandapFrame />
      <Particles petals={22} gold={34} />
      <div className="closing__content">
        <div data-reveal="scale">
          <Monogram size={96} />
        </div>
        <p className="closing__message gu-friendly" data-reveal="up">
          {tx(closing.message)}
        </p>
        <h2 id="closing-title" className="closing__thanks" data-reveal="mask">
          {t("sections.closing")}
        </h2>
        <p className="closing__names" data-reveal="fade">
          {tx(a.name)} <em>&amp;</em> {tx(b.name)}
        </p>
        <div data-reveal="draw">
          <Divider width={180} />
        </div>
        <p className="closing__date" data-reveal="fade">
          {formatDate(date, lang, wedding.timezone, { weekday: "long" })}
        </p>
        <p className="closing__family" data-reveal="fade">
          {tx(closing.familyMessage)}
        </p>
        {config.couple.hashtag && (
          <p className="closing__hashtag" data-reveal="fade">
            {config.couple.hashtag}
          </p>
        )}
        <div className="btn-row" data-reveal="up">
          <button type="button" className="btn" onClick={onShare}>
            <Share2 size={16} aria-hidden="true" /> {t("shareInvitation")}
          </button>
          <button type="button" className="btn btn--ghost" onClick={replay}>
            <RotateCcw size={16} aria-hidden="true" /> {t("replay")}
          </button>
        </div>
        <p className="toast" role="status" aria-live="polite">
          {toast}
        </p>
      </div>
    </section>
  );
}
