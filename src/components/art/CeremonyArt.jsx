import { memo } from "react";
import { DiyaShape, Garland, Kalash, Leaf, LotusShape, Marigold, Sparkle, Swastik } from "./primitives.jsx";

/**
 * Original illustrations, one per ceremony (keys match `art` in the config).
 * Each draws inside a 200×200 viewBox.
 */

const Kankotri = () => (
  <g>
    <rect x="44" y="52" width="92" height="112" rx="4" fill="url(#g-maroon)" transform="rotate(-8 90 108)" />
    <rect x="58" y="44" width="92" height="112" rx="4" fill="url(#g-ivory)" stroke="url(#g-gold)" strokeWidth="2" transform="rotate(4 104 100)" />
    <g transform="rotate(4 104 100)">
      <rect x="66" y="52" width="76" height="96" fill="none" stroke="#B58A45" strokeWidth=".8" />
      <Swastik x={104} y={76} s={0.8} />
      {[96, 106, 116, 126].map((y, i) => (
        <path key={i} d={`M${78 + i * 2} ${y} H${130 - i * 2}`} stroke="#B4302E" strokeWidth="1.6" opacity=".55" strokeLinecap="round" />
      ))}
    </g>
    <ellipse cx="152" cy="160" rx="22" ry="7" fill="url(#g-brass)" />
    <path d="M132 158 q20 -22 40 0Z" fill="#C21E2C" />
    <circle cx="146" cy="150" r="2" fill="#E5414E" />
    {[[40, 170], [52, 176], [64, 168], [30, 160], [74, 178], [58, 160]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="3" ry="1.4" fill="#FFF8E7" stroke="#D8C7A3" strokeWidth=".5" transform={`rotate(${i * 30} ${x} ${y})`} />
    ))}
    <Marigold x={34} y={58} r={9} />
    <Marigold x={168} y={44} r={7} tone="yellow" />
  </g>
);

const Ganesh = () => (
  <g>
    <circle cx="100" cy="88" r="62" fill="url(#g-glow)" />
    <circle cx="100" cy="88" r="44" fill="none" stroke="url(#g-gold)" strokeWidth="2" />
    {[...Array(16)].map((_, i) => (
      <path key={i} d="M100 36 q4 -8 0 -14 q-4 6 0 14Z" fill="url(#g-gold)" transform={`rotate(${i * 22.5} 100 88)`} />
    ))}
    <text x="100" y="108" textAnchor="middle" fontSize="56" fill="url(#g-gold)" fontFamily="'Noto Serif Gujarati', serif">ૐ</text>
    <LotusShape x={100} y={168} s={0.9} />
    <DiyaShape x={40} y={172} s={0.8} />
    <DiyaShape x={160} y={172} s={0.8} />
  </g>
);

const Mandap = () => (
  <g>
    <path d="M30 70 Q100 18 170 70Z" fill="url(#g-maroon)" />
    <path d="M30 70 Q100 30 170 70" fill="none" stroke="url(#g-gold)" strokeWidth="3" />
    <circle cx="100" cy="30" r="5" fill="url(#g-gold)" />
    <rect x="26" y="70" width="148" height="8" fill="url(#g-gold)" />
    {[36, 76, 124, 164].map((x, i) => (
      <g key={i}>
        <rect x={x - 4} y="78" width="8" height="96" fill="url(#g-ivory)" stroke="#C9A766" strokeWidth=".8" />
        <rect x={x - 6} y="170" width="12" height="6" fill="url(#g-gold)" />
      </g>
    ))}
    <Garland x1={36} y1={80} x2={100} y2={80} sag={14} count={7} r={5} />
    <Garland x1={100} y1={80} x2={164} y2={80} sag={14} count={7} r={5} />
    {[...Array(9)].map((_, i) => (
      <Leaf key={i} x={38 + i * 16} y={78} len={16} w={5} rot={180} />
    ))}
    <Kalash x={100} y={162} s={0.42} />
    <rect x="20" y="176" width="160" height="6" rx="3" fill="#C9A766" opacity=".6" />
  </g>
);

