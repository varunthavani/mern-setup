import { useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { Divider, GoldFrame } from "../components/Ornaments.jsx";
import { FloralCorner } from "../components/Drapery.jsx";
import { Swastik } from "../components/art/primitives.jsx";

/** Scene 05 — traditional family invitation on ivory stationery. */
export default function Family() {
  const { config, tx, t } = useApp();
  const ref = useRef(null);
  useReveal(ref);
  const { family } = config;

  return (
    <section ref={ref} id="family" className="section family" aria-labelledby="family-title">
      <GoldFrame className="stationery" data-reveal="fade">
        <FloralCorner pos="tr" className="stationery__flowers" />
        <FloralCorner pos="bl" className="stationery__flowers" />
        <svg className="family__swastik" viewBox="-20 -20 40 40" aria-hidden="true" data-reveal="scale">
          <Swastik s={1} />
        </svg>
        <h2 id="family-title" className="script-title script-title--sm" data-reveal="mask">
          {t("sections.family")}
        </h2>
        <div data-reveal="draw">
          <Divider width={180} />
        </div>
        <p className="family__message" data-reveal="up">
          {tx(family.message)}
        </p>

        <div className="family__sides">
          {family.sides.map((side) => (
            <div key={side.id} className="family__side" data-reveal="up" data-stagger>
              <h3 className="family__side-title">{tx(side.title)}</h3>
              <p className="family__elders">{tx(side.grandparents)}</p>
              <p className="family__parents">{tx(side.parents)}</p>
              <p className="family__name">{tx(side.familyName)}</p>
            </div>
          ))}
        </div>

        <div data-reveal="draw">
          <Divider width={140} />
        </div>
        <p className="family__blessing" data-reveal="fade">
          {tx(family.eldersBlessing)}
        </p>
        {family.acknowledgement && (
          <p className="family__ack" data-reveal="fade" data-delay="0.15">
            {tx(family.acknowledgement)}
          </p>
        )}
      </GoldFrame>
    </section>
  );
}
