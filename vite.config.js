import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import config from "./src/config/weddingConfig.js";

const escapeHtml = (s = "") => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Fills SEO / Open Graph placeholders in index.html from weddingConfig.js. */
function weddingMeta() {
  const { share } = config;
  const base = (share.siteUrl || "").replace(/\/$/, "");
  const values = {
    WEDDING_TITLE: share.title,
    WEDDING_DESCRIPTION: share.description,
    // Absolute URL is required by WhatsApp/Facebook previews once deployed.
    WEDDING_IMAGE: `${base}${share.image}`,
    WEDDING_URL: base || "/",
  };
  return {
    name: "wedding-meta",
    transformIndexHtml(html) {
      return html.replace(/%(WEDDING_[A-Z]+)%/g, (_, key) => escapeHtml(values[key] ?? ""));
    },
  };
}

export default defineConfig({
  plugins: [react(), weddingMeta()],
  server: {
    port: 5174,
    strictPort: true,
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-dom/client", "scheduler"],
          gsap: ["gsap"],
          motion: ["framer-motion"],
        },
      },
    },
  },
});