const Havan = () => (
  <g>
    <g className="flame" style={{ transformOrigin: "100px 120px" }}>
      <path d="M100 52 C122 82 128 104 100 124 C72 104 78 82 100 52Z" fill="url(#g-flame)" />
      <path d="M84 80 C96 98 98 112 86 124 C72 112 74 96 84 80Z" fill="url(#g-flame)" opacity=".85" />
      <path d="M118 84 C128 100 128 112 116 124 C104 112 106 98 118 84Z" fill="url(#g-flame)" opacity=".85" />
      <path d="M100 86 C108 100 108 112 100 120 C92 112 92 100 100 86Z" fill="#FFF6D6" />
    </g>
    <path d="M100 48 q-10 -14 2 -26 q10 -10 -2 -20" stroke="#B9A88E" strokeWidth="2" fill="none" opacity=".5" />
    <path d="M50 124 h100 l-8 14 h-84Z" fill="url(#g-brass)" />
    <path d="M58 138 h84 l-8 14 h-68Z" fill="#B58A45" />
    <path d="M66 152 h68 l-6 14 h-56Z" fill="#8C6A2E" />
    {[70, 90, 110, 130].map((x) => <rect key={x} x={x - 6} y={116} width="16" height="8" rx="2" fill="#7A4E2A" transform={`rotate(${x % 3 ? 12 : -12} ${x} 120)`} />)}
    <path d="M150 110 L178 82" stroke="#B58A45" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="148" cy="112" rx="8" ry="4" fill="url(#g-brass)" />
    <DiyaShape x={34} y={176} s={0.6} />
    <DiyaShape x={166} y={176} s={0.6} />
  </g>
);

const Mehendi = () => (
  <g>
    <ellipse cx="100" cy="176" rx="70" ry="10" fill="#637A48" opacity=".25" />
    <path
      d="M76 178 C70 150 62 128 60 108 C58 96 68 94 72 106 L78 124 L76 72 C76 62 88 62 88 72 L90 116 L92 60 C92 50 104 50 104 60 L104 116 L108 66 C108 56 120 56 120 66 L118 120 L126 86 C128 76 140 78 138 88 L128 140 C124 160 120 170 118 178Z"
      fill="#F2D2B6"
      stroke="#C99D7B"
      strokeWidth="1.2"
    />
    <g fill="none" stroke="#9B4A23" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="98" cy="146" r="12" />
      <circle cx="98" cy="146" r="6" />
      {[...Array(8)].map((_, i) => (
        <path key={i} d="M98 132 q4 -6 0 -10 q-4 4 0 10" transform={`rotate(${i * 45} 98 146)`} />
      ))}
      <path d="M82 70 v40 M98 64 v44 M114 70 v42" strokeDasharray="2 3" />
      <path d="M78 168 q20 -6 40 0" />
      <path d="M80 160 q18 -5 36 0" strokeDasharray="1 3" />
    </g>
    <path d="M148 60 L170 150 L162 152 Z" fill="#3E6B2E" />
    <path d="M148 60 L152 54 L156 58Z" fill="#C9A766" />
    <Leaf x={34} y={176} len={40} w={12} rot={-30} />
    <Leaf x={44} y={178} len={32} w={10} rot={10} />
    <Leaf x={168} y={178} len={36} w={11} rot={30} />
  </g>
);

const Haldi = () => (
  <g>
    {[[64, 150, 1], [128, 140, 1.2], [96, 172, 0.8]].map(([x, y, s], i) => (
      <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-30 -10 C-28 14 28 14 30 -10Z" fill="url(#g-brass)" />
        <ellipse cx="0" cy="-10" rx="30" ry="8" fill="#B58A45" />
        <ellipse cx="0" cy="-12" rx="26" ry="6" fill="url(#g-haldi)" />
        <path d="M-12 -14 q12 -10 24 0" fill="#F9DC7C" />
      </g>
    ))}
    <Marigold x={40} y={70} r={14} tone="yellow" />
    <Marigold x={70} y={52} r={11} />
    <Marigold x={160} y={78} r={13} tone="yellow" />
    <Marigold x={134} y={56} r={9} />
    <Leaf x={52} y={84} len={30} w={9} rot={-140} />
    <Leaf x={148} y={92} len={28} w={9} rot={140} />
    {[[30, 120], [176, 120], [100, 96]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="5" ry="3" fill="#F0A42A" transform={`rotate(${i * 50} ${x} ${y})`} />
    ))}
  </g>
);

