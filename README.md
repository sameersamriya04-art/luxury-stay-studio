# Luxury Stay Studio — Official Website (v2, immersive 3D)

**Where luxury becomes cinematic.** · PROPERTY CINEMATICS
Live site: https://sameersamriya04-art.github.io/luxury-stay-studio/
Contact: lss.propertymedia@gmail.com · WhatsApp +91 63671 42927

Built with React, Vite, Three.js / React Three Fiber, GSAP + ScrollTrigger,
Lenis smooth scrolling, Framer Motion, Tailwind CSS and Lucide icons.

---

## How the project is organised

| Folder / file | What it is |
|---|---|
| `web/` | **The source code** — this is what you edit |
| `web/src/data/content.js` | **All site settings & text lists**: email, WhatsApp, Instagram, projects, services, process steps, markets |
| `web/src/components/` | One file per section (Hero, Work, Services, Signature, Process, Reach, FinalCTA, Footer…) |
| `web/src/three/` | The 3D scenes (hero villa scene, globe) |
| `index.html` + `bundle/` (repo root) | **The built website** that GitHub Pages serves. Generated — don't edit by hand |
| `assets/images/web/` | Optimised WebP images (960px for phones, 1920px for large screens) |
| `assets/video/` | The two concept films |
| `assets/docs/Luxury_Stay_Studio_Portfolio.pdf` | The downloadable portfolio |
| `assets/logo/` | Logo and favicon |

## Making changes (on a computer)

You need [Node.js](https://nodejs.org) (version 18 or newer) installed once.

```bash
cd web
npm install        # first time only
npm run dev        # live preview at http://localhost:5173 while you edit
npm run build      # builds the final site into the repo root (index.html + bundle/)
```

Then commit and push everything (including `index.html` and `bundle/`).
GitHub Pages updates the live site automatically within 1–2 minutes.

> Editing the root `index.html` directly won't stick — `npm run build` regenerates it.
> Edit files in `web/` instead.

### Common edits — all in `web/src/data/content.js`

- **Add your Instagram:** set `INSTAGRAM_HANDLE = "yourhandle"` (without the @). The footer link appears automatically.
- **Change WhatsApp:** `WHATSAPP_NUMBER` (digits with country code) and `WHATSAPP_DISPLAY`.
- **Change email:** `EMAIL`.
- **Edit services, process steps, markets or project text:** edit the lists in the same file.

## Deployment (GitHub Pages)

No special setup is needed. Pages is set to **Deploy from a branch → `/ (root)`**, and the
build writes the finished site straight into the root (`index.html`, `bundle/`, `.nojekyll`).

## Performance & accessibility

- The 3D code (Three.js) only downloads on devices that will use it. Phones with little memory,
  visitors who prefer reduced motion, and browsers without WebGL get a static cinematic image
  and a flat dotted world map instead.
- 3D scenes pause automatically when scrolled out of view.
- Phones download the smaller 960px images.
- "Reduce motion" settings are respected (no smooth scrolling, pinning or 3D).
- Visitors without JavaScript still see the films, PDF link, email and WhatsApp.

## Honesty notes

- *The Art of Escape* and *Villa in Motion* are labelled everywhere as **AI-assisted concept
  projects, not commissioned client work**. Site imagery comes from these concept films.
- LSS is presented as **remote-first**: clients supply photos and footage; LSS edits, grades,
  adds sound and creates disclosed AI-assisted concept work. "Aerial Footage Editing" means
  editing client-supplied drone clips — the site states that LSS does not film on location or fly drones.
- The markets in Global Reach are **focus markets**, not a list of past clients.
- No testimonials, client names, awards or results are shown.
