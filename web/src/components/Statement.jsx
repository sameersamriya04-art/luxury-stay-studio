import { useEffect, useRef } from "react";
import { gsap } from "../lib/smooth";
import { prefersReducedMotion } from "../lib/env";
import Img from "./Img";

const LINE1 = "Not just property videos.";
const LINE2 = "A visual experience.";

const words = (text, cls = "") =>
  text.split(" ").map((w, i) => (
    <span key={i} className={`st-word inline-block ${cls}`}>
      {w}&nbsp;
    </span>
  ));

export default function Statement() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Words light up as you scroll
      gsap.fromTo(
        ".st-word",
        { opacity: 0.12, y: 18 },
        {
          opacity: 1, y: 0, stagger: 0.08, ease: "none",
          scrollTrigger: { trigger: ".st-title", start: "top 85%", end: "bottom 45%", scrub: true },
        }
      );
      // Images: clip reveal + gentle 3D tilt + parallax
      gsap.utils.toArray(".st-img").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(18% 12% 18% 12%)", rotationX: 8, scale: 0.94 },
          {
            clipPath: "inset(0% 0% 0% 0%)", rotationX: 0, scale: 1, ease: "none",
            scrollTrigger: { trigger: el, start: "top 95%", end: "top 40%", scrub: true },
          }
        );
        gsap.fromTo(el.querySelector("img"), { yPercent: -8 }, {
          yPercent: 8, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to(el, {
          yPercent: i === 0 ? -14 : -30, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.fromTo(".st-copy", { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".st-copy", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="statement" className="relative overflow-hidden bg-ink py-[16vh]" aria-labelledby="statement-title">
      <div className="container-lux">
        <p className="eyebrow mb-10 flex items-center gap-4"><span className="h-px w-10 bg-gold" aria-hidden="true" />The Studio</p>
        <h2 id="statement-title" className="st-title display max-w-[15ch] text-[clamp(46px,9vw,136px)] uppercase">
          <span className="block">{words(LINE1)}</span>
          <span className="block italic normal-case text-gold">{words(LINE2)}</span>
        </h2>

        <div className="mt-[10vh] grid items-start gap-10 md:grid-cols-12" style={{ perspective: "1200px" }}>
          <figure className="st-img relative overflow-hidden md:col-span-5 md:mt-24">
            <Img name="aoe-living" sizes="(min-width: 768px) 40vw, 100vw" alt="Double-height living room with a marble feature wall and sea view" className="aspect-[4/5] w-full scale-110 object-cover" />
          </figure>
          <div className="md:col-span-6 md:col-start-7">
            <figure className="st-img relative overflow-hidden">
              <Img name="vim-reflection" sizes="(min-width: 768px) 50vw, 100vw" alt="Reflecting pool between two tropical pavilions at sunset" className="aspect-[16/10] w-full scale-110 object-cover" />
            </figure>
            <div className="st-copy mt-12 max-w-md space-y-5 text-[17px] leading-relaxed text-ivory/70">
              <p>
                Luxury Stay Studio is a property cinematics studio for villas, boutique hotels, resorts and
                hospitality brands. We shape light, space and atmosphere into films that guests feel before
                they ever arrive.
              </p>
              <p className="text-ivory/50">
                Remote-first: you supply your photos and footage — we handle direction, editing, colour, sound and
                clearly disclosed AI-assisted concept work.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-10 text-[10px] uppercase tracking-wide2 text-ivory/35">Imagery from LSS AI-assisted concept films</p>
      </div>
    </section>
  );
}
