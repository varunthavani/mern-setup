import { useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { coupleOrder } from "../utils/content.js";
import { formatDate, formatTime, zonedToDate } from "../utils/time.js";
import { Divider, Monogram } from "../components/Ornaments.jsx";
import { FloralCorner } from "../components/Drapery.jsx";
import CoupleArt from "../components/art/CoupleArt.jsx";
import Particles from "../components/Particles.jsx";

/** Scene 04 — bride & groom introduction. */
export default function Couple() {
  const { config, tx, lang } = useApp();
  const ref = useRef(null);
  useReveal(ref);
  const [a, b] = coupleOrder(config);
  const { wedding, couple, intro } = config;
  const date = zonedToDate(wedding.date, wedding.time, wedding.timezone);

  return (
    <section ref={ref} id="couple" className="section couple paper" aria-labelledby="couple-title">
      <FloralCorner pos="tl" />
      <FloralCorner pos="br" />
      <Particles petals={10} gold={12} />

      <div className="couple__head">
        <div data-reveal="scale">
          <Monogram size={92} />
        </div>
        <h2 id="couple-title" className="couple__names" data-reveal="mask">
          <span>{tx(a.name)}</span>
          <em>&amp;</em>
          <span>{tx(b.name)}</span>
        </h2>
        <p className="couple__heading" data-reveal="fade" data-delay="0.2">
          {tx(intro.heading)}
        </p>
      </div>

      <figure className="couple__portrait" data-reveal="clip">
        <div className="couple__arch">
          <div className="couple__zoom" data-parallax="0.08">
            {couple.couplePhoto ? (
              <img src={couple.couplePhoto} alt={`${tx(a.name)} & ${tx(b.name)}`} loading="lazy" decoding="async" />
            ) : (
              <CoupleArt className="couple__art" />
            )}
          </div>
        </div>
        <svg className="couple__arch-frame" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true">
          <path d="M6 398 V150 C6 70 70 6 150 6 C230 6 294 70 294 150 V398Z" fill="none" stroke="url(#g-gold)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
      </figure>

      <p className="couple__message" data-reveal="up">
        {tx(intro.message)}
      </p>

      <div className="couple__people" data-reveal="up" data-stagger>
        {[a, b].map((p, i) => (
          <div className="person" key={i}>
            <p className="person__name">{tx(p.fullName)}</p>
            <p className="person__parents">{tx(p.parentsLine)}</p>
          </div>
        ))}
      </div>

      <div data-reveal="draw">
        <Divider />
      </div>
      <p className="couple__date" data-reveal="fade">
        <span>{formatDate(date, lang, wedding.timezone, { weekday: "long" })}</span>
        <span className="dot" aria-hidden="true">
          ◆
        </span>
        <span>{formatTime(date, lang, wedding.timezone)}</span>
      </p>
    </section>
  );
}
