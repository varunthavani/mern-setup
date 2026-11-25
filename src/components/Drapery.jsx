import { memo } from "react";

/** Top swag valance with tassels (shared by the curtain scene & welcome). */
export const Valance = memo(function Valance({ className = "" }) {
  return (
    <img
      className={`valance ${className}`}
      src="/assets/curtains/valance.webp"
      srcSet="/assets/curtains/valance-sm.webp 900w, /assets/curtains/valance.webp 1600w"
      sizes="100vw"
      alt=""
      aria-hidden="true"
      decoding="async"
      fetchPriority="high"
    />
  );
});

/** Curtains gathered and tied back at both sides. */
export const SideDrapes = memo(function SideDrapes() {
  return (
    <>
      <img className="drape drape--l" src="/assets/curtains/drape.webp" alt="" aria-hidden="true" decoding="async" />
      <img className="drape drape--r" src="/assets/curtains/drape.webp" alt="" aria-hidden="true" decoding="async" />
    </>
  );
});

/** Layered royal garden (sky + palace, trees + fountain, flowers). */
export const GardenScene = memo(function GardenScene({ className = "", flowers = true, parallax = true, eager = false }) {
  const loading = eager ? "eager" : "lazy";
  return (
    <div className={`garden ${className}`} aria-hidden="true">
      <img
        className="garden__sky"
        src="/assets/backgrounds/garden-sky.webp"
        srcSet="/assets/backgrounds/garden-sky-sm.webp 900w, /assets/backgrounds/garden-sky.webp 1600w"
        sizes="100vw"
        alt=""
        loading={loading}
        decoding="async"
        data-parallax={parallax ? "0.12" : undefined}
      />
      <img
        className="garden__mid"
        src="/assets/backgrounds/garden-mid.webp"
        srcSet="/assets/backgrounds/garden-mid-sm.webp 900w, /assets/backgrounds/garden-mid.webp 1600w"
        sizes="100vw"
        alt=""
        loading={loading}
        decoding="async"
        data-parallax={parallax ? "0.05" : undefined}
      />
      {flowers && (
        <img
          className="garden__flowers"
          src="/assets/decorations/floral-border.webp"
          srcSet="/assets/decorations/floral-border-sm.webp 900w, /assets/decorations/floral-border.webp 1600w"
          sizes="100vw"
          alt=""
          loading={loading}
          decoding="async"
        />
      )}
    </div>
  );
});

/** Rose & blossom cluster for section corners. pos: tl | tr | bl | br */
export const FloralCorner = memo(function FloralCorner({ pos = "tl", className = "" }) {
  return <img className={`floral-corner floral-corner--${pos} ${className}`} src="/assets/decorations/floral-corner.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />;
});
