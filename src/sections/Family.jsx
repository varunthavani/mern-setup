import { useRef } from "react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import { useInView } from "../hooks/useInView.js";
import Particles from "../components/Particles.jsx";
import ART from "./familyArt.json";

const A = "/assets/family/";

/*
 * Every decorative layer is positioned in "units" (px of the right pillar
 * master, see scripts/build-family-assets.mjs). CSS turns units into pixels
 * with --u, which scales with the viewport, so the pillars, curtains, lamps
 * and flowers always keep their proportions while the text stays readable.
 */
const u = (v) => `calc(${v} * var(--u))`;

/** Layer image with its 1× / 0.5× sources; `w`/`h` are its size in units. */
function Art({ name, w, h, sm = true, eager = false }) {
  const W = Math.round(w);
  const H = Math.round(h);
  return (
    <img
      src={`${A}${name}.webp`}
      srcSet={sm ? `${A}${name}-sm.webp ${Math.round(W / 2)}w, ${A}${name}.webp ${W}w` : undefined}
      sizes={sm ? `(max-width: 700px) ${Math.round(W * 0.2)}px, ${Math.round(W * 0.55)}px` : undefined}
      width={W}
      height={H}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
    />
  );
}

/** Soft flame glows that flicker over the baked-in diya flames. */
function Flames({ list }) {
  return list.map(([x, y, s], i) => (
    <span key={i} className="fam__flame" style={{ left: `${x}%`, top: `${y}%`, "--fs": s, "--fd": `${(i * 0.37 + x / 90).toFixed(2)}s` }} />
  ));
}

/**
 * Absolutely positioned layer. `box` is measured from the side's outer edge
 * (x) and its group's top (y); `origin` is the parent box for nested layers.
 */
function Layer({ side, box, origin, className, children, style }) {
  const edge = side === "l" ? "left" : "right";
  const ox = origin ? origin.x : 0;
  const oy = origin ? origin.y : 0;
  return (
    <div className={`fam-layer ${className}`} style={{ [edge]: u(box.x - ox), top: u(box.y - oy), width: u(box.w), ...style }}>
      {children}
    </div>
  );
}

const LOTUS_W = 470;
const LOTUS_H = (LOTUS_W * ART.lotus.h) / ART.lotus.w;

