import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight, Download, Play } from "lucide-react";
import { gsap } from "../lib/smooth";
import { prefersReducedMotion, isLowPower } from "../lib/env";
import { PROJECTS, PDF } from "../data/content";
import Img from "./Img";
import Magnetic from "./Magnetic";
import VideoModal from "./VideoModal";
import { onAnchorClick } from "./Header";

// Silent looping preview that plays inside the card while it's on screen.
// (The full film with sound opens in the player when the card is clicked.)
function usePreview(ref, src) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v || !src || prefersReducedMotion() || isLowPower() || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.src) { v.muted = true; v.setAttribute("muted", ""); v.src = src; v.load(); }
          const pr = v.play();
          if (pr && pr.catch) pr.catch(() => {}); // autoplay refused: the still image stays
        } else if (!v.paused) v.pause();
      },
      { rootMargin: "0px 200px 0px 200px", threshold: 0.15 }
    );
    io.observe(v.parentElement);
    const on = () => setPlaying(true);
    v.addEventListener("playing", on);
    return () => { io.disconnect(); v.removeEventListener("playing", on); v.pause(); };
  }, [ref, src]);
  return playing;
}

function ProjectCard({ p, onPlay }) {
  const preview = useRef(null);
  const previewPlaying = usePreview(preview, p.preview);
  return (
    <article className="work-card group relative flex w-full shrink-0 flex-col lg:w-[56vw] lg:max-w-[1000px]">
      <button
        type="button"
        onClick={() => onPlay(p)}
        data-cursor="Play"
        className="relative block aspect-[16/10] w-full overflow-hidden bg-charcoal lg:aspect-[16/9]"
        aria-label={`Play ${p.title} — ${p.runtime} film`}
      >
        <div className="work-img absolute inset-0 scale-[1.12] transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.18]">
          <Img name={p.image} alt={p.alt} sizes="(min-width: 1024px) 56vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
          <video
            ref={preview}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-luxe ${previewPlaying ? "opacity-100" : "opacity-0"}`}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" aria-hidden="true" />
        <span className="chip absolute left-4 top-4">AI-assisted concept</span>
        <span className="absolute bottom-4 right-4 bg-ink/70 px-2.5 py-1 text-[11px] tracking-[0.14em]">{previewPlaying ? "Preview · " : ""}Full film {p.runtime}</span>
        <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory/70 text-ivory backdrop-blur-sm transition-all duration-500 ease-luxe group-hover:scale-110 group-hover:border-gold group-hover:bg-gold group-hover:text-ink lg:[@media(hover:hover)]:opacity-0 lg:group-hover:opacity-100">
          <Play size={22} fill="currentColor" className="ml-1" aria-hidden="true" />
        </span>
      </button>
      <div className="mt-6 grid gap-4 lg:grid-cols-[auto_1fr] lg:gap-8">
        <span className="font-serif text-[64px] font-light italic leading-[0.8] text-gold lg:text-[88px]" aria-hidden="true">{p.num}</span>
        <div>
          <h3 className="font-serif text-[clamp(32px,3.6vw,52px)] font-light uppercase leading-none tracking-[0.04em]">{p.title}</h3>
          <dl className="mt-4 grid gap-x-8 gap-y-2 text-[11px] uppercase tracking-wide2 sm:grid-cols-3">
            <div><dt className="text-gold">Category</dt><dd className="mt-1 text-ivory/70">{p.category}</dd></div>
            <div><dt className="text-gold">Location</dt><dd className="mt-1 text-ivory/70">{p.location}</dd></div>
            <div><dt className="text-gold">Production</dt><dd className="mt-1 text-ivory/70">{p.production}</dd></div>
          </dl>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ivory/60">{p.description}</p>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const root = useRef(null);
  const track = useRef(null);
  const [playing, setPlaying] = useState(null);
  const close = useCallback(() => setPlaying(null), []);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Desktop: pinned horizontal gallery
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(), ease: "none",
          scrollTrigger: {
            trigger: root.current, start: "top top", end: () => "+=" + distance(),
            pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          },
        });
        // Each image drifts inside its frame and tilts slightly in perspective
        gsap.utils.toArray(".work-card").forEach((card) => {
          const pic = card.querySelector(".work-img");
          if (pic) gsap.fromTo(pic, { xPercent: 6 }, {
            xPercent: -6, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
          gsap.fromTo(card, { rotationY: -8, opacity: 0.55 }, {
            rotationY: 0, opacity: 1, ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "left 45%", scrub: true },
          });
        });
      });
      // Mobile / tablet: vertical cards with clip reveals
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray(".work-card button").forEach((media) => {
          const card = media.closest(".work-card");
          gsap.fromTo(media, { clipPath: "inset(12% 8% 12% 8%)" }, {
            clipPath: "inset(0% 0% 0% 0%)", ease: "none",
            scrollTrigger: { trigger: card, start: "top 92%", end: "top 45%", scrub: true },
          });
        });
      });
    }, root);
    return () => { ctx.revert(); mm.revert(); };
  }, []);

  return (
    <section ref={root} id="work" className="relative overflow-hidden bg-charcoal lg:h-[100svh]" aria-labelledby="work-title">
      <div ref={track} className="work-track flex flex-col gap-20 px-5 py-[14vh] sm:px-8 lg:h-full lg:flex-row lg:items-center lg:gap-[6vw] lg:px-[8vw] lg:py-0" style={{ perspective: "1600px" }}>
        {/* Intro panel */}
        <div className="flex shrink-0 flex-col justify-center lg:w-[30vw] lg:max-w-[460px]">
          <p className="eyebrow mb-6 flex items-center gap-4"><span className="h-px w-10 bg-gold" aria-hidden="true" />Selected Work</p>
          <h2 id="work-title" className="display text-[clamp(48px,6vw,96px)]">Concept<br /><em className="text-gold">Films</em></h2>
          <p className="mt-6 text-[16px] leading-relaxed text-ivory/65">
            Two AI-assisted concept films created by Luxury Stay Studio to demonstrate our cinematic style.
            They are not commissioned client work — future client commissions will be clearly labelled as such.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Magnetic>
              <a href={PDF.href} download className="btn btn-ghost w-full border-gold text-gold hover:bg-gold hover:text-ink">
                <Download size={15} aria-hidden="true" /> Portfolio PDF
                <span className="text-[9px] opacity-70">{PDF.label}</span>
              </a>
            </Magnetic>
          </div>
          <p className="mt-8 hidden text-[10px] uppercase tracking-luxe text-ivory/40 lg:block">Scroll to explore →</p>
        </div>

        {PROJECTS.map((p) => <ProjectCard key={p.id} p={p} onPlay={setPlaying} />)}

        {/* Your property — next */}
        <article className="work-card flex shrink-0 flex-col justify-center border border-line p-8 lg:h-[64vh] lg:w-[34vw] lg:max-w-[560px] lg:p-12">
          <span className="font-serif text-[64px] font-light italic leading-none text-gold/60 lg:text-[88px]" aria-hidden="true">03</span>
          <h3 className="mt-6 font-serif text-[clamp(32px,3.4vw,48px)] font-light leading-tight">Your property,<br /><em className="text-gold">its own film.</em></h3>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ivory/60">Send us your photos and footage — we'll shape them into a cinematic experience.</p>
          <Magnetic className="mt-8 self-start">
            <a href="#contact" onClick={(e) => onAnchorClick(e, "#contact")} className="btn btn-gold">
              Create Your Property Film <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </Magnetic>
        </article>
      </div>
      <VideoModal project={playing} onClose={close} />
    </section>
  );
}
