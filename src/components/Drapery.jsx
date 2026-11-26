import { memo } from "react";

/**
 * Royal swag valance with gold tassels. Shared by the curtain reveal and the
 * hero so both render at exactly the same place: when the intro overlay is
 * removed the hand-off is invisible.
 */
export const Valance = memo(function Valance({ className = "" }) {
  // The swags are a seamless repeating strip, so the valance height is set
  // by --valance-h (capped by the viewport height) rather than by its width.
  return (
    <div className={`valance ${className}`} aria-hidden="true">
      <span className="valance__rod" />
      <span className="valance__swags" />
    </div>
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
