/** Shared SVG gradients referenced by id across all inline artwork. */
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8C6A2E" />
          <stop offset=".25" stopColor="#E9CF8E" />
          <stop offset=".5" stopColor="#B58A45" />
          <stop offset=".7" stopColor="#F3DFA6" />
          <stop offset="1" stopColor="#A57B37" />
        </linearGradient>
        <linearGradient id="g-gold-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3DFA6" />
          <stop offset=".5" stopColor="#B58A45" />
          <stop offset="1" stopColor="#8C6A2E" />
        </linearGradient>
        <radialGradient id="g-brass" cx="38%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FCEBB6" />
          <stop offset=".5" stopColor="#D6A84E" />
          <stop offset="1" stopColor="#8C6A2E" />
        </radialGradient>
        <radialGradient id="g-flame" cx="50%" cy="70%" r="60%">
          <stop offset="0" stopColor="#FFF7D6" />
          <stop offset=".45" stopColor="#FFC94A" />
          <stop offset="1" stopColor="#F07A1A" />
        </radialGradient>
        <radialGradient id="g-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFE7A8" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFE7A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g-lotus" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#E59AA0" />
          <stop offset="1" stopColor="#FBE3E1" />
        </linearGradient>
        <linearGradient id="g-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7E8F68" />
          <stop offset="1" stopColor="#4D5C3F" />
        </linearGradient>
        <linearGradient id="g-haldi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8D46A" />
          <stop offset="1" stopColor="#D99A1E" />
        </linearGradient>
        <linearGradient id="g-maroon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9B3B4E" />
          <stop offset="1" stopColor="#5E1F2C" />
        </linearGradient>
        <linearGradient id="g-ivory" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFBF2" />
          <stop offset="1" stopColor="#EADBC2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