const Mameru = () => (
  <g>
    <ellipse cx="100" cy="164" rx="76" ry="14" fill="url(#g-brass)" />
    <ellipse cx="100" cy="160" rx="70" ry="10" fill="#E9CF8E" />
    <rect x="46" y="120" width="70" height="36" rx="3" fill="url(#g-maroon)" />
    <rect x="46" y="132" width="70" height="6" fill="url(#g-gold)" />
    <rect x="54" y="94" width="58" height="28" rx="3" fill="#2F6E5A" />
    <rect x="54" y="104" width="58" height="5" fill="url(#g-gold)" />
    <rect x="60" y="72" width="48" height="24" rx="3" fill="#DDA5A4" />
    <rect x="60" y="80" width="48" height="4" fill="url(#g-gold)" />
    <g transform="translate(140 118)">
      <rect x="-20" y="0" width="40" height="38" fill="#EAB84B" />
      <rect x="-24" y="-8" width="48" height="10" fill="#D99A1E" />
      <rect x="-3" y="-8" width="6" height="46" fill="#B4302E" />
      <path d="M0 -8 C-14 -24 -22 -10 0 -8 C22 -10 14 -24 0 -8Z" fill="#B4302E" />
    </g>
    <Sparkle x={36} y={70} r={7} />
    <Sparkle x={168} y={84} r={5} />
    <Marigold x={32} y={150} r={8} />
    <Marigold x={172} y={152} r={8} tone="yellow" />
  </g>
);

