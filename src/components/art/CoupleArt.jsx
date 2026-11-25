import { memo } from "react";
import { Garland, Leaf, Sparkle } from "./primitives.jsx";

/**
 * Illustrated bride & groom (shown until a real couple photo is configured).
 * Stylised silhouettes: groom in sherwani & safa, bride in lehenga & veil.
 */
function CoupleArt({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 400 500" role="img" aria-label="Illustration of the bride and groom">
      <defs>
        <linearGradient id="ca-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8EBD8" />
          <stop offset="1" stopColor="#F2DCC4" />
        </linearGradient>
        <linearGradient id="ca-sher" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4E6CC" />
          <stop offset="1" stopColor="#D9C29C" />
        </linearGradient>
        <linearGradient id="ca-leh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9DAE88" />
          <stop offset="1" stopColor="#637A48" />
        </linearGradient>
        <linearGradient id="ca-veil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7D9D6" stopOpacity=".95" />
          <stop offset="1" stopColor="#DDA5A4" stopOpacity=".85" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#ca-sky)" />
      <circle cx="200" cy="210" r="150" fill="url(#g-glow)" opacity=".8" />
      {/* distant arches */}
      <g fill="#EBD8BC" opacity=".8">
        {[40, 120, 280, 360].map((x) => (
          <path key={x} d={`M${x - 30} 420 V260 Q${x} 220 ${x + 30} 260 V420Z`} />
        ))}
      </g>
      <Garland x1={0} y1={18} x2={200} y2={18} sag={30} count={12} r={8} />
      <Garland x1={200} y1={18} x2={400} y2={18} sag={30} count={12} r={8} />

      {/* Groom */}
      <g transform="translate(150 0)">
        <path d="M-58 500 L-50 300 C-48 260 -30 240 0 236 C30 240 48 260 50 300 L58 500Z" fill="url(#ca-sher)" />
        <path d="M0 240 V500" stroke="#B58A45" strokeWidth="2" />
        {[270, 300, 330, 360, 390].map((y) => (
          <circle key={y} cx="0" cy={y} r="3" fill="url(#g-gold)" />
        ))}
        <path d="M-50 300 C-60 330 -62 380 -56 420" stroke="#C9AE86" strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M-40 250 Q0 300 40 250" stroke="url(#g-gold)" strokeWidth="3" fill="none" />
        <path d="M-30 250 C-34 300 -20 340 0 380 C20 340 34 300 30 250" fill="none" stroke="#DDA5A4" strokeWidth="5" strokeDasharray="1 7" strokeLinecap="round" />
        {/* dupatta */}
        <path d="M30 244 C60 290 50 380 30 470" stroke="#782C3B" strokeWidth="14" fill="none" opacity=".85" />
        <rect x="-12" y="204" width="24" height="36" rx="10" fill="#C99D7B" />
        <ellipse cx="0" cy="182" rx="30" ry="36" fill="#D8AE8C" />
        {/* safa */}
        <path d="M-34 176 C-38 130 38 124 36 172 C30 160 -26 158 -34 176Z" fill="#782C3B" />
        <path d="M-32 168 C-10 150 20 150 34 166" stroke="url(#g-gold)" strokeWidth="3" fill="none" />
        <path d="M-30 156 C-10 140 18 140 32 152" stroke="url(#g-gold)" strokeWidth="2" fill="none" />
        <path d="M14 138 C30 112 38 120 30 146" fill="#782C3B" />
        <circle cx="12" cy="146" r="5" fill="url(#g-gold)" />
        <path d="M-34 176 C-44 200 -48 230 -40 260" stroke="#782C3B" strokeWidth="8" fill="none" />
      </g>

      {/* Bride */}
      <g transform="translate(252 0)">
        <path d="M-80 500 C-70 420 -50 340 -36 300 L36 300 C50 340 70 420 80 500Z" fill="url(#ca-leh)" />
        {[330, 380, 430, 480].map((y, i) => (
          <path key={y} d={`M${-44 - i * 11} ${y} Q0 ${y + 12} ${44 + i * 11} ${y}`} stroke="url(#g-gold)" strokeWidth="2" fill="none" />
        ))}
        {[...Array(9)].map((_, i) => (
          <circle key={i} cx={-60 + i * 15} cy={470} r="3" fill="#F7D9D6" />
        ))}
        <path d="M-34 250 C-36 280 -36 300 -36 300 H36 C36 300 36 280 34 250 C20 240 -20 240 -34 250Z" fill="#DDA5A4" />
        <path d="M-30 300 H30" stroke="url(#g-gold)" strokeWidth="4" />
        <rect x="-10" y="212" width="20" height="34" rx="9" fill="#D8AE8C" />
        <path d="M-22 244 Q0 268 22 244" stroke="url(#g-gold)" strokeWidth="4" fill="none" />
        <path d="M-18 252 Q0 280 18 252" stroke="url(#g-gold)" strokeWidth="2" fill="none" />
        <ellipse cx="0" cy="190" rx="26" ry="32" fill="#E0B898" />
        <path d="M-26 180 C-30 140 30 140 26 180 C20 168 -20 168 -26 180Z" fill="#3A2A20" />
        <circle cx="0" cy="166" r="3" fill="#C21E2C" />
        <path d="M0 160 V150" stroke="url(#g-gold)" strokeWidth="2" />
        <circle cx="0" cy="148" r="4" fill="url(#g-gold)" />
        {/* veil */}
        <path d="M-6 146 C-50 150 -64 220 -70 300 C-78 380 -84 440 -90 500 L-60 500 C-54 420 -44 330 -30 260 C-24 220 -24 190 -20 170Z" fill="url(#ca-veil)" />
        <path d="M6 146 C46 150 58 220 62 300 C64 340 70 420 84 500 L60 500 C52 420 40 330 30 260 C26 220 24 190 20 170Z" fill="url(#ca-veil)" />
        <path d="M-6 146 C-50 150 -64 220 -70 300 C-78 380 -84 440 -90 500" stroke="url(#g-gold)" strokeWidth="2.5" fill="none" />
        <path d="M6 146 C46 150 58 220 62 300 C64 340 70 420 84 500" stroke="url(#g-gold)" strokeWidth="2.5" fill="none" />
      </g>

      {/* joined hands with garland */}
      <path d="M190 360 C200 350 208 350 214 360" stroke="#D8AE8C" strokeWidth="14" strokeLinecap="round" fill="none" />
      <circle cx="202" cy="372" r="8" fill="#C9475B" />
      <Leaf x={210} y={380} len={20} w={6} rot={160} />
      <Sparkle x={70} y={120} r={9} />
      <Sparkle x={330} y={100} r={7} />
      <Sparkle x={350} y={260} r={5} />
    </svg>
  );
}

export default memo(CoupleArt);
