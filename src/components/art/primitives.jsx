/**
 * Small reusable SVG building blocks (use inside an <svg>).
 * Coordinates are in the parent viewBox.
 */

export function Leaf({ x = 0, y = 0, len = 30, w = 10, rot = 0, fill = "url(#g-leaf)" }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C${w} ${-len * 0.25} ${w * 0.9} ${-len * 0.7} 0 ${-len} C${-w * 0.9} ${-len * 0.7} ${-w} ${-len * 0.25} 0 0Z`} fill={fill} />
      <path d={`M0 0 L0 ${-len * 0.92}`} stroke="#3E4934" strokeWidth={Math.max(0.5, w * 0.08)} opacity=".45" />
    </g>
  );
}

export function Marigold({ x = 0, y = 0, r = 10, tone = "orange" }) {
  const c = tone === "yellow" ? ["#E9A21F", "#F6C343", "#FCDB72"] : ["#D9731A", "#EE9A2B", "#F8BC4A"];
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={c[0]} />
      {[...Array(10)].map((_, i) => (
        <ellipse key={i} cx="0" cy={-r * 0.62} rx={r * 0.3} ry={r * 0.42} fill={c[1]} transform={`rotate(${i * 36})`} />
      ))}
      {[...Array(8)].map((_, i) => (
        <ellipse key={`b${i}`} cx="0" cy={-r * 0.36} rx={r * 0.22} ry={r * 0.3} fill={c[2]} transform={`rotate(${i * 45 + 20})`} />
      ))}
      <circle r={r * 0.18} fill="#B4570F" />
    </g>
  );
}

/** A hanging string of marigolds + mango leaves between two points. */
export function Garland({ x1, y1, x2, y2, sag = 30, count = 9, r = 7, tone }) {
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t + Math.sin(Math.PI * t) * sag;
    pts.push([x, y]);
  }
  return (
    <g>
      <path d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag * 2} ${x2} ${y2}`} stroke="#7A5A24" strokeWidth="1" fill="none" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          {i % 2 === 0 && <Leaf x={x} y={y + 2} len={r * 2.6} w={r * 0.8} rot={180} />}
          <Marigold x={x} y={y} r={r} tone={i % 3 === 0 ? "yellow" : tone} />
        </g>
      ))}
    </g>
  );
}

export function Kalash({ x = 0, y = 0, s = 1, swastik = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* mango leaves */}
      {[-50, -28, -8, 8, 28, 50].map((a, i) => (
        <Leaf key={i} x={0} y={-58} len={34} w={8} rot={a} />
      ))}
      {/* coconut */}
      <ellipse cx="0" cy="-74" rx="16" ry="20" fill="#9A6B3A" />
      <path d="M-6 -92 q6 -10 12 0" stroke="#6E4824" strokeWidth="2" fill="none" />
      <path d="M-14 -70 q14 8 28 0" stroke="#D9473A" strokeWidth="3" fill="none" />
      {/* pot */}
      <path d="M-22 -58 h44 l-4 8 c26 10 36 30 30 50 c-6 18 -26 26 -48 26 c-22 0 -42 -8 -48 -26 c-6 -20 4 -40 30 -50Z" fill="url(#g-brass)" />
      <path d="M-28 -12 q28 10 56 0" stroke="#8C6A2E" strokeWidth="2" fill="none" />
      <path d="M-32 4 q32 12 64 0" stroke="#B4302E" strokeWidth="3" fill="none" opacity=".8" />
      <ellipse cx="0" cy="-54" rx="24" ry="5" fill="#E9CF8E" />
      {swastik && (
        <g transform="translate(0 -22) scale(.5)" stroke="#B4302E" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M0 -16 V16 M-16 0 H16 M0 -16 H12 M16 0 V12 M0 16 H-12 M-16 0 V-12" />
          <circle cx="-8" cy="-8" r="2" fill="#B4302E" />
          <circle cx="8" cy="-8" r="2" fill="#B4302E" />
          <circle cx="-8" cy="8" r="2" fill="#B4302E" />
          <circle cx="8" cy="8" r="2" fill="#B4302E" />
        </g>
      )}
      <ellipse cx="0" cy="28" rx="30" ry="5" fill="#000" opacity=".12" />
    </g>
  );
}

export function DiyaShape({ x = 0, y = 0, s = 1, animate = true }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-26" rx="26" ry="30" fill="url(#g-glow)" className={animate ? "flame-glow" : undefined} />
      <g className={animate ? "flame" : undefined} style={{ transformOrigin: "0px -8px" }}>
        <path d="M0 -40 C8 -28 9 -16 0 -8 C-9 -16 -8 -28 0 -40Z" fill="url(#g-flame)" />
        <path d="M0 -26 C3 -20 3 -14 0 -10 C-3 -14 -3 -20 0 -26Z" fill="#FFF8E1" />
      </g>
      <path d="M-26 -6 C-20 10 20 10 26 -6 C14 -2 -14 -2 -26 -6Z" fill="url(#g-brass)" />
      <path d="M-26 -6 C-14 -2 14 -2 26 -6 L30 -10 L18 -8 C8 -6 -8 -6 -18 -8 L-30 -10Z" fill="#E9CF8E" />
      <path d="M-10 8 h20 l4 8 h-28Z" fill="#B58A45" />
    </g>
  );
}

export function LotusShape({ x = 0, y = 0, s = 1 }) {
  const petals = [
    [-64, 0.72], [-40, 0.86], [-20, 0.96], [0, 1.06], [20, 0.96], [40, 0.86], [64, 0.72],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {petals.map(([a, k], i) => (
        <path
          key={i}
          d={`M0 0 C${14 * k} ${-12 * k} ${14 * k} ${-38 * k} 0 ${-50 * k} C${-14 * k} ${-38 * k} ${-14 * k} ${-12 * k} 0 0Z`}
          fill="url(#g-lotus)"
          stroke="#D98A92"
          strokeWidth=".8"
          transform={`rotate(${a})`}
        />
      ))}
      <path d="M-46 4 Q0 22 46 4 Q0 12 -46 4Z" fill="url(#g-leaf)" />
    </g>
  );
}

export function Swastik({ x = 0, y = 0, s = 1, color = "#B4302E" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round">
      <path d="M0 -14 V14 M-14 0 H14 M0 -14 H10 M14 0 V10 M0 14 H-10 M-14 0 V-10" />
      {[[-7, -7], [7, -7], [-7, 7], [7, 7]].map(([a, b], i) => (
        <circle key={i} cx={a} cy={b} r="1.8" fill={color} stroke="none" />
      ))}
    </g>
  );
}

export function Sparkle({ x = 0, y = 0, r = 6, fill = "url(#g-gold)" }) {
  return <path transform={`translate(${x} ${y})`} d={`M0 ${-r} Q${r * 0.15} ${-r * 0.15} ${r} 0 Q${r * 0.15} ${r * 0.15} 0 ${r} Q${-r * 0.15} ${r * 0.15} ${-r} 0 Q${-r * 0.15} ${-r * 0.15} 0 ${-r}Z`} fill={fill} />;
}
