import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ArrowDown, Play } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/smooth";
import { use3D, isMobile, isFinePointer, prefersReducedMotion } from "../lib/env";
import useInView from "../hooks/useInView";
import Img from "./Img";
import Magnetic from "./Magnetic";
import { onAnchorClick } from "./Header";

const HeroScene = lazy(() => import("../three/HeroScene"));

export default function Hero({ ready }) {
  const section = useRef(null);
  const content = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const progress = useRef(0);
  const [enable3D] = useState(() => use3D());
  const [mobile] = useState(() => isMobile());
  const [sceneReady, setSceneReady] = useState(false);
  const inView = useInView(section, "0px");

  // Mouse position (desktop) → normalised -1..1, read by the 3D scene
  useEffect(() => {
    if (!isFinePointer()) return;
    const move = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // Entrance animation once the intro curtain has lifted
  useEffect(() => {
    if (!ready) return;
    const reduced = prefersReducedMotion();
    const q = gsap.utils.selector(content);
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.fromTo(q(".hero-eyebrow"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: reduced ? 0 : 1.2 })
      .fromTo(q(".line-mask > span"), { yPercent: 110 }, { yPercent: 0, duration: reduced ? 0 : 1.6, stagger: 0.12 }, "<0.1")
      .fromTo(q(".hero-fade"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: reduced ? 0 : 1.2, stagger: 0.1 }, "<0.6");
    return () => tl.kill();
  }, [ready]);

  // Scroll: content drifts up and fades; the 3D camera flies forward
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => { progress.current = self.progress; },
      });
      if (!prefersReducedMotion()) {
        gsap.to(content.current, {
          yPercent: -18, autoAlpha: 0, ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: "70% top", scrub: true },
        });
        gsap.to(".hero-static", {
          scale: 1.12, ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} id="home" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-ink" aria-label="Introduction">
      {/* Static image: first paint, low-power fallback and backdrop under the 3D canvas */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <Img name="hero-cliffside" eager sizes="100vw" className="hero-static h-full w-full object-cover object-[62%_center]" fetchpriority="high" />
      </div>

      {enable3D && (
        <div className={`absolute inset-0 transition-opacity duration-[1600ms] ease-luxe ${sceneReady ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
          <Suspense fallback={null}>
            <HeroScene mouse={mouse} progress={progress} active={inView} mobile={mobile} onReady={() => setSceneReady(true)} />
          </Suspense>
        </div>
      )}

      {/* Readability gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" aria-hidden="true" />

      <div ref={content} className="container-lux relative z-10 flex h-full flex-col justify-end pb-[18vh] pt-28 lg:pb-[16vh]">
        <p className="hero-eyebrow eyebrow invisible mb-6 flex items-center gap-4">
          <span className="h-px w-10 bg-gold" aria-hidden="true" /> <span className="hidden sm:inline">Luxury Stay Studio ·&nbsp;</span>Property Cinematics
        </p>
        <h1 className="display text-[clamp(44px,10.5vw,148px)] text-ivory">
          <span className="line-mask"><span>Where Luxury</span></span>{" "}
          <span className="line-mask"><span><em className="font-light text-gold">Becomes Cinematic.</em></span></span>
        </h1>
        <p className="hero-fade invisible mt-7 max-w-[34rem] text-[clamp(16px,1.5vw,19px)] leading-relaxed text-ivory/75">
          We transform extraordinary properties into unforgettable visual experiences.
        </p>
        <div className="hero-fade invisible mt-10 flex flex-col gap-4 sm:flex-row">
          <Magnetic>
            <a href="#work" onClick={(e) => onAnchorClick(e, "#work")} className="btn btn-gold w-full sm:w-auto">
              <Play size={14} fill="currentColor" aria-hidden="true" /> Explore Our Work
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" onClick={(e) => onAnchorClick(e, "#contact")} className="btn btn-ghost w-full backdrop-blur-sm sm:w-auto">
              Start a Project
            </a>
          </Magnetic>
        </div>
      </div>

      <p className="hero-fade invisible absolute bottom-8 right-5 z-10 hidden text-[11px] tracking-[0.14em] text-ivory/45 sm:block lg:right-12">
        Still from <em>The Art of Escape</em> · AI-assisted concept
      </p>
      <a
        href="#statement"
        onClick={(e) => onAnchorClick(e, "#statement")}
        className="hero-fade invisible absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-luxe text-ivory/60"
        aria-label="Scroll to the next section"
      >
        Scroll <ArrowDown size={14} className="animate-bounce text-gold" aria-hidden="true" />
      </a>
    </section>
  );
}
