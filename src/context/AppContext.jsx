import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import config from "../config/weddingConfig.js";
import translations from "../config/translations.js";
import { pick } from "../utils/content.js";
import { useMusic } from "../hooks/useMusic.js";
import { useReducedMotion } from "../hooks/useReducedMotion.js";

const AppContext = createContext(null);

const LANG_KEY = "wedding:lang";
const INTRO_KEY = "wedding:intro";

function readStorage(store, key) {
  try {
    return window[store].getItem(key);
  } catch {
    return null;
  }
}
function writeStorage(store, key, value) {
  try {
    window[store].setItem(key, value);
  } catch {
    /* storage unavailable (private mode) — ignore */
  }
}

function detectQuality() {
  const pref = config.animation.quality;
  if (pref === "full" || pref === "lite") return pref;
  const nav = typeof navigator !== "undefined" ? navigator : {};
  const lowCpu = (nav.hardwareConcurrency || 8) <= 4;
  const lowMem = (nav.deviceMemory || 8) <= 4;
  const saveData = nav.connection?.saveData;
  return saveData || (lowCpu && lowMem) ? "lite" : "full";
}

/**
 * Intro phases:
 *  "cover"   – closed invitation card is showing
 *  "opening" – flaps are opening (curtains behind)
 *  "curtain" – silk curtains are parting
 *  "done"    – the invitation site is visible and scrollable
 */
export function AppProvider({ children }) {
  const reducedMotion = useReducedMotion();
  const [lang, setLangState] = useState(() => {
    const saved = readStorage("localStorage", LANG_KEY);
    return config.language.available.includes(saved) ? saved : config.language.default;
  });
  // The cinematic intro plays once per browser session; reloads go straight
  // to the revealed palace.
  const [phase, setPhase] = useState(() =>
    config.animation.showIntro && readStorage("sessionStorage", INTRO_KEY) !== "seen" ? "cover" : "done"
  );
  const [introRun, setIntroRun] = useState(0);
  const quality = useMemo(() => (reducedMotion ? "lite" : detectQuality()), [reducedMotion]);
  const music = useMusic(config.music);

  useEffect(() => {
    if (phase === "done") writeStorage("sessionStorage", INTRO_KEY, "seen");
  }, [phase]);

  // When the intro was skipped for this session there is no "tap to open"
  // gesture, so music starts on the guest's first interaction instead
  // (browsers block audio before one). A previous "off" choice is respected
  // inside music.start(), and taps on the controls are left to the toggle.
  const musicStart = music.start;
  const [startedRevealed] = useState(() => phase === "done");
  const introSkipped = startedRevealed && introRun === 0;
  useEffect(() => {
    if (!introSkipped) return undefined;
    const onFirst = (e) => {
      if (e.target?.closest?.(".controls")) return;
      cleanup();
      musicStart();
    };
    const events = ["pointerdown", "keydown"];
    const cleanup = () => events.forEach((n) => window.removeEventListener(n, onFirst, true));
    events.forEach((n) => window.addEventListener(n, onFirst, true));
    return cleanup;
  }, [introSkipped, musicStart]);

  const setLang = useCallback((l) => {
    setLangState(l);
    writeStorage("localStorage", LANG_KEY, l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "gu" ? "gu" : "en";
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  // Lock scrolling while the intro overlay is showing.
  useEffect(() => {
    const locked = phase !== "done";
    document.documentElement.classList.toggle("is-locked", locked);
  }, [phase]);

  const t = useCallback(
    (key, vars) => {
      const node = key.split(".").reduce((o, k) => o?.[k], translations);
      let s = pick(node, lang) || key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
      return s;
    },
    [lang]
  );
  const tx = useCallback((value) => pick(value, lang), [lang]);

  const replay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setIntroRun((n) => n + 1);
    setPhase(config.animation.showIntro ? "cover" : "done");
  }, []);

  const value = useMemo(
    () => ({ config, lang, setLang, t, tx, phase, setPhase, introRun, replay, reducedMotion, quality, music }),
    [lang, setLang, t, tx, phase, introRun, replay, reducedMotion, quality, music]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export { readStorage, writeStorage };
