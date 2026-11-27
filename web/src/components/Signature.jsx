import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/smooth";
import { prefersReducedMotion } from "../lib/env";
import Img from "./Img";

const BEATS = [
  { word: "Light", text: "Golden hour, captured in every frame — the warmth that makes a stay feel like an escape." },
  { word: "Space", text: "Architecture revealed slowly, so guests understand the scale and flow of every room." },
  { word: "Atmosphere", text: "Texture, water, stone and timber — the quiet details that make a property unforgettable." },
  { word: "Story", text: "Every edit has a beginning, a reveal and a feeling that stays long after the film ends." },
];

export default function Signature() {
  const root = useRef(null);
  const [reduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const build = (desktop) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current, start: "top top", end: () => "+=" + window.innerHeight * (desktop ? 3 : 2.4),
            pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
          },
        });
        if (desktop) {
          // Desktop: the image opens from a framed window to full-bleed while the camera pushes in
          tl.fromTo(".sig-frame", { clipPath: "inset(22% 26% 22% 26%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0)
            .fromTo(".sig-img", { scale: 1.3 }, { scale: 1.0, duration: 4 }, 0)
            .fromTo(".sig-shade", { opacity: 0.05 }, { opacity: 0.5, duration: 1 }, 0.6)
            .fromTo(".sig-title", { autoAlpha: 1 }, { autoAlpha: 0, y: -40, duration: 0.5 }, 0.5);
        } else {
          // Phones: the photo stays in a sharp landscape frame (never stretched to the tall screen)
          tl.fromTo(".sig-frame", { clipPath: "inset(12% 14% 12% 14%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0)
            .fromTo(".sig-img", { scale: 1.18 }, { scale: 1.0, duration: 4 }, 0);
        }
        // Synchronised words: each fades in, holds, then hands over to the next
        gsap.utils.toArray(".sig-beat").forEach((beat, i) => {
          const start = (desktop ? 1.1 : 0.6) + i * 0.75;
          tl.fromTo(beat, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.3 }, start);
          tl.fromTo(`.sig-dot-${i}`, { scaleX: 0 }, { scaleX: 1, duration: 0.75 }, start);
          if (i < BEATS.length - 1) tl.to(beat, { autoAlpha: 0, y: -50, duration: 0.3 }, start + 0.6);
        });
      };
      mm.add("(min-width: 1024px)", () => build(true));
      mm.add("(max-width: 1023px)", () => build(false));
    }, root);
    return () => { ctx.revert(); mm.revert(); };
  }, [reduced]);

  return (
    <section
      ref={root}
      id="signature"
      className={`relative flex flex-col overflow-hidden bg-ink lg:block ${reduced ? "min-h-[100svh] py-[12vh]" : "h-[100svh] min-h-[620px]"}`}
      aria-labelledby="signature-title"
    >
      {/* Image: a sharp landscape frame on phones, full-bleed on large screens */}
      <div className="sig-frame relative order-2 mx-5 mt-6 aspect-[4/3] shrink-0 overflow-hidden sm:mx-8 lg:absolute lg:inset-0 lg:m-0 lg:aspect-auto">
        <Img
          name="aoe-stone"
          sizes="100vw"
          alt="Stone villa with tall arched windows, cypress and olive trees at golden hour — still from The Art of Escape"
          className="sig-img h-full w-full object-cover object-[55%_center]"
        />
        <div className={`sig-shade absolute inset-0 bg-ink ${reduced ? "lg:opacity-50" : ""} opacity-0`} aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent lg:hidden" aria-hidden="true" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/80 via-ink/30 to-transparent lg:block" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 hidden h-1/2 bg-gradient-to-t from-ink/70 to-transparent lg:block" aria-hidden="true" />
      </div>

      <div className="sig-title relative z-10 order-1 px-5 pt-[96px] text-center lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-[9vh] lg:pt-0">
        <p className="eyebrow">The Signature Experience</p>
        <h2 id="signature-title" className="display mx-auto mt-4 max-w-[14ch] text-[clamp(34px,5.5vw,80px)]">
          Entering a <em className="text-gold">film</em>, not a listing.
        </h2>
      </div>

      <div className={`relative z-10 order-3 mt-8 lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:items-end ${reduced ? "" : "lg:pb-[14vh]"}`}>
        <div className="container-lux">
          <div className="relative min-h-[190px] max-w-2xl lg:min-h-[220px]">
            {BEATS.map((b, i) => (
              <div key={b.word} className={reduced ? "mb-8" : `sig-beat ${i === 0 ? "" : "absolute inset-x-0 top-0"} invisible`}>
                <p className="eyebrow mb-2 lg:mb-3">0{i + 1} / 04</p>
                <p className="display text-[clamp(48px,11vw,160px)] italic text-ivory">{b.word}</p>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ivory/75 lg:mt-4 lg:text-[16px]">{b.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex max-w-md gap-2 lg:mt-10" aria-hidden="true">
            {BEATS.map((_, i) => (
              <span key={i} className="relative h-px flex-1 bg-ivory/20">
                <span className={`sig-dot-${i} absolute inset-0 origin-left bg-gold`} style={{ transform: "scaleX(0)" }} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="absolute bottom-5 right-5 z-10 hidden text-[10px] uppercase tracking-wide2 text-ivory/40 lg:right-12 lg:block">AI-assisted concept still</p>
      <p className="order-4 mt-auto px-5 pb-4 pt-3 text-right text-[10px] uppercase tracking-wide2 text-ivory/40 lg:hidden">AI-assisted concept still</p>
    </section>
  );
}
