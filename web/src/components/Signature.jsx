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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current, start: "top top", end: () => "+=" + window.innerHeight * 3,
          pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      // The image opens from a framed window to full-bleed while the camera pushes in
      tl.fromTo(".sig-frame", { clipPath: "inset(22% 26% 22% 26%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, 0)
        .fromTo(".sig-img", { scale: 1.35 }, { scale: 1.02, duration: 4 }, 0)
        .fromTo(".sig-shade", { opacity: 0.1 }, { opacity: 0.55, duration: 1 }, 0.6)
        .fromTo(".sig-title", { autoAlpha: 1 }, { autoAlpha: 0, y: -40, duration: 0.5 }, 0.5);

      // Synchronised words: each fades in, holds, then hands over to the next
      gsap.utils.toArray(".sig-beat").forEach((beat, i) => {
        const start = 1.1 + i * 0.75;
        tl.fromTo(beat, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.3 }, start);
        tl.fromTo(`.sig-dot-${i}`, { scaleX: 0 }, { scaleX: 1, duration: 0.75 }, start);
        if (i < BEATS.length - 1) tl.to(beat, { autoAlpha: 0, y: -60, duration: 0.3 }, start + 0.6);
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="signature" className={`relative overflow-hidden bg-ink ${reduced ? "min-h-[100svh] py-[14vh]" : "h-[100svh]"}`} aria-labelledby="signature-title">
      <div className="sig-frame absolute inset-0 overflow-hidden">
        <Img name="vim-sunset" sizes="100vw" alt="Tropical villa with an infinity pool glowing at dusk — still from Villa in Motion" className="sig-img h-full w-full object-cover" />
        <div className={`sig-shade absolute inset-0 bg-ink ${reduced ? "opacity-60" : "opacity-10"}`} aria-hidden="true" />
      </div>

      <div className="sig-title pointer-events-none absolute inset-x-0 top-[9vh] z-10 text-center">
        <p className="eyebrow">The Signature Experience</p>
        <h2 id="signature-title" className="display mx-auto mt-4 max-w-[14ch] text-[clamp(38px,5.5vw,80px)]">
          Entering a <em className="text-gold">film</em>, not a listing.
        </h2>
      </div>

      <div className={`relative z-10 flex h-full items-end ${reduced ? "pt-[30vh]" : "pb-[14vh]"}`}>
        <div className="container-lux">
          <div className="relative min-h-[220px] max-w-2xl">
            {BEATS.map((b, i) => (
              <div key={b.word} className={reduced ? "mb-8" : `sig-beat ${i === 0 ? "" : "absolute inset-x-0 top-0"} invisible`}>
                <p className="eyebrow mb-3">0{i + 1} / 04</p>
                <p className="display text-[clamp(56px,11vw,160px)] italic text-ivory">{b.word}</p>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ivory/75">{b.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex max-w-md gap-2" aria-hidden="true">
            {BEATS.map((_, i) => (
              <span key={i} className="relative h-px flex-1 bg-ivory/20">
                <span className={`sig-dot-${i} absolute inset-0 origin-left bg-gold`} style={{ transform: "scaleX(0)" }} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="absolute bottom-5 right-5 z-10 text-[10px] uppercase tracking-wide2 text-ivory/40 lg:right-12">AI-assisted concept still</p>
    </section>
  );
}
