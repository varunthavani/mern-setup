import { useEffect, useRef, useState } from "react";
import { BookHeart, CalendarCheck, CalendarDays, Flower2, Home, Images, ListOrdered, MapPin, MailOpen, Send, Users, Heart } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const ITEMS = [
  { id: "welcome", key: "home", Icon: Home },
  { id: "couple", key: "couple", Icon: Heart },
  { id: "family", key: "family", Icon: Users },
  { id: "ceremonies", key: "ceremonies", Icon: Flower2 },
  { id: "timeline", key: "timeline", Icon: ListOrdered },
  { id: "story", key: "story", Icon: BookHeart },
  { id: "gallery", key: "gallery", Icon: Images },
  { id: "venue", key: "venue", Icon: MapPin },
  { id: "saveTheDate", key: "saveTheDate", Icon: CalendarDays },
  { id: "rsvp", key: "rsvp", Icon: CalendarCheck },
  { id: "wishes", key: "wishes", Icon: Send },
  { id: "closing", key: "closing", Icon: MailOpen },
];

/** Sticky bottom section navigation with scroll-spy. */
export default function BottomNav({ sections }) {
  const { t } = useApp();
  const items = ITEMS.filter((it) => sections.includes(it.id));
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef(null);

  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.join(",")]);

  // keep the active item visible in the scrollable bar
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector(`[data-id="${active}"]`);
    if (!list || !el || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const go = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="bottom-nav" aria-label={t("sectionNav")}>
      <ul ref={listRef}>
        {items.map(({ id, key, Icon }) => (
          <li key={id} data-id={id}>
            <a href={`#${id}`} onClick={go(id)} className={active === id ? "is-active" : ""} aria-current={active === id ? "true" : undefined}>
              <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
              <span>{t(`nav.${key}`)}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
