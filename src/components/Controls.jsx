import { Music2, VolumeX } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

/** Floating language switcher + music toggle (top-right). */
export default function Controls() {
  const { lang, setLang, t, music, config } = useApp();
  return (
    <div className="controls">
      {config.language.available.length > 1 && (
        <div className="lang-switch" role="group" aria-label={t("language")}>
          {config.language.available.map((l) => (
            <button key={l} type="button" className={lang === l ? "is-active" : ""} aria-pressed={lang === l} onClick={() => setLang(l)} lang={l}>
              {l === "gu" ? "ગુ" : "EN"}
            </button>
          ))}
        </div>
      )}
      {music.enabled && (
        <button
          type="button"
          className={`music-toggle ${music.playing ? "is-playing" : ""}`}
          onClick={music.toggle}
          aria-pressed={music.playing}
          aria-label={music.playing ? t("musicOff") : t("musicOn")}
          title={music.playing ? t("musicOff") : t("musicOn")}
        >
          {music.playing ? (
            <span className="eq" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          ) : (
            <VolumeX size={18} aria-hidden="true" />
          )}
          <Music2 size={12} className="music-toggle__note" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
