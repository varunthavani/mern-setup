import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { useReveal } from "../animations/useReveal.js";
import SectionHeading from "../components/SectionHeading.jsx";

function Lightbox({ images, index, onClose, onNav, tx, t }) {
  const img = images[index];
  const closeRef = useRef(null);
  const [dir, setDir] = useState(0);

  const nav = useCallback(
    (d) => {
      setDir(d);
      onNav((index + d + images.length) % images.length);
    },
    [index, images.length, onNav]
  );

  useEffect(() => {
    const prevFocus = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nav(1);
      if (e.key === "ArrowLeft") nav(-1);
      if (e.key === "Tab") {
        // keep focus inside the dialog
        const f = [...document.querySelectorAll(".lightbox button")];
        const i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("is-modal");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("is-modal");
      prevFocus?.focus?.();
    };
  }, [nav, onClose]);

  return (
    <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={tx(img.alt)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <button ref={closeRef} type="button" className="lightbox__close" onClick={onClose} aria-label={t("closeLabel")}>
        <X aria-hidden="true" />
      </button>
      <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={(e) => (e.stopPropagation(), nav(-1))} aria-label={t("previous")}>
        <ChevronLeft aria-hidden="true" />
      </button>
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.img
          key={img.src}
          src={img.src}
          alt={tx(img.alt)}
          className="lightbox__img"
          custom={dir}
          initial={{ opacity: 0, x: dir * 80, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: dir * -80, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -400) nav(1);
            else if (info.offset.x > 60 || info.velocity.x > 400) nav(-1);
          }}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      </AnimatePresence>
      <button type="button" className="lightbox__nav lightbox__nav--next" onClick={(e) => (e.stopPropagation(), nav(1))} aria-label={t("next")}>
        <ChevronRight aria-hidden="true" />
      </button>
      <p className="lightbox__count">
        {index + 1} / {images.length}
      </p>
    </motion.div>
  );
}

/** Scene 11 — editorial masonry gallery with a swipeable lightbox. */
export default function Gallery() {
  const { config, t, tx, lang } = useApp();
  const ref = useRef(null);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(-1);
  const { categories, images } = config.gallery;
  const shown = useMemo(() => (filter === "all" ? images : images.filter((i) => i.category === filter)), [filter, images]);
  const hasPlaceholders = images.some((i) => i.src.includes("placeholder"));
  useReveal(ref, [filter, lang]);

  return (
    <section ref={ref} id="gallery" className="section gallery" aria-labelledby="gallery-title">
      <SectionHeading id="gallery-title" title={t("sections.gallery")} />
      <div className="chips" role="tablist" aria-label={t("sections.gallery")}>
        {[{ id: "all", label: t("all") }, ...categories.map((c) => ({ id: c.id, label: tx(c.label) }))].map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={filter === c.id} className={`chip ${filter === c.id ? "is-active" : ""}`} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      <ul className="masonry">
        {shown.map((img) => {
          const i = images.indexOf(img);
          return (
            <li key={img.src} data-reveal="clip">
              <button type="button" className="masonry__item" onClick={() => setOpen(i)} aria-label={tx(img.alt)}>
                <img src={img.src} alt={tx(img.alt)} width={img.width} height={img.height} loading="lazy" decoding="async" />
              </button>
            </li>
          );
        })}
      </ul>
      {hasPlaceholders && <p className="note">{t("placeholderNote")}</p>}
      <AnimatePresence>{open >= 0 && <Lightbox images={images} index={open} onClose={() => setOpen(-1)} onNav={setOpen} tx={tx} t={t} />}</AnimatePresence>
    </section>
  );
}
