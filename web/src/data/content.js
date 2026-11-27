// ============================================================
//  SITE SETTINGS — edit these values to update the whole site
// ============================================================
export const SITE_URL = "https://sameersamriya04-art.github.io/luxury-stay-studio/";
export const EMAIL = "lss.propertymedia@gmail.com";

// WhatsApp: country code + number, digits only.
export const WHATSAPP_NUMBER = "916367142927";
export const WHATSAPP_DISPLAY = "+91 63671 42927";
export const WHATSAPP_MESSAGE = "Hello Luxury Stay Studio, I'd like to talk about a property film.";
export const whatsappLink = (text = WHATSAPP_MESSAGE) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Instagram: add your handle WITHOUT the @ (e.g. "luxurystaystudio").
// Leave empty ("") and the Instagram link stays hidden.
export const INSTAGRAM_HANDLE = "";

export const PDF = { href: "assets/docs/Luxury_Stay_Studio_Portfolio.pdf", label: "6 pages · 2.5 MB" };

export const NAV = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#signature", label: "Experience" },
  { href: "#process", label: "Process" },
  { href: "#reach", label: "Reach" },
  { href: "#contact", label: "Contact" },
];

// Responsive image helper: every image exists as -960.webp and -1920.webp
export const img = (name) => ({
  src: `assets/images/web/${name}-1920.webp`,
  srcSet: `assets/images/web/${name}-960.webp 960w, assets/images/web/${name}-1920.webp 1920w`,
});

export const PROJECTS = [
  {
    id: "art-of-escape",
    num: "01",
    title: "The Art of Escape",
    category: "Luxury Hospitality Concept Film",
    location: "Concept setting — not a real property",
    production: "AI-assisted",
    runtime: "0:41",
    video: "assets/video/the-art-of-escape.mp4",
    preview: "assets/video/preview-the-art-of-escape.mp4", // 10s silent loop shown inside the card
    poster: "assets/images/art-of-escape-poster.jpg",
    image: "aoe-terrace",
    alt: "Infinity pool terrace overlooking the sea at golden hour — still from The Art of Escape",
    description:
      "A conceptual visual exploration of elevated tropical hospitality, combining atmospheric imagery, cinematic pacing and immersive destination-inspired storytelling.",
  },
  {
    id: "villa-in-motion",
    num: "02",
    title: "Villa in Motion",
    category: "Luxury Villa Concept Film",
    location: "Concept setting — not a real property",
    production: "AI-assisted",
    runtime: "0:51",
    video: "assets/video/Villa_In_Motion_LSS_1080p24.mp4",
    preview: "assets/video/preview-villa-in-motion.mp4", // 10s silent loop shown inside the card
    poster: "assets/images/villa-in-motion-poster.jpg",
    image: "vim-sunset",
    alt: "Tropical stone and timber villa with an infinity pool at dusk — still from Villa in Motion",
    description:
      "A cinematic exploration of tropical villa living, featuring architectural reveals, sophisticated interiors, infinity-pool details and atmospheric outdoor spaces.",
  },
];

// Remote-first: LSS edits client-supplied media and creates AI-assisted
// concept work. It does not film on location or fly drones.
export const SERVICES = [
  {
    title: "Luxury Property Films",
    text: "Signature films edited from your property's photos and footage — architecture, light and the feeling of a stay.",
    image: "vim-living",
  },
  {
    title: "Aerial Footage Editing",
    text: "Your existing drone clips, graded and paced into sweeping cinematic reveals. We edit supplied aerial footage — we don't fly on location.",
    image: "aoe-night",
  },
  {
    title: "Hotel & Resort Marketing",
    text: "Campaign films and cut-downs for hotel and resort websites, launches and digital channels.",
    image: "aoe-firepit",
  },
  {
    title: "Real Estate Video Editing",
    text: "Polished edits of walkthroughs and listing footage for sales and rental platforms.",
    image: "vim-courtyard",
  },
  {
    title: "Social Media Cinematics",
    text: "Vertical reels for Instagram, TikTok and YouTube Shorts — paced to stop the scroll.",
    image: "vim-poollounge",
  },
  {
    title: "Visual Brand Storytelling",
    text: "Concept films and AI-assisted visuals that define the mood of your brand — always clearly disclosed.",
    image: "aoe-stone",
  },
];

export const PROCESS = [
  { title: "Discover", text: "We learn about your property, your guests and your goals — and review the photos and footage you already have." },
  { title: "Concept", text: "We shape the story, mood, pacing and music direction of the film before a single cut." },
  { title: "Create", text: "We craft the film remotely — editing, colour, sound and any clearly disclosed AI-assisted visuals." },
  { title: "Deliver", text: "Polished masters and cut-downs, ready for your website, listings and social channels." },
];

// Focus markets (where we want to work) — not a list of past clients.
export const MARKETS = [
  { name: "United Arab Emirates", short: "UAE", lat: 24.2, lon: 54.4 },
  { name: "Indonesia", short: "Indonesia", lat: -2.5, lon: 117.5 },
  { name: "Greece", short: "Greece", lat: 39.1, lon: 22.4 },
  { name: "Spain", short: "Spain", lat: 40.2, lon: -3.7 },
  { name: "Maldives", short: "Maldives", lat: 3.2, lon: 73.2 },
  { name: "France", short: "France", lat: 46.5, lon: 2.4 },
  { name: "Italy", short: "Italy", lat: 42.8, lon: 12.6 },
  { name: "United Kingdom", short: "UK", lat: 53.5, lon: -1.8 },
  { name: "United States", short: "USA", lat: 39.5, lon: -98.4 },
];
