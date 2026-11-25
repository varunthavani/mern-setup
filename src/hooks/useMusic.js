import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PREF_KEY = "wedding:music";

function getPref() {
  try {
    return sessionStorage.getItem(PREF_KEY);
  } catch {
    return null;
  }
}
function setPref(v) {
  try {
    sessionStorage.setItem(PREF_KEY, v);
  } catch {
    /* ignore */
  }
}

/**
 * Background music with Howler (Web Audio → smooth fades work on iOS too).
 * Playback only ever starts from a user gesture (`start()` is called from
 * the "Tap to open" handler or the floating toggle).
 * The guest's on/off choice is remembered for the browser session.
 */
export function useMusic(musicConfig) {
  const howlRef = useRef(null);
  const loadingRef = useRef(null);
  const resumeOnVisible = useRef(false);
  const [playing, setPlaying] = useState(false);
  const enabled = Boolean(musicConfig?.enabled && musicConfig?.src);

  const ensureHowl = useCallback(async () => {
    if (howlRef.current) return howlRef.current;
    if (!loadingRef.current) {
      loadingRef.current = import("howler").then(({ Howl }) => {
        howlRef.current = new Howl({
          src: [musicConfig.src],
          loop: true,
          volume: 0,
          html5: false,
          preload: true,
        });
        return howlRef.current;
      });
    }
    return loadingRef.current;
  }, [musicConfig?.src]);

  const fadeIn = useCallback(async () => {
    const howl = await ensureHowl();
    if (!howl.playing()) howl.play();
    howl.fade(howl.volume(), musicConfig.volume ?? 0.45, musicConfig.fadeMs ?? 2000);
    setPlaying(true);
  }, [ensureHowl, musicConfig?.volume, musicConfig?.fadeMs]);

  const fadeOut = useCallback(() => {
    const howl = howlRef.current;
    if (!howl) return;
    const ms = Math.min(1200, musicConfig.fadeMs ?? 1200);
    howl.fade(howl.volume(), 0, ms);
    howl.once("fade", () => {
      if (howl.volume() === 0) howl.pause();
    });
    setPlaying(false);
  }, [musicConfig?.fadeMs]);

  /** Called from the invitation tap: respects a previous "off" choice. */
  const start = useCallback(() => {
    if (!enabled || getPref() === "off") return;
    fadeIn();
  }, [enabled, fadeIn]);

  const toggle = useCallback(() => {
    if (!enabled) return;
    if (playing) {
      setPref("off");
      fadeOut();
    } else {
      setPref("on");
      fadeIn();
    }
  }, [enabled, playing, fadeIn, fadeOut]);

  // Pause politely when the tab is hidden, resume when visible again.
  useEffect(() => {
    const onVis = () => {
      const howl = howlRef.current;
      if (!howl) return;
      if (document.hidden && howl.playing()) {
        resumeOnVisible.current = true;
        howl.pause();
      } else if (!document.hidden && resumeOnVisible.current) {
        resumeOnVisible.current = false;
        howl.play();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => () => howlRef.current?.unload(), []);

  return useMemo(() => ({ enabled, playing, start, toggle }), [enabled, playing, start, toggle]);
}
