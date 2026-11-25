# Rakesh & Pooja — Cinematic Gujarati Wedding Invitation

A static React (Vite) website. It plays like opening a luxury printed invitation: the embossed sage‑green card unseals, silk curtains part onto a royal garden, and the guest scrolls through blessings, rituals, the schedule, venue, RSVP and a closing scene. It works in Gujarati and English.

> ⚠️ Names, dates, venues and phone numbers are **sample content** taken from the design mock‑ups.
> Replace them in [`src/config/weddingConfig.js`](src/config/weddingConfig.js) before sharing.

## Requirements

Node.js 18 or newer, with npm. There is no backend or database: it is a single-page static site.

## Install & run

```bash
npm install        # install dependencies
npm run dev        # start the dev server → http://localhost:5174
```

## Build for production

```bash
npm run build      # outputs the static site to dist/
npm run preview    # serve dist/ locally to check it → http://localhost:4173
```

`dist/` contains plain HTML, CSS, JS and assets. Upload that folder to any static host.

## Other scripts

| Command | What it does |
| --- | --- |
| `npm run assets` | Regenerates all artwork plus the share image and favicon (run after changing names or initials) |
| `npm run music` | Re-renders the instrumental as `mangal-dhun.wav`; encode it to MP3 to replace `public/assets/music/mangal-dhun.mp3` |

## Deployment

The site expects to be served from the **root of a domain** (e.g. `https://rakesh-weds-pooja.netlify.app/`), because assets are referenced as `/assets/…`.

* **Netlify:** build command `npm run build`, publish directory `dist`. You can also drag the `dist` folder onto app.netlify.com/drop.
* **Vercel:** import the repository; the Vite preset is detected (build `npm run build`, output `dist`).
* **Cloudflare Pages:** framework preset *Vite*, build command `npm run build`, output `dist`.
* **GitHub Pages:** use a user/organisation site (`username.github.io`) or a custom domain, so the site sits at the domain root. A project sub-path such as `/repo-name/` is not supported without changing the asset paths.

After deploying, set `share.siteUrl` in the config to the live address and rebuild, so WhatsApp and Facebook link previews show the image.

## Customising (no component edits needed)

Everything lives in **`src/config/weddingConfig.js`**:

| What | Where in the config |
| --- | --- |
| Names, initials, parents, couple photo | `couple` |
| Main muhurat, timezone, main venue | `wedding` |
| Default language | `language.default` (`"gu"` or `"en"`) |
| Show / hide / reorder sections | `sections.order`, `sections.hidden` |
| Shloka & divine symbol | `blessings` |
| Family invitation text and names | `family` |
| Ceremonies: enable, rename, reorder, confirm | `ceremonies[]` |
| Venues (several allowed) | `venues` |
| Love story milestones | `story.milestones` |
| Gallery photos | `gallery.images` |
| WhatsApp number for RSVP & wishes | `rsvp.whatsappNumber`, `wishes.whatsappNumber` |
| Invitee groups (નિમંત્રક, દર્શનાભિલાષી …) | `invitees` |
| Music file & volume | `music` |
| Colour palette | `theme` |
| Animation options (intro, petals, confetti, quality) | `animation` |
| Page title, description, share text, site URL | `share` |

Every text field accepts a plain string or `{ en: "…", gu: "…" }`. Interface labels such as buttons and headings live in `src/config/translations.js`.

### Ceremonies
* `enabled: false` hides a ritual everywhere.
* `confirmed: false` shows the ritual with "Details to be shared soon". It also keeps it out of the schedule, the calendar export and the RSVP choices, so nothing unconfirmed appears final.
* `art` picks one of 17 original illustrations. `theme` picks a palette: `kumkum`, `divine`, `marigold`, `agni`, `mehndi`, `haldi`, `rose`, `garba`, `royal`, `sacred`, `dusk`.

### Photos
Put images in `public/assets/…` and reference them as `/assets/…`. Use WebP, about 1600 px on the long side.
* Couple photo: `couple.couplePhoto`. Until you set one, an illustrated bride and groom is shown.
* Gallery: replace the `placeholder-*.svg` entries and keep `width` / `height` accurate.
* Story: `story.milestones[].photo`.

### After changing names or initials
Run `npm run assets` once. This regenerates the WhatsApp / Open Graph preview image (`public/og-image.jpg`) and the favicon with the new names. Once you know your hosting address, set `share.siteUrl` so previews use absolute URLs.

## How it works

* **Intro.** Scene 01: the card is built from separate layers (two flaps with ivory backs, a split gold seal, the light inside) and opens in 3D with GSAP. Scene 02: two silk curtain panels part over the Welcome stage, which is already mounted underneath. Guests can skip the intro (button or `Esc`). With *prefers‑reduced‑motion* the intro becomes simple fades.
* **Music** starts only from the "Tap to open" gesture. It uses Howler (Web Audio), so fades also work on iOS. It pauses in background tabs, and the on/off choice is remembered for the session.
* **Scratch card.** HTML canvas with pointer and touch support. It completes automatically once `reveal.revealPercent` is scratched, then fires confetti. A "Tap to reveal" button is the accessible alternative.
* **Countdown** uses `wedding.date`, `wedding.time` and `wedding.timezone`. After the moment passes it shows the celebration message instead of negative numbers.
* **Calendar.** Google and Outlook links plus downloadable `.ics` files, for the main event or every confirmed event. Times are converted to UTC from the configured timezone.
* **RSVP & wishes** open WhatsApp with a pre‑written message. Nothing is stored on a server, and the page says so. `rsvp.externalFormUrl` can point to a Google Form or similar.
* **Performance.** The cover artwork is preloaded. The rest of the site loads in the background while the card is closed. The gallery, confetti and audio code load on demand. Particles pause off‑screen and are reduced on low‑power devices. Images are WebP with `srcset`.

## Project structure

```
index.html                   SEO / Open Graph placeholders (filled from the config at build time)
vite.config.js               Vite setup + the plugin that injects the page title / meta tags
public/
  favicon.svg, apple-touch-icon.png, og-image.jpg
  assets/                    invitation/ curtains/ backgrounds/ decorations/ gallery/ music/
scripts/
  build-assets.mjs           renders all artwork → WebP (npm run assets)
  art/                       procedural artwork (SVG generators)
  generate-music.mjs         composes the instrumental (npm run music)
src/
  main.jsx, App.jsx          entry point: fonts, theme, intro + lazily loaded site
  MainSite.jsx               renders the sections in the configured order
  config/                    weddingConfig.js (all content), translations.js (UI labels)
  context/AppContext.jsx     language, intro phase, music, performance tier
  sections/                  one file per scene: intro/, Welcome, Blessings, Couple, Family,
                             ScratchReveal, Countdown, Ceremonies, Timeline, LoveStory, Gallery,
                             Venue, SaveTheDate, Rsvp, Wishes, Invitees, Closing
  components/                Ornaments, Drapery, Particles, BottomNav, Controls, SectionHeading,
                             SplitText, art/ (ceremony illustrations, divine elements, couple)
  animations/                GSAP setup + scroll-reveal hook
  hooks/                     countdown, music, in-view, reduced motion
  utils/                     time zones, calendar (ICS/Google/Outlook), links, confetti
  styles/                    base, intro, sections, ceremonies
```

The asset sources and licences are documented in [`ASSETS.md`](ASSETS.md).