const Garba = () => (
  <g>
    <path d="M10 26 Q100 64 190 26" stroke="#7A5A24" strokeWidth="1" fill="none" />
    {[...Array(11)].map((_, i) => {
      const t = i / 10;
      const x = 10 + 180 * t;
      const y = 26 + Math.sin(Math.PI * t) * 19;
      return <circle key={i} cx={x} cy={y + 6} r="4" fill={["#EAB84B", "#DDA5A4", "#8FB3A0", "#E57C5A"][i % 4]} className="twinkle" style={{ animationDelay: `${i * 0.2}s` }} />;
    })}
    <g transform="translate(100 118)">
      <ellipse cx="0" cy="40" rx="34" ry="6" fill="#000" opacity=".1" />
      <path d="M-30 0 C-36 30 -18 42 0 42 C18 42 36 30 30 0 C24 -18 -24 -18 -30 0Z" fill="#C2582B" />
      <path d="M-12 -22 h24 v-8 h-24Z" fill="#A8471F" />
      <ellipse cx="0" cy="-12" rx="22" ry="9" fill="#D76A35" />
      {[[-16, 6], [0, 2], [16, 6], [-8, 20], [8, 20], [-20, 22], [20, 22]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#FFD36E" className="twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
      <path d="M-28 -2 q28 10 56 0" stroke="#FFF2C9" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
      <g transform="translate(0 -32)">
        <DiyaShape s={0.4} />
      </g>
    </g>
    {[[-30, "#B4302E"], [30, "#2F6E5A"]].map(([a, c], i) => (
      <g key={i} transform={`translate(${i ? 160 : 40} 120) rotate(${a})`}>
        <rect x="-3.5" y="-46" width="7" height="92" rx="3.5" fill={c} />
        {[-36, -20, -4, 12, 28].map((y) => (
          <rect key={y} x="-3.5" y={y} width="7" height="5" fill="url(#g-gold)" />
        ))}
        <circle cx="0" cy="-48" r="4" fill="url(#g-gold)" />
      </g>
    ))}
  </g>
);

const Baraat = () => (
  <g>
    <g transform="translate(100 30)">
      <path d="M-56 34 Q0 -16 56 34Z" fill="url(#g-maroon)" />
      <path d="M-56 34 Q0 -4 56 34" fill="none" stroke="url(#g-gold)" strokeWidth="3" />
      {[...Array(9)].map((_, i) => (
        <path key={i} d={`M${-52 + i * 13} 34 l4 9 l4 -9`} fill="url(#g-gold)" />
      ))}
      <rect x="-2" y="-14" width="4" height="150" fill="url(#g-gold-v)" />
      <circle cx="0" cy="-16" r="5" fill="url(#g-gold)" />
    </g>
    <g transform="translate(58 140)">
      <rect x="-30" y="-20" width="60" height="44" rx="20" fill="url(#g-maroon)" />
      <ellipse cx="-30" cy="2" rx="8" ry="22" fill="url(#g-ivory)" />
      <ellipse cx="30" cy="2" rx="8" ry="22" fill="#E8D6B6" />
      {[-14, 0, 14].map((x) => (
        <path key={x} d={`M${x - 6} -18 L${x + 6} 22`} stroke="url(#g-gold)" strokeWidth="2" />
      ))}
      <path d="M-30 -20 q-14 -16 -24 -30" stroke="#7A5A24" strokeWidth="2" fill="none" />
    </g>
    <g transform="translate(150 150) rotate(-35)">
      <path d="M0 -48 L6 26 L-6 26Z" fill="#8C5A2B" />
      <path d="M-14 26 Q0 46 14 26Z" fill="url(#g-brass)" />
      {[-30, -16, -2, 12].map((y) => (
        <circle key={y} cx="0" cy={y} r="1.8" fill="#3B2615" />
      ))}
    </g>
    <Marigold x={24} y={186} r={7} />
    <Marigold x={176} y={186} r={7} tone="yellow" />
    <Sparkle x={150} y={56} r={6} />
  </g>
);

const Aarti = () => (
  <g>
    <ellipse cx="100" cy="140" rx="74" ry="26" fill="url(#g-brass)" />
    <ellipse cx="100" cy="136" rx="66" ry="20" fill="#E9CF8E" />
    <ellipse cx="100" cy="136" rx="58" ry="16" fill="none" stroke="#B58A45" strokeWidth="1" strokeDasharray="2 3" />
    <DiyaShape x={100} y={136} s={0.9} />
    <g transform="translate(58 136)">
      <ellipse rx="10" ry="4" fill="url(#g-brass)" />
      <path d="M-8 -1 q8 -8 16 0Z" fill="#C21E2C" />
    </g>
    <g transform="translate(142 136)">
      <ellipse rx="10" ry="4" fill="url(#g-brass)" />
      <path d="M-8 -1 q8 -8 16 0Z" fill="#F6C343" />
    </g>
    <Marigold x={76} y={150} r={7} />
    <Marigold x={124} y={150} r={7} tone="yellow" />
    {[[86, 124], [116, 124], [100, 152]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="2.6" ry="1.2" fill="#FFF8E7" />
    ))}
    <g transform="translate(40 70)">
      <path d="M-12 10 C-14 -4 14 -4 12 10Z" fill="#B86B3B" />
      <ellipse cy="10" rx="12" ry="3" fill="#8F4F26" />
    </g>
    <g transform="translate(160 70)">
      <path d="M-12 10 C-14 -4 14 -4 12 10Z" fill="#B86B3B" />
      <ellipse cy="10" rx="12" ry="3" fill="#8F4F26" />
    </g>
    <Sparkle x={100} y={46} r={8} />
  </g>
);

const Jaimala = () => {
  const ring = (cx, rot, tone) => (
    <g transform={`rotate(${rot} ${cx} 100)`}>
      {[...Array(18)].map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const x = cx + Math.cos(a) * 34;
        const y = 100 + Math.sin(a) * 46;
        return i % 3 === 0 ? <Leaf key={i} x={x} y={y} len={12} w={4} rot={(a * 180) / Math.PI} /> : <Marigold key={i} x={x} y={y} r={6} tone={i % 2 ? tone : undefined} />;
      })}
    </g>
  );
  return (
    <g>
      {ring(76, -12, "yellow")}
      {ring(124, 12)}
      <g transform="translate(100 150)">
        <path d="M0 18 C-30 -4 -18 -26 0 -12 C18 -26 30 -4 0 18Z" fill="#C9475B" />
      </g>
      {[...Array(5)].map((_, i) => (
        <circle key={i} cx={100} cy={160 + i * 7} r="3.5" fill={i % 2 ? "#F7D9D6" : "#E8B4B1"} />
      ))}
      <Sparkle x={100} y={40} r={8} />
      <Sparkle x={40} y={166} r={5} />
      <Sparkle x={162} y={166} r={5} />
    </g>
  );
};

