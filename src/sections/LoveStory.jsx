import { useRef } from "react";
import { Heart } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { FloralCorner } from "../components/Drapery.jsx";

/** Scene 10 — milestones of the couple's story (fully configurable / optional). */
export default function LoveStory() {
  const { config, t, tx } = useApp();
  const ref = useRef(null);
  useReveal(ref);
  const milestones = config.story?.milestones || [];
  if (!milestones.length) return null;

  return (
    <section ref={ref} id="story" className="section story paper" aria-labelledby="story-title">
      <FloralCorner pos="tr" />
      <SectionHeading id="story-title" title={t("sections.story")} />
      <ol className="story__list">
        {milestones.map((m, i) => (
          <li key={m.id} className={`story__item ${i % 2 ? "story__item--alt" : ""}`}>
            <figure className="polaroid" data-reveal={i % 2 ? "right" : "left"} style={{ "--tilt": `${i % 2 ? 3 : -3}deg` }}>
              <img src={m.photo} alt={tx(m.title)} loading="lazy" decoding="async" width="800" height="1000" />
            </figure>
            <div className="story__text" data-reveal="up" data-delay="0.15">
              <span className="story__heart" aria-hidden="true">
                <Heart size={14} fill="currentColor" />
              </span>
              <h3>{tx(m.title)}</h3>
              {m.date && <p className="story__date">{tx(m.date)}</p>}
              <p>{tx(m.text)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
