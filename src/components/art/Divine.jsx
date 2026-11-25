import { memo } from "react";
import { DiyaShape, Kalash, Leaf, LotusShape, Marigold } from "./primitives.jsx";

export const Diya = memo(function Diya({ className = "", size = 70 }) {
  return (
    <svg className={`diya ${className}`} width={size} height={size} viewBox="-35 -50 70 70" aria-hidden="true">
      <DiyaShape />
    </svg>
  );
});

export const Bell = memo(function Bell({ className = "", length = 120, delay = 0 }) {
  return (
    <svg className={`bell ${className}`} width="44" height={length + 60} viewBox={`-22 0 44 ${length + 60}`} aria-hidden="true" style={{ animationDelay: `${delay}s` }}>
      <path d={`M0 0 V${length}`} stroke="url(#g-gold-v)" strokeWidth="2" />
      {[...Array(Math.floor(length / 14))].map((_, i) => (
        <circle key={i} cx="0" cy={8 + i * 14} r="2.2" fill="url(#g-gold)" />
      ))}
      <g transform={`translate(0 ${length})`}>
        <circle cy="2" r="5" fill="url(#g-brass)" />
        <path d="M-6 8 C-6 4 6 4 6 8 C10 12 12 24 18 36 H-18 C-12 24 -10 12 -6 8Z" fill="url(#g-brass)" />
        <path d="M-18 36 H18 l2 4 H-20Z" fill="#8C6A2E" />
        <circle className="bell__clapper" cy="44" r="4" fill="#8C6A2E" />
        <path d="M-10 22 q10 4 20 0" stroke="#FCEBB6" strokeWidth="1" fill="none" opacity=".7" />
      </g>
    </svg>
  );
});

/** Mango leaf & marigold toran spanning the width. */
export const Toran = memo(function Toran({ className = "" }) {
  const n = 14;
  return (
    <svg className={`toran ${className}`} viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 6 H400" stroke="#7A5A24" strokeWidth="2" />
      {[...Array(n)].map((_, i) => {
        const x = 14 + i * (372 / (n - 1));
        return (
          <g key={i}>
            <Leaf x={x} y={8} len={36 + (i % 2) * 8} w={9} rot={180} />
            <Marigold x={x + 13} y={10} r={5} tone={i % 2 ? "yellow" : undefined} />
          </g>
        );
      })}
    </svg>
  );
});

/** Om (ૐ) glowing inside a lotus halo — or a kalash. */
export const DivineSymbol = memo(function DivineSymbol({ symbol = "om", className = "" }) {
  if (symbol === "none") return null;
  return (
    <svg className={`divine-symbol ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="92" r="84" fill="url(#g-glow)" className="halo-pulse" />
      <g className="halo-rotate" style={{ transformOrigin: "100px 92px" }}>
        {[...Array(24)].map((_, i) => (
          <path key={i} d="M100 22 q5 -10 0 -16 q-5 6 0 16Z" fill="url(#g-gold)" opacity=".85" transform={`rotate(${i * 15} 100 92)`} />
        ))}
      </g>
      <circle cx="100" cy="92" r="58" fill="none" stroke="url(#g-gold)" strokeWidth="1.5" />
      <circle cx="100" cy="92" r="52" fill="none" stroke="url(#g-gold)" strokeWidth=".6" strokeDasharray="2 4" />
      {symbol === "kalash" ? (
        <Kalash x={100} y={128} s={0.6} />
      ) : (
        <text x="100" y="118" textAnchor="middle" fontSize="70" fill="url(#g-gold)" fontFamily="'Noto Serif Gujarati', serif">
          ૐ
        </text>
      )}
      <LotusShape x={100} y={190} s={1.1} />
    </svg>
  );
});

export const KalashArt = memo(function KalashArt({ className = "" }) {
  return (
    <svg className={className} viewBox="-60 -110 120 150" aria-hidden="true">
      <Kalash />
    </svg>
  );
});

export const Lotus = memo(function Lotus({ className = "" }) {
  return (
    <svg className={className} viewBox="-60 -60 120 70" aria-hidden="true">
      <LotusShape />
    </svg>
  );
});