function LotusDiya({ side, x, baseH }) {
  const f = ART.lotus.flame;
  return (
    <Layer side={side} box={{ x, y: baseH - LOTUS_H - 22, w: LOTUS_W }} className="fam__lotus">
      <Art name="lotus" w={LOTUS_W} h={LOTUS_H} />
      <span className="fam__lotus-glow" />
      <img
        className="fam__lotus-flame"
        src={`${A}lotus-flame.webp`}
        style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%` }}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </Layer>
  );
}

const EXTRA_LAMP = { x: 468, y: -60, w: 118 };
EXTRA_LAMP.h = (EXTRA_LAMP.w * ART.lamp.h) / ART.lamp.w;

/** Left side: pillar, curtain with its diya, an extra diya on a chain, roses & peacock feather. */
function LeftSide() {
  const L = ART.left;
  return (
    <div className="fam-side fam-side--l" aria-hidden="true">
      <div className="fam-side__shaft" style={{ left: u(L.shaft.x), width: u(L.shaft.w), top: u(L.headH - 8), bottom: u(L.baseH - 8) }}>
        <img src={`${A}l-shaft.webp`} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="fam-side__top" style={{ height: u(L.headH) }}>
        <Layer side="l" box={L.curtain} className="fam__curtain fam__curtain--l">
          <Art name="l-curtain" w={L.curtain.w} h={L.curtain.h} />
        </Layer>
        <Layer side="l" box={L.head} className="fam__head">
          <Art name="l-head" w={L.head.w} h={L.head.h} />
        </Layer>
        <Layer side="l" box={L.lamp} className="fam__lamp fam__lamp--a" style={{ "--px": "50%" }}>
          <Art name="l-lamp" w={L.lamp.w} h={L.lamp.h} />
          <Flames list={L.lampFlames} />
        </Layer>
        <Layer side="l" box={EXTRA_LAMP} className="fam__lamp fam__lamp--b fam__lamp--extra" style={{ "--px": "50%" }}>
          <Art name="lamp" w={EXTRA_LAMP.w} h={EXTRA_LAMP.h} />
          <Flames list={ART.lamp.flames} />
        </Layer>
      </div>
      <div className="fam-side__base" style={{ height: u(L.baseH) }}>
        <Layer side="l" box={L.base} className="fam__base">
          <Art name="l-base" w={L.base.w} h={L.base.h} />
        </Layer>
        <Layer side="l" box={L.flowers} className="fam__flowers fam__flowers--l">
          <Art name="l-flowers" w={L.flowers.w} h={L.flowers.h} />
        </Layer>
        <LotusDiya side="l" x={380} baseH={L.baseH} />
      </div>
    </div>
  );
}

/** Right side: pillar, curtain, rose cluster with two hanging diyas, peacock feathers. */
function RightSide() {
  const R = ART.right;
  const top = R.head.y; // the master's beam starts below its top edge
  const shift = (b) => ({ ...b, y: b.y - top });
  return (
    <div className="fam-side fam-side--r" aria-hidden="true">
      <div className="fam-side__shaft" style={{ right: u(R.shaft.x), width: u(R.shaft.w), top: u(R.headH - top - 8), bottom: u(R.baseH - 8) }}>
        <img src={`${A}r-shaft.webp`} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="fam-side__top" style={{ height: u(R.headH - top) }}>
        <Layer side="r" box={shift(R.curtain)} className="fam__curtain fam__curtain--r">
          <Art name="r-curtain" w={R.curtain.w} h={R.curtain.h} />
        </Layer>
        <Layer side="r" box={shift(R.head)} className="fam__head">
          <Art name="r-head" w={R.head.w} h={R.head.h} />
        </Layer>
        <Layer side="r" box={shift(R.flowers)} className="fam__flowers fam__flowers--r">
          <Art name="r-flowers" w={R.flowers.w} h={R.flowers.h} />
          <Layer side="r" box={R.lamp1} origin={R.flowers} className="fam__lamp fam__lamp--c" style={{ "--px": `${R.lamp1Pivot}%` }}>
            <Art name="r-lamp1" w={R.lamp1.w} h={R.lamp1.h} />
            <Flames list={R.lamp1Flames} />
          </Layer>
          <Layer side="r" box={R.lamp2} origin={R.flowers} className="fam__lamp fam__lamp--d" style={{ "--px": `${R.lamp2Pivot}%` }}>
            <Art name="r-lamp2" w={R.lamp2.w} h={R.lamp2.h} />
            <Flames list={R.lamp2Flames} />
          </Layer>
        </Layer>
      </div>
      <div className="fam-side__base" style={{ height: u(R.baseH) }}>
        <Layer side="r" box={R.base} className="fam__base">
          <Art name="r-base" w={R.base.w} h={R.base.h} />
        </Layer>
        <Layer side="r" box={R.peacock} className="fam__peacock">
          <Art name="r-peacock" w={R.peacock.w} h={R.peacock.h} />
        </Layer>
        <LotusDiya side="r" x={225} baseH={R.baseH} />
      </div>
    </div>
  );
}

/** Thin gold rule with a diamond-and-scroll centre, as in the printed kankotri. */
function Rule({ short = false }) {
  return (
    <div className={`fam__rule${short ? " fam__rule--short" : ""}`} data-reveal="draw" aria-hidden="true">
      <svg viewBox="0 0 64 16">
        <path
          d="M2 8c5 0 8-4.4 12-4.4 3 0 4 3.4 1.4 4.4M62 8c-5 0-8-4.4-12-4.4-3 0-4 3.4-1.4 4.4M2 8c5 0 8 4.4 12 4.4 3 0 4-3.4 1.4-4.4M62 8c-5 0-8 4.4-12 4.4-3 0-4-3.4-1.4-4.4"
          fill="none"
          stroke="url(#g-gold)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path d="M32 1.5 38 8l-6 6.5L26 8Z" fill="url(#g-gold)" />
        <path d="M32 5 34.8 8 32 11 29.2 8Z" fill="#fff4d6" opacity="0.7" />
        <circle cx="21" cy="8" r="1.5" fill="url(#g-gold)" />
        <circle cx="43" cy="8" r="1.5" fill="url(#g-gold)" />
      </svg>
    </div>
  );
}

/** Small gold leaf sprig beside the વર / કન્યા પક્ષ labels. */
function Sprig({ flip = false }) {
  return (
    <svg className={`fam__sprig${flip ? " fam__sprig--r" : ""}`} viewBox="0 0 48 20" aria-hidden="true">
      <path d="M46 10H7" stroke="url(#g-gold)" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M38 10c-2.6-4.6-6.6-6.8-11-6.6 2 4.4 5.8 6.6 11 6.6Zm0 0c-2.6 4.6-6.6 6.8-11 6.6 2-4.4 5.8-6.6 11-6.6ZM27 10c-2.2-3.8-5.6-5.6-9.2-5.4 1.6 3.6 4.8 5.4 9.2 5.4Zm0 0c-2.2 3.8-5.6 5.6-9.2 5.4 1.6-3.6 4.8-5.4 9.2-5.4ZM17 10c-1.8-3-4.4-4.4-7.2-4.2 1.2 2.8 3.8 4.2 7.2 4.2Zm0 0c-1.8 3-4.4 4.4-7.2 4.2 1.2-2.8 3.8-4.2 7.2-4.2Z"
        fill="url(#g-gold)"
      />
      <circle cx="5" cy="10" r="2" fill="url(#g-gold)" />
    </svg>
  );
}

/**
 * Scene 05 — "સહર્ષ આમંત્રણ": the families' invitation as a royal kankotri.
 * A golden scalloped arch stands between carved pillars with navy curtains,
 * hanging diyas, roses, peacock feathers and lotus diyas on a marble floor,
 * with a faded palace at the bottom centre. All text is live HTML.
 */
export default function Family() {
  const { config, tx, t } = useApp();
  const ref = useRef(null);
  useReveal(ref);
  const live = useInView(ref, { rootMargin: "80px" });
  const { family } = config;
  const [groom, bride] = family.sides;

  return (
    <section ref={ref} id="family" className={`fam${live ? " is-live" : ""}`} aria-labelledby="family-title">
      {/* ---------- Backdrop ---------- */}
      <div className="fam__bg" aria-hidden="true">
        <div className="fam__rays" />
        <div className="fam__floor" />
      </div>

      <div className="fam__arch" aria-hidden="true">
        <img
          className="fam__crown"
          src={`${A}arch-crown-sm.webp`}
          srcSet={`${A}arch-crown-sm.webp 760w, ${A}arch-crown.webp 1400w`}
          sizes="(max-width: 700px) 84vw, 80vw"
          width="1400"
          height="384"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="fam__legs" />
      </div>

      <div className="fam__palace" aria-hidden="true">
        <img
          src={`${A}palace-sm.webp`}
          srcSet={`${A}palace-sm.webp 480w, ${A}palace.webp 900w`}
          sizes="(max-width: 700px) 48vw, 24vw"
          width="900"
          height="289"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      <LeftSide />
      <RightSide />

      <Particles petals={0} gold={9} className="fam__sparkles fam__sparkles--l" />
      <Particles petals={0} gold={9} className="fam__sparkles fam__sparkles--r" />

      {/* ---------- Invitation text ---------- */}
      <div className="fam__content">
        <div className="fam__swastik" data-reveal="scale">
          <img src={`${A}swastik.webp`} width="160" height="154" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        </div>

        <h2 id="family-title" className="fam__title" data-reveal="up">
          {t("sections.family")}
        </h2>
        <img
          className="fam__flourish"
          data-reveal="draw"
          src="/assets/hero/divider-scroll.webp"
          width="760"
          height="119"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />

        <p className="fam__message" data-reveal="fade" data-delay="0.15">
          {tx(family.message)}
        </p>

        <Rule />

        <div className="fam__sides">
          {[groom, bride].map((side, i) => (
            <div key={side.id} className={`fam__side fam__side--${side.id}`} data-reveal="up" data-stagger data-delay={i ? "0.2" : "0"}>
              <h3 className="fam__label">
                <Sprig />
                <span>{tx(side.title)}</span>
                <Sprig flip />
              </h3>
              <p className="fam__elders">{tx(side.grandparents)}</p>
              <p className="fam__parents">{tx(side.parents)}</p>
              <p className="fam__home">{tx(side.familyName)}</p>
            </div>
          ))}
          <span className="fam__vsep" aria-hidden="true" data-reveal="fade" data-delay="0.3" />
        </div>

        <Rule />

        <div className="fam__blessing" data-reveal="fade">
          <p>{tx(family.eldersBlessing)}</p>
          {family.acknowledgement && <p>{tx(family.acknowledgement)}</p>}
        </div>

        <Rule short />
      </div>
    </section>
  );
}
