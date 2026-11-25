import { lazy, Suspense } from "react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import Intro from "./sections/intro/Intro.jsx";
import Controls from "./components/Controls.jsx";
import SvgDefs from "./components/art/SvgDefs.jsx";

// The full invitation loads in the background while the guest sees the
// closed card, so the very first paint only needs the cover assets.
const MainSite = lazy(() => import("./MainSite.jsx"));

function Shell() {
  const { phase } = useApp();
  return (
    <>
      <SvgDefs />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Suspense fallback={null}>
        <MainSite />
      </Suspense>
      <Intro />
      {phase !== "opening" && <Controls />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
