import { useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { Bell, DivineSymbol, Diya, KalashArt, Lotus, Toran } from "../components/art/Divine.jsx";
import { Divider } from "../components/Ornaments.jsx";
import Particles from "../components/Particles.jsx";

/** Scene 03 — divine blessings with shloka, diyas, bells and toran. */
export default function Blessings() {
  const { config, tx, t } = useApp();
  const ref = useRef(null);
  useReveal(ref);
  const { blessings } = config;

  return (
    <section ref={ref} id="blessings" className="section blessings paper" aria-labelledby="blessings-title">
      <Toran className="blessings__toran" />
      <Bell className="blessings__bell blessings__bell--l" length={90} />
      <Bell className="blessings__bell blessings__bell--r" length={130} delay={0.8} />
      <Particles petals={10} gold={18} palette="marigold" />

      <div className="temple-arch" data-reveal="scale">
        <svg className="temple-arch__frame" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M20 600 V200 C20 120 80 70 140 60 C170 55 190 30 200 8 C210 30 230 55 260 60 C320 70 380 120 380 200 V600" fill="none" stroke="url(#g-gold)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          <path d="M34 600 V206 C34 134 90 88 146 76 C174 70 192 48 200 30 C208 48 226 70 254 76 C310 88 366 134 366 206 V600" fill="none" stroke="url(#g-gold)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        <div className="blessings__symbol" data-reveal="scale" data-delay="0.2">
          <DivineSymbol symbol={blessings.symbol} />
        </div>

        <h2 id="blessings-title" className="visually-hidden">
          {t("sections.blessings")}
        </h2>
        <p className="blessings__invocation gu" lang="gu" data-reveal="mask" data-delay="0.3">
          {blessings.invocation}
        </p>
        <Divider width={160} />
        <div className="blessings__shloka gu" lang="gu" data-reveal="fade" data-stagger>
          {blessings.shloka.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <p className="blessings__meaning" data-reveal="fade" data-delay="0.2">
          {tx(blessings.meaning)}
        </p>
        <p className="blessings__kuldevi" data-reveal="fade" data-delay="0.3">
          {tx(blessings.kuldevi)}
        </p>

        <div className="blessings__altar" aria-hidden="true">
          <Diya className="blessings__diya" size={64} />
          <Lotus className="blessings__lotus" />
          <KalashArt className="blessings__kalash" />
          <Lotus className="blessings__lotus" />
          <Diya className="blessings__diya" size={64} />
        </div>
      </div>
    </section>
  );
}
