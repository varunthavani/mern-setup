import { lazy, Suspense, useEffect } from "react";
import { useApp } from "./context/AppContext.jsx";
import { visibleSections } from "./utils/content.js";
import { ScrollTrigger } from "./animations/gsap.js";
import Welcome from "./sections/Welcome.jsx";
import Blessings from "./sections/Blessings.jsx";
import Couple from "./sections/Couple.jsx";
import Family from "./sections/Family.jsx";
import ScratchReveal from "./sections/ScratchReveal.jsx";
import Countdown from "./sections/Countdown.jsx";
import Ceremonies from "./sections/Ceremonies.jsx";
import Timeline from "./sections/Timeline.jsx";
import LoveStory from "./sections/LoveStory.jsx";
import Venue from "./sections/Venue.jsx";
import SaveTheDate from "./sections/SaveTheDate.jsx";
import Rsvp from "./sections/Rsvp.jsx";
import Wishes from "./sections/Wishes.jsx";
import Invitees from "./sections/Invitees.jsx";
import Closing from "./sections/Closing.jsx";
import BottomNav from "./components/BottomNav.jsx";

// The gallery pulls in the lightbox & gesture code — load it on demand.
const Gallery = lazy(() => import("./sections/Gallery.jsx"));

const SECTIONS = {
  welcome: Welcome,
  blessings: Blessings,
  couple: Couple,
  family: Family,
  reveal: ScratchReveal,
  countdown: Countdown,
  ceremonies: Ceremonies,
  timeline: Timeline,
  story: LoveStory,
  gallery: Gallery,
  venue: Venue,
  saveTheDate: SaveTheDate,
  rsvp: Rsvp,
  wishes: Wishes,
  invitees: Invitees,
  closing: Closing,
};

export default function MainSite() {
  const { config, phase } = useApp();
  const ids = visibleSections(config).filter((id) => {
    if (id === "rsvp") return config.rsvp?.enabled !== false;
    if (id === "wishes") return config.wishes?.enabled !== false;
    return Boolean(SECTIONS[id]);
  });

  // Re-measure scroll animations once fonts and late images settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <main id="main" className="site" aria-hidden={phase !== "done" && phase !== "curtain" ? true : undefined}>
        {ids.map((id) => {
          const Section = SECTIONS[id];
          return (
            <Suspense key={id} fallback={<section id={id} className="section section--loading" />}>
              <Section />
            </Suspense>
          );
        })}
        <footer className="site-footer">
          <p>
            {config.couple.hashtag} · <span lang="gu">શુભ વિવાહ</span>
          </p>
        </footer>
      </main>
      {phase === "done" && <BottomNav sections={ids} />}
    </>
  );
}