const HastMelap = () => (
  <g>
    <path d="M40 182 V86 Q100 22 160 86 V182" fill="none" stroke="url(#g-gold)" strokeWidth="3" />
    <path d="M50 182 V90 Q100 36 150 90 V182" fill="none" stroke="url(#g-gold)" strokeWidth="1" />
    <circle cx="100" cy="112" r="48" fill="url(#g-glow)" />
    <g transform="translate(100 120)">
      <path d="M-62 26 C-44 18 -28 4 -14 -6 C-6 -12 8 -10 10 -2 C12 6 4 12 -4 14 L20 14 C30 14 30 26 20 26 L-20 30 C-34 32 -48 34 -62 40Z" fill="#F2D2B6" stroke="#C99D7B" strokeWidth="1" />
      <path d="M62 -6 C44 -2 30 8 16 4 C6 2 -2 8 2 16 C6 22 14 22 20 18 L-6 24 C-16 26 -14 38 -4 36 L30 30 C44 28 52 24 62 22Z" fill="#E9C3A1" stroke="#C99D7B" strokeWidth="1" />
      <g fill="none" stroke="#9B4A23" strokeWidth=".9">
        <circle cx="-30" cy="20" r="4" />
        <path d="M-44 28 q6 -4 12 0" />
        <circle cx="34" cy="14" r="3.5" />
      </g>
      <rect x="-66" y="22" width="8" height="20" rx="3" fill="#B4302E" transform="rotate(-20 -62 32)" />
      <rect x="-60" y="22" width="4" height="20" rx="2" fill="url(#g-gold)" transform="rotate(-20 -58 32)" />
      <rect x="58" y="-8" width="6" height="32" rx="3" fill="url(#g-gold)" transform="rotate(-15 61 8)" />
    </g>
    <path d="M70 160 C90 150 110 170 130 160" stroke="#E8B4B1" strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="100" cy="163" r="6" fill="#C9475B" />
    <Sparkle x={100} y={56} r={8} />
  </g>
);

