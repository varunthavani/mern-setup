import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted fonts (only the weights/subsets actually used).
import "@fontsource/great-vibes/latin-400.css";
import "@fontsource/cinzel/latin-400.css";
import "@fontsource/cinzel/latin-600.css";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/noto-serif-gujarati/gujarati-400.css";
import "@fontsource/noto-serif-gujarati/gujarati-600.css";
import "@fontsource/hind-vadodara/gujarati-400.css";
import "@fontsource/hind-vadodara/gujarati-500.css";

import "./styles/base.css";
import "./styles/intro.css";
import "./styles/sections.css";
import "./styles/ceremonies.css";

import config from "./config/weddingConfig.js";
import App from "./App.jsx";

// Apply the configurable colour theme as CSS custom properties.
const toKebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
for (const [k, v] of Object.entries(config.theme || {})) {
  document.documentElement.style.setProperty(`--c-${toKebab(k)}`, v);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
