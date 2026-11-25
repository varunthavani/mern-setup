import { useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { Corner } from "../components/Ornaments.jsx";
import { Marigold } from "../components/art/primitives.jsx";

/** Scene 15 — traditional invitee groups (નિમંત્રક, દર્શનાભિલાષી, …). */
export default function Invitees() {
  const { config, t, tx, lang } = useApp();
  const ref = useRef(null);
  useReveal(ref, [lang]);
  if (!config.invitees?.length) return null;

  return (
    <section ref={ref} id="invitees" className="section invitees" aria-labelledby="invitees-title">
      <SectionHeading id="invitees-title" title={t("sections.invitees")} light />
      <div className="invitees__grid">
        {config.invitees.map((g) => (
          <article key={g.id} className="invitee-card" data-reveal="up">
            <Corner pos="tl" size={40} />
            <Corner pos="br" size={40} />
            <svg className="invitee-card__flower" viewBox="-12 -12 24 24" aria-hidden="true">
              <Marigold r={10} />
            </svg>
            <h3 className="invitee-card__title gu" lang="gu">
              {g.title.gu}
            </h3>
            {lang === "en" && g.title.en && <p className="invitee-card__sub">{g.title.en}</p>}
            <ul>
              {g.names.map((n, i) => (
                <li key={i}>{tx(n)}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
