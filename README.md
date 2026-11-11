# Luxury Stay Studio — Official Website

**We Turn Properties Into Experiences.** · PROPERTY CINEMATICS
Contact: lss.propertymedia@gmail.com

This is a simple, fast website made only with HTML, CSS and JavaScript.
It needs no build tools, no paid services and no server code.

---

## What's in this folder

| File / folder | What it does |
|---|---|
| `index.html` | The website's content: all the text, sections and links |
| `css/style.css` | The design: colours, fonts, spacing, animations and the phone layout |
| `js/main.js` | The behaviour: phone menu, scroll animations, video player, contact form |
| `assets/logo/lss-logo.png` | Your logo (transparent background) |
| `assets/logo/favicon.svg` | The small icon in the browser tab |
| `assets/video/the-art-of-escape.mp4` | Your *The Art of Escape* film |
| `assets/images/` | Photos used on the page |
| `.nojekyll` | Tells GitHub Pages to show the site exactly as-is |

## See the website on your computer

Double-click `index.html` and it opens in your browser. That's it.

## Put the website online for free (GitHub Pages)

1. On GitHub, open this repository and click **Settings**.
2. In the left menu, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Choose your branch (for example `main`), choose the folder `/ (root)`, and click **Save**.
5. Wait 1–2 minutes. GitHub then shows your website address
   (it looks like `https://your-username.github.io/luxury-stay-studio/`).

## Common changes

**Change any text:** open `index.html` and edit the words between the tags.
Each section is marked with a comment like `<!-- ============ 3. SERVICES ============ -->`.

**Replace the logo:** save your original logo as a PNG with a transparent background,
name it `lss-logo.png`, and replace the file in `assets/logo/`.
(The current logo was cut from the last frame of your video. Your original file will look sharper.)

**Replace the video:** put your new film in `assets/video/` with the name
`the-art-of-escape.mp4`. If the file is ever missing, the site shows a neat
"Video coming soon" box instead of an error. Keep videos under about 50 MB
(GitHub refuses files over 100 MB).

**Replace the video cover image:** replace `assets/images/art-of-escape-poster.jpg`.

**Replace photos:** replace the files in `assets/images/` and keep the same names,
or change the `src="..."` in `index.html`.

**Change colours:** at the top of `css/style.css`:
`--black: #111111;` `--gold: #C6A46A;` `--white: #F5F1E9;`

**Change your services:** they're in `index.html` under `3. SERVICES`.
Edit them so they match exactly what you offer.

## How the contact form works

The form costs nothing and needs no server. When a visitor presses **Send Enquiry**,
their own email app opens with your address and their message already filled in,
and they press Send. Nothing is stored on the website.

## Honesty notes

- *The Art of Escape* is clearly labelled everywhere as an **AI-assisted conceptual
  project, not a real client project**.
- The site has no made-up clients, testimonials, awards or numbers. When you have real
  client projects, you can add them in the Portfolio section.
