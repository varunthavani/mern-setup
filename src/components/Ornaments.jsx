import { memo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { coupleOrder } from "../utils/content.js";

/** Gold filigree divider with a central lotus bud. */
export const Divider = memo(function Divider({ className = "", width = 220 }) {
  return (
    <svg className={`divider ${className}`} width={width} viewBox="0 0 220 24" aria-hidden="true">
      <path d="M4 12 H86" stroke="url(#g-gold)" strokeWidth="1.2" />
      <path d="M134 12 H216" stroke="url(#g-gold)" strokeWidth="1.2" />
      <path d="M86 12 c6 -8 12 -8 16 0 c-4 8 -10 8 -16 0Z M134 12 c-6 -8 -12 -8 -16 0 c4 8 10 8 16 0Z" fill="url(#g-gold)" />
      <path d="M110 2 C116 8 116 16 110 22 C104 16 104 8 110 2Z" fill="url(#g-gold)" />
      <circle cx="4" cy="12" r="2" fill="url(#g-gold)" />
      <circle cx="216" cy="12" r="2" fill="url(#g-gold)" />
    </svg>
  );
});

/** Corner flourish; rotate via className (tl/tr/bl/br). */
export const Corner = memo(function Corner({ pos = "tl", size = 64 }) {
  return (
    <svg className={`corner corner--${pos}`} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <g fill="none" stroke="url(#g-gold)" strokeWidth="1.4">
        <path d="M2 40 V12 Q2 2 12 2 H40" />
        <path d="M8 34 V16 Q8 8 16 8 H34" strokeWidth=".8" />
        <path d="M12 2 C20 14 14 20 2 12" />
        <path d="M40 2 c6 4 10 4 14 0 M2 40 c4 6 4 10 0 14" />
      </g>
      <circle cx="12" cy="12" r="2.6" fill="url(#g-gold)" />
    </svg>
  );
});

/** Ornamental frame with four corners around children. */
export function GoldFrame({ children, className = "", as: Tag = "div", ...rest }) {
  return (
    <Tag className={`gold-frame ${className}`} {...rest}>
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />
      {children}
    </Tag>
  );
}

/** Couple initials inside a laurel wreath. */
export const Monogram = memo(function Monogram({ size = 96, className = "" }) {
  const { config } = useApp();
  const [a, b] = coupleOrder(config);
  return (
    <div className={`monogram ${className}`} style={{ "--size": `${size}px` }} aria-label={`${a.initial} & ${b.initial}`} role="img">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {[-1, 1].map((s) => (
          <g key={s} transform={`translate(50 50) scale(${s} 1)`}>
            <path d="M-6 44 C-34 38 -46 14 -42 -14 C-40 -26 -34 -34 -28 -38" fill="none" stroke="url(#g-gold)" strokeWidth="1.2" />
            {[...Array(7)].map((_, i) => {
              const t = i / 7;
              const x = -6 - Math.sin(t * Math.PI * 0.95) * 38 - t * 2;
              const y = 44 - t * 82;
              return <ellipse key={i} cx={x} cy={y} rx="2.4" ry="6" fill="url(#g-gold)" transform={`rotate(${-30 - t * 70} ${x} ${y})`} />;
            })}
          </g>
        ))}
      </svg>
      <span className="monogram__letters" aria-hidden="true">
        {a.initial}
        <em>&amp;</em>
        {b.initial}
      </span>
    </div>
  );
});
