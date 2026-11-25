import { Divider } from "./Ornaments.jsx";

/**
 * Script title + optional Gujarati/English subtitle + gold divider.
 * Reveal attributes are picked up by useReveal in the parent section.
 */
export default function SectionHeading({ title, subtitle, eyebrow, id, light = false, as: Tag = "h2" }) {
  return (
    <header className={`section-heading ${light ? "section-heading--light" : ""}`}>
      {eyebrow && (
        <p className="eyebrow" data-reveal="fade">
          {eyebrow}
        </p>
      )}
      <Tag id={id} className="script-title" data-reveal="mask">
        {title}
      </Tag>
      {subtitle && (
        <p className="section-heading__sub" data-reveal="fade" data-delay="0.15">
          {subtitle}
        </p>
      )}
      <div data-reveal="draw" data-delay="0.25" className="section-heading__divider">
        <Divider />
      </div>
    </header>
  );
}