const Fera = () => (
  <g>
    <ellipse cx="100" cy="118" rx="76" ry="50" fill="none" stroke="#B58A45" strokeWidth="1.5" strokeDasharray="3 5" />
    {[...Array(7)].map((_, i) => {
      const a = Math.PI * 0.75 + (i / 6) * Math.PI * 1.5;
      const x = 100 + Math.cos(a) * 76;
      const y = 118 + Math.sin(a) * 50;
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${(a * 180) / Math.PI + 90})`}>
          <ellipse rx="5" ry="8" fill="#C21E2C" opacity=".8" />
          {[-4, -1.5, 1, 3.5].map((dx) => (
            <circle key={dx} cx={dx} cy="-10" r="1.4" fill="#C21E2C" opacity=".8" />
          ))}
        </g>
      );
    })}
    <g className="flame" style={{ transformOrigin: "100px 118px" }}>
      <path d="M100 74 C116 94 120 108 100 122 C80 108 84 94 100 74Z" fill="url(#g-flame)" />
      <path d="M100 96 C106 104 106 112 100 118 C94 112 94 104 100 96Z" fill="#FFF6D6" />
    </g>
    <path d="M70 122 h60 l-6 10 h-48Z" fill="url(#g-brass)" />
    <path d="M76 132 h48 l-5 10 h-38Z" fill="#B58A45" />
    {[...Array(7)].map((_, i) => (
      <text key={i} x={38 + i * 21} y={34} textAnchor="middle" fontSize="13" fill="#8C6A2E" fontFamily="Cinzel, serif">
        {i + 1}
      </text>
    ))}
  </g>
);

const Thali = () => (
  <g>
    <ellipse cx="100" cy="118" rx="80" ry="66" fill="url(#g-brass)" />
    <ellipse cx="100" cy="114" rx="72" ry="58" fill="#EAD9B0" />
    {[
      [64, 86, "#E3A23A"], [100, 72, "#7A9A4B"], [136, 86, "#C9563C"], [146, 120, "#F4E3B5"], [56, 124, "#B86A2E"],
    ].map(([x, y, c], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y + 4} rx="16" ry="12" fill="url(#g-brass)" />
        <ellipse cx={x} cy={y} rx="14" ry="10" fill={c} />
      </g>
    ))}
    <ellipse cx="102" cy="136" rx="26" ry="16" fill="#FFFDF5" />
    <ellipse cx="96" cy="132" rx="10" ry="5" fill="#fff" />
    <g transform="translate(70 150)">
      <circle r="12" fill="#E8C077" />
      <circle r="12" fill="none" stroke="#C99A4A" strokeWidth="1" strokeDasharray="2 2" />
    </g>
    <circle cx="136" cy="150" r="7" fill="#F2B84B" />
    <circle cx="144" cy="144" r="6" fill="#F2B84B" />
    <Leaf x={112} y={100} len={14} w={5} rot={30} />
  </g>
);

const Vidai = () => (
  <g>
    <rect x="20" y="110" width="160" height="5" rx="2.5" fill="#7A4E2A" />
    <path d="M60 60 Q100 28 140 60Z" fill="url(#g-maroon)" />
    <circle cx="100" cy="36" r="5" fill="url(#g-gold)" />
    <rect x="58" y="60" width="84" height="76" fill="url(#g-maroon)" />
    <rect x="64" y="66" width="72" height="64" fill="none" stroke="url(#g-gold)" strokeWidth="2" />
    <path d="M78 130 V86 Q100 66 122 86 V130" fill="#F7D9D6" />
    <path d="M78 130 V86 Q100 66 122 86 V130" fill="none" stroke="url(#g-gold)" strokeWidth="1.5" />
    {[...Array(7)].map((_, i) => (
      <path key={i} d={`M${60 + i * 13} 60 l4 8 l4 -8`} fill="url(#g-gold)" />
    ))}
    <Garland x1={58} y1={64} x2={142} y2={64} sag={6} count={8} r={4} />
    {[[40, 160], [64, 176], [100, 168], [136, 178], [160, 158], [30, 140], [172, 136]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="6" ry="3.5" fill={i % 2 ? "#F7D9D6" : "#E8B4B1"} transform={`rotate(${i * 40} ${x} ${y})`} className="drift" style={{ animationDelay: `${i * 0.4}s` }} />
    ))}
  </g>
);

const GrihaPravesh = () => (
  <g>
    <rect x="40" y="30" width="120" height="140" fill="url(#g-ivory)" stroke="url(#g-gold)" strokeWidth="2" />
    <path d="M60 170 V70 Q100 40 140 70 V170" fill="#6E4B2E" />
    <path d="M100 170 V60" stroke="#4F3520" strokeWidth="2" />
    <circle cx="94" cy="118" r="2.5" fill="url(#g-gold)" />
    <circle cx="106" cy="118" r="2.5" fill="url(#g-gold)" />
    {[...Array(9)].map((_, i) => (
      <Leaf key={i} x={46 + i * 13.5} y={32} len={16} w={5} rot={180} />
    ))}
    <g transform="translate(100 186)">
      {[...Array(8)].map((_, i) => (
        <path key={i} d="M0 0 q6 -12 0 -18 q-6 6 0 18" fill={["#C21E2C", "#EAB84B", "#2F6E5A", "#DDA5A4"][i % 4]} transform={`rotate(${i * 45 + 22}) scale(1 .45)`} />
      ))}
      <circle r="3" fill="url(#g-gold)" />
    </g>
    <g transform="translate(154 164) rotate(-60)">
      <Kalash s={0.32} swastik={false} />
    </g>
    {[[134, 176], [126, 180], [120, 184], [130, 186]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="2.4" ry="1.1" fill="#FFF8E7" stroke="#D8C7A3" strokeWidth=".4" />
    ))}
    {[[66, 186, -10], [80, 176, 8]].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <ellipse rx="4" ry="6.5" fill="#C21E2C" opacity=".8" />
        {[-3, -1, 1, 3].map((dx) => (
          <circle key={dx} cx={dx} cy="-8.5" r="1" fill="#C21E2C" opacity=".8" />
        ))}
      </g>
    ))}
  </g>
);

const Reception = () => (
  <g>
    <path d="M100 6 V40" stroke="url(#g-gold-v)" strokeWidth="2" />
    <circle cx="100" cy="90" r="70" fill="url(#g-glow)" opacity=".7" />
    <ellipse cx="100" cy="46" rx="18" ry="6" fill="url(#g-gold)" />
    <path d="M100 46 C60 56 44 80 46 96 M100 46 C140 56 156 80 154 96 M100 46 C80 60 74 84 76 104 M100 46 C120 60 126 84 124 104" stroke="url(#g-gold)" strokeWidth="2" fill="none" />
    <ellipse cx="100" cy="98" rx="58" ry="10" fill="none" stroke="url(#g-gold)" strokeWidth="3" />
    {[46, 76, 100, 124, 154].map((x, i) => (
      <g key={i}>
        <rect x={x - 3} y={i % 4 === 0 ? 84 : 92} width="6" height="12" fill="#FFF8E7" />
        <path d={`M${x} ${i % 4 === 0 ? 72 : 80} c4 5 4 9 0 12 c-4 -3 -4 -7 0 -12Z`} fill="url(#g-flame)" className="flame" style={{ transformOrigin: `${x}px ${i % 4 === 0 ? 84 : 92}px` }} />
      </g>
    ))}
    {[...Array(13)].map((_, i) => {
      const x = 46 + i * 9;
      const len = 14 + Math.sin((i / 12) * Math.PI) * 30;
      return (
        <g key={i}>
          <path d={`M${x} 104 V${104 + len}`} stroke="#E9CF8E" strokeWidth=".8" />
          <path d={`M${x} ${108 + len} l3 -5 l-3 -5 l-3 5Z`} fill="#FDF6E3" stroke="#D9BC7A" strokeWidth=".6" className="twinkle" style={{ animationDelay: `${i * 0.15}s` }} />
        </g>
      );
    })}
    <path d="M100 150 l4 -7 l-4 -7 l-4 7Z" fill="url(#g-gold)" />
    <Sparkle x={34} y={40} r={6} />
    <Sparkle x={168} y={50} r={5} />
  </g>
);

const ART = {
  kankotri: Kankotri,
  ganesh: Ganesh,
  mandap: Mandap,
  havan: Havan,
  mehendi: Mehendi,
  haldi: Haldi,
  mameru: Mameru,
  garba: Garba,
  baraat: Baraat,
  aarti: Aarti,
  jaimala: Jaimala,
  hastmelap: HastMelap,
  fera: Fera,
  thali: Thali,
  vidai: Vidai,
  grihapravesh: GrihaPravesh,
  reception: Reception,
};

function CeremonyArt({ name, title, className }) {
  const Art = ART[name] || Mandap;
  return (
    <svg viewBox="0 0 200 200" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <Art />
    </svg>
  );
}

export default memo(CeremonyArt);
