import { useEffect, useRef } from "react";
import { gsap } from "../lib/smooth";
import { prefersReducedMotion } from "../lib/env";
import { PROCESS } from "../data/content";

export default function Process() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.fromTo(".pr-head > *", { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, stagger: 0.1, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".pr-head", start: "top 85%" },
      });
      const steps = gsap.utils.toArray(".pr-step");
      const setup = (axis) => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ".pr-line-wrap", start: "top 75%", end: "bottom 45%", scrub: 0.6 },
        });
        tl.fromTo(".pr-line", { [axis]: 0 }, { [axis]: 1, duration: steps.length }, 0);
        steps.forEach((s, i) => {
          tl.fromTo(s, { opacity: 0.28 }, { opacity: 1, duration: 0.4 }, i);
          tl.fromTo(s.querySelector(".pr-dot"), { scale: 0.4, backgroundColor: "rgba(198,164,106,0)" }, { scale: 1, backgroundColor: "#C6A46A", duration: 0.4 }, i);
          tl.fromTo(s.querySelector(".pr-word"), { yPercent: 40 }, { yPercent: 0, duration: 0.6 }, i);
        });
      };
      mm.add("(min-width: 1024px)", () => setup("scaleX"));
      mm.add("(max-width: 1023px)", () => setup("scaleY"));
    }, root);
    return () => { ctx.revert(); mm.revert(); };
  }, []);

  return (
    <section ref={root} id="process" className="relative bg-charcoal py-[16vh]" aria-labelledby="process-title">
      <div className="container-lux">
        <div className="pr-head mb-20 max-w-3xl">
          <p className="eyebrow mb-6 flex items-center gap-4"><span className="h-px w-10 bg-gold" aria-hidden="true" />Our Process</p>
          <h2 id="process-title" className="display text-[clamp(46px,7vw,104px)]">From footage<br /><em className="text-gold">to feeling.</em></h2>
        </div>

        <ol className="pr-line-wrap relative grid gap-14 pl-10 lg:grid-cols-4 lg:gap-10 lg:pl-0 lg:pt-14">
          {/* track + animated gold line */}
          <span className="absolute bottom-0 left-[7px] top-0 w-px bg-ivory/15 lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[7px] lg:h-px lg:w-auto" aria-hidden="true" />
          <span className="pr-line absolute bottom-0 left-[7px] top-0 w-px origin-top bg-gold lg:inset-x-0 lg:bottom-auto lg:left-0 lg:top-[7px] lg:h-px lg:w-auto lg:origin-left" aria-hidden="true" />
          {PROCESS.map((p, i) => (
            <li key={p.title} className="pr-step relative">
              <span className="pr-dot absolute -left-10 top-1 h-[15px] w-[15px] rounded-full border border-gold bg-gold lg:-top-14 lg:left-0" aria-hidden="true" />
              <p className="eyebrow mb-3">Step 0{i + 1}</p>
              <h3 className="overflow-hidden font-serif text-[clamp(36px,3.6vw,54px)] font-light leading-none">
                <span className="pr-word inline-block">{p.title}</span>
              </h3>
              <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ivory/65">{p.text}</p>
              {i < PROCESS.length - 1 && <span className="mt-6 hidden font-serif text-3xl text-gold/60 lg:block" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
