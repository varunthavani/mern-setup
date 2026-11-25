import { memo } from "react";

/**
 * Splits text into graphemes for letter-by-letter animation while keeping
 * the full string available to screen readers. Uses Intl.Segmenter so
 * Gujarati conjuncts / matras are never broken apart.
 */
function segments(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map((s) => s.segment);
  }
  return [...text];
}

function SplitText({ text, className = "", as: Tag = "span", charClass = "char" }) {
  return (
    <Tag className={`split ${className}`} aria-label={text}>
      {segments(text).map((ch, i) => (
        <span key={i} className={charClass} aria-hidden="true" style={{ "--i": i }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </Tag>
  );
}

export default memo(SplitText);
